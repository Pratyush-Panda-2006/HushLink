import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState('discover');
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  
  const [activeChat, setActiveChat] = useState(null);
  const [hiddenChats, setHiddenChats] = useState([]);
  const activeChatRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar' or 'chat'
  const messagesEndRef = useRef(null);
  
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    const savedHidden = localStorage.getItem(`hiddenChats_${user.id}`);
    if (savedHidden) {
      setHiddenChats(JSON.parse(savedHidden));
    }

    fetchUsers(user.id);
    fetchRequests(user.id);
    fetchFriends(user.id);

    // Request desktop notifications if possible
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Setup Supabase Realtime Presence Channel to track Live online users
    const presenceChannel = supabase.channel('online-users', {
      config: {
        presence: { key: user.id },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        setOnlineUsers(Object.keys(newState));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ online_at: new Date().toISOString() });
        }
      });

    // Setup Supabase Realtime subscription for incoming messages
    const messageChannel = supabase
      .channel('public:Message')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message' }, (payload) => {
        const msg = payload.new;
        
        // If the message is related to us (sent or received)
        if (msg.receiverId === user.id || msg.senderId === user.id) {
          
          // Only pop it onto the CURRENT screen if we are looking at the person who sent/received it
          const currentVirtualChat = activeChatRef.current;
          const isMatchedChat = currentVirtualChat && (msg.senderId === currentVirtualChat.id || msg.receiverId === currentVirtualChat.id);

          if (isMatchedChat) {
            setMessages((prev) => {
              // Deduplicate: if the message ID already exists (from optimistic UI update), don't add it again!
              if (prev.some(m => m.id === msg.id)) return prev;
              const newList = [...prev, msg];
              // Sort to guarantee correct chronological order
              return newList.sort((a, b) => {
                const getTime = (timestamp) => {
                  if (!timestamp) return 0;
                  const tStr = (!timestamp.endsWith('Z') && !timestamp.includes('+')) ? timestamp + 'Z' : timestamp;
                  return new Date(tStr).getTime();
                };
                return getTime(a.createdAt) - getTime(b.createdAt);
              });
            });
          } else if (msg.receiverId === user.id) {
            // It's a new message for a DIFFERENT chat. Send Notification!
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(`New message!`, { body: msg.content });
            }
            
            // Unhide chat if it was hidden
            setHiddenChats(prev => {
              if (prev.includes(msg.senderId)) {
                const updated = prev.filter(id => id !== msg.senderId);
                localStorage.setItem(`hiddenChats_${user.id}`, JSON.stringify(updated));
                return updated;
              }
              return prev;
            });

            fetchFriends(user.id); // Refresh left sidebar just in case
          }
        }
      })
      .subscribe();

    // Setup Supabase Realtime subscription for incoming friend requests
    const requestChannel = supabase
      .channel('public:ChatRequest')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ChatRequest' }, () => {
        fetchRequests(user.id);
        fetchFriends(user.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(requestChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [navigate]);

  const fetchUsers = async (userId) => {
    const { data } = await supabase.from('User').select('*').neq('id', userId);
    if (data) setUsers(data);
  };

  const fetchRequests = async (userId) => {
    const { data: reqs } = await supabase.from('ChatRequest').select('*').eq('receiverId', userId).eq('status', 'PENDING');
    if (reqs && reqs.length > 0) {
      const { data: allUsers } = await supabase.from('User').select('*');
      const enrichedReqs = reqs.map(r => ({
        ...r,
        sender: allUsers.find(u => u.id === r.senderId) || { username: 'Unknown' }
      }));
      setRequests(enrichedReqs);
    } else {
      setRequests([]);
    }
  };

  const fetchFriends = async (userId) => {
    const { data: reqs } = await supabase.from('ChatRequest').select('*').eq('status', 'ACCEPTED').or(`senderId.eq.${userId},receiverId.eq.${userId}`);
    const { data: msgs } = await supabase.from('Message').select('*').or(`senderId.eq.${userId},receiverId.eq.${userId}`);
    
    const { data: allUsers } = await supabase.from('User').select('*');
    if (!allUsers) return;

    const friendIds = new Set();
    (reqs || []).forEach(r => friendIds.add(r.senderId === userId ? r.receiverId : r.senderId));
    (msgs || []).forEach(m => friendIds.add(m.senderId === userId ? m.receiverId : m.senderId));

    const friendList = allUsers.filter(u => friendIds.has(u.id));
    setFriends(friendList);
  };

  const loadChat = async (friend) => {
    setActiveChat(friend);
    // REMOVED 'setTab("chat")' HERE SO SIDEBAR LIST STAYS VISIBLE!
    setMobileView('chat');
    
    // Unhide if it was hidden
    setHiddenChats(prev => {
      if (prev.includes(friend.id)) {
         const newHidden = prev.filter(id => id !== friend.id);
         if (currentUser?.id) {
           localStorage.setItem(`hiddenChats_${currentUser.id}`, JSON.stringify(newHidden));
         }
         return newHidden;
      }
      return prev;
    });
    
    const { data } = await supabase
      .from('Message')
      .select('*')
      .or(`and(senderId.eq.${currentUser.id},receiverId.eq.${friend.id}),and(senderId.eq.${friend.id},receiverId.eq.${currentUser.id})`)
      .order('createdAt', { ascending: true });
      
    const sortedData = (data || []).sort((a, b) => {
      const getTime = (timestamp) => {
        if (!timestamp) return 0;
        const tStr = (!timestamp.endsWith('Z') && !timestamp.includes('+')) ? timestamp + 'Z' : timestamp;
        return new Date(tStr).getTime();
      };
      return getTime(a.createdAt) - getTime(b.createdAt);
    });
      
    setMessages(sortedData);
  };

  const sendRequest = async (receiverId) => {
    const { data: existing } = await supabase.from('ChatRequest').select('*').eq('senderId', currentUser.id).eq('receiverId', receiverId).single();
    if (existing) {
      alert('Request already sent!');
      return;
    }
    await supabase.from('ChatRequest').insert([{ id: crypto.randomUUID(), senderId: currentUser.id, receiverId }]);
    alert('Request sent!');
  };

  const acceptRequest = async (requestId) => {
    await supabase.from('ChatRequest').update({ status: 'ACCEPTED' }).eq('id', requestId);
    alert('Request accepted!');
    fetchRequests(currentUser.id);
    fetchFriends(currentUser.id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      receiverId: activeChat.id,
      content: messageInput,
      isAnonymous: false,
      createdAt: new Date().toISOString() // add timestamp for optimistic UI
    };
    
    // We optimism to display right side fast while DB processes
    setMessages((prev) => {
      const newList = [...prev, newMessage];
      return newList.sort((a, b) => {
        const getTime = (timestamp) => {
          if (!timestamp) return 0;
          const tStr = (!timestamp.endsWith('Z') && !timestamp.includes('+')) ? timestamp + 'Z' : timestamp;
          return new Date(tStr).getTime();
        };
        return getTime(a.createdAt) - getTime(b.createdAt);
      });
    });
    
    await supabase.from('Message').insert([newMessage]);
    setMessageInput('');
  };

  const removeChat = async (e, friendId) => {
    e.stopPropagation();

    // Hide the chat locally instead of deleting messages permanently
    setHiddenChats(prev => {
      if (prev.includes(friendId)) return prev;
      const newHidden = [...prev, friendId];
      if (currentUser?.id) {
        localStorage.setItem(`hiddenChats_${currentUser.id}`, JSON.stringify(newHidden));
      }
      return newHidden;
    });
    
    if (activeChat?.id === friendId) {
      setActiveChat(null);
      setMessages([]);
      setMobileView('sidebar');
    }
  };


  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`dash-sidebar-col ${mobileView === 'sidebar' ? 'mobile-active' : 'mobile-hidden'}`}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-dark-gray)' }}>
          <h2 style={{margin: 0, fontFamily: 'var(--font-heading)'}}>HushLink</h2>
          <p style={{margin: 0, opacity: 0.7}}>Welcome, {currentUser.username} ({currentUser.type})</p>
        </div>
        
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-dark-gray)' }}>
          <button className={`tab-btn ${tab === 'discover' ? 'active' : ''}`} onClick={() => setTab('discover')}>Discover</button>
          <button className={`tab-btn ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>Requests ({requests.length})</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {tab === 'discover' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {users.map(u => (
                <div key={u.id} className="card" style={{padding: '1rem', background: 'var(--color-dark-gray)', color: 'var(--color-white)', borderColor: 'var(--color-black)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <h3 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                       {u.username}
                       {onlineUsers.includes(u.id) && <span style={{fontSize: '0.7rem', color: '#10b981', border: '1px solid #10b981', padding: '0.1rem 0.3rem', borderRadius: '4px'}}>🟢 Live</span>}
                     </h3>
                    <span className="pill" style={{color: 'black', background: u.type === 'Local' ? 'var(--color-primary)' : 'var(--color-accent)'}}>{u.type}</span>
                  </div>
                  {u.type === 'Local' ? (
                    <button className="btn btn-primary" style={{marginTop: '1rem', padding: '0.5rem 1rem', width: '100%'}} onClick={() => loadChat(u)}>
                      Talk Now
                    </button>
                  ) : (
                    <button className="btn btn-secondary" style={{marginTop: '1rem', padding: '0.5rem 1rem', width: '100%'}} onClick={() => sendRequest(u.id)}>
                      Send Request to Talk
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'requests' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {requests.length === 0 ? <p>No pending requests.</p> : requests.map(r => (
                <div key={r.id} className="card" style={{padding: '1rem', background: 'var(--color-white)', color: 'black'}}>
                  <h3 style={{margin: 0}}>{r.sender?.username} wants to talk</h3>
                  <button className="btn btn-primary" style={{marginTop: '1rem', padding: '0.5rem 1rem', background: '#10b981'}} onClick={() => acceptRequest(r.id)}>
                    Accept Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friends / Active Chats List bottom area */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-dark-gray)', background: '#171e19' }}>
          <h3 style={{marginTop: 0, marginBottom: '0.5rem'}}>Active Chats</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {friends.filter(f => !hiddenChats.includes(f.id)).map(f => (
              <div 
                key={f.id} 
                className="active-chat-btn"
                style={{display: 'flex', alignItems: 'center', padding: '0.5rem', background: activeChat?.id === f.id ? 'var(--color-primary)' : 'transparent', color: activeChat?.id === f.id ? 'black' : 'white', borderRadius: '4px', border: activeChat?.id === f.id ? 'var(--border-thick)' : '1px solid transparent', cursor: 'pointer'}}
                onClick={() => loadChat(f)}
              >
                <div style={{flex: 1}}>
                  {onlineUsers.includes(f.id) && '🟢 '}
                  {f.username}
                </div>
                <button 
                  onClick={(e) => removeChat(e, f.id)} 
                  style={{background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.5rem', opacity: 0.7}}
                  title="Remove chat"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`dash-chat-col ${mobileView === 'chat' ? 'mobile-active' : 'mobile-hidden'}`}>
        {activeChat ? (
          <>
            <div style={{ padding: '1.5rem', background: 'var(--color-white)', borderBottom: 'var(--border-thick)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="mobile-only-btn btn btn-secondary" style={{padding: '0.4rem 0.8rem', borderRadius: '4px'}} onClick={() => { setMobileView('sidebar'); }}>
                &larr; Back
              </button>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 Chat with {activeChat.username}
                 {onlineUsers.includes(activeChat.id) && <span style={{fontSize: '0.8rem', color: '#10b981', border: '1px solid #10b981', padding: '0.1rem 0.4rem', borderRadius: '4px'}}>Live</span>}
              </h2>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
              {messages.map(m => {
                const isMine = m.senderId === currentUser.id;
                // Since anonymous mode is disabled, always resolve to real usernames.
                const displayName = m.isAnonymous ? "Anonymous" : (isMine ? "You" : activeChat.username);
                
                // Format the timestamp beautifully with actual date and correct local time parsing
                let timestamp = '';
                if (m.createdAt) {
                  let timeStr = m.createdAt;
                  if (!timeStr.endsWith('Z') && !timeStr.includes('+')) {
                    timeStr += 'Z'; // Enforce UTC if timezone is missing
                  }
                  const d = new Date(timeStr);
                  if (!isNaN(d.getTime())) {
                    timestamp = d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }
                }
                
                return (
                  <div key={m.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '60%' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.2rem', textAlign: isMine ? 'right' : 'left', display: 'flex', gap: '0.4rem', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <span>{displayName}</span>
                      <span>•</span>
                      <span>{timestamp}</span>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-lg)', 
                      border: 'var(--border-thick)', 
                      background: isMine ? 'var(--color-primary)' : 'var(--color-white)',
                      boxShadow: '4px 4px 0px 0px black'
                    }}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--color-white)', borderTop: 'var(--border-thick)' }}>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ flex: 1 }} 
                  placeholder="Type a message..." 
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <h2>Select a user from Discover or Active Chats to begin.</h2>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          background: var(--color-light-gray);
        }
        .dash-sidebar-col {
          width: 300px;
          background: var(--color-base);
          color: var(--color-white);
          display: flex;
          flex-direction: column;
          border-right: var(--border-thick);
        }
        .dash-chat-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fffdf9;
        }
        .mobile-only-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .dash-sidebar-col {
            width: 100%;
            border-right: none;
            display: none;
          }
          .dash-chat-col {
            display: none;
          }
          .dash-sidebar-col.mobile-active {
            display: flex;
          }
          .dash-chat-col.mobile-active {
            display: flex;
          }
          .mobile-only-btn {
            display: inline-flex;
          }
        }

        .tab-btn {
          flex: 1;
          padding: 1rem;
          background: transparent;
          color: white;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-weight: 700;
        }
        .tab-btn.active {
          border-bottom: 2px solid var(--color-primary);
          color: var(--color-primary);
        }
        .tab-btn:hover {
          background: rgba(255,255,255,0.05);
        }
        .active-chat-btn:hover {
          border: 1px solid var(--color-accent) !important;
        }
      `}</style>
    </div>
  );
}
