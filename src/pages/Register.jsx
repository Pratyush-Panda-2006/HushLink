import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', type: 'Local' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const email = `${formData.username.toLowerCase()}@hushlink.app`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
            setError('Username taken');
        } else {
            setError(authError.message);
        }
        return;
      }

      const userId = authData.user.id;

      const profileData = { 
        id: userId,
        username: formData.username, 
        type: formData.type || 'Local' 
      };

      const { error: insertError } = await supabase
        .from('User')
        .insert([profileData]);

      if (insertError) {
        setError(insertError.message);
      } else {
        localStorage.setItem('user', JSON.stringify(profileData));
        navigate('/dashboard');
      }
    } catch(err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="bg-dots" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="card shadow-hard-lg" style={{maxWidth: '500px', width: '90%'}}>
        <h2 style={{fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '1rem'}}>Join HushLink</h2>
        {error && <div style={{color: 'red', marginBottom: '1rem'}}><b>{error}</b></div>}
        <form onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 700}}>Username</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <div className="form-group">
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 700}}>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
                Show Password
              </label>
            </div>
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 700}}>Account Type</label>
            <div style={{display: 'flex', gap: '1rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <input 
                  type="radio" 
                  name="type" 
                  value="Local" 
                  checked={formData.type === 'Local'}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                /> 
                <span><b>Local</b> (Anyone can message you immediately)</span>
              </label>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <input 
                  type="radio" 
                  name="type" 
                  value="Private" 
                  checked={formData.type === 'Private'}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                /> 
                <span><b>Private</b> (Requires a chat request approval)</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Create Account</button>
        </form>
        <p style={{marginTop: '2rem', textAlign: 'center'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--color-black)', textDecoration: 'underline'}}>Log in here.</Link>
        </p>
      </div>
    </div>
  );
}
