import { useState, useEffect } from 'react';
import { RevealText } from '../components/ui/RevealText';
import { motion, AnimatePresence } from 'framer-motion';

const ACCOUNTS = [
  {
    name: "Smruti",
    overlayColor: "text-rose-400",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1500534314263-a834e29e35f8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    name: "Rupesh Indua",
    overlayColor: "text-amber-400",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1500534314263-a834e29e35f8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    name: "A",
    overlayColor: "text-emerald-400",
    images: [
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    name: "Huzzlink",
    overlayColor: "text-yellow-300",
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    name: "Sourabh Ranjan Mirdha",
    overlayColor: "text-sky-400",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1500534314263-a834e29e35f8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    name: "Baibhavvvvvvv",
    overlayColor: "text-purple-400",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1500534314263-a834e29e35f8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    name: "nirakarpatel_07",
    overlayColor: "text-orange-400",
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=2070&q=80",
    ],
  },
];

const CYCLE_INTERVAL = 4000; // ms per account name

// Dynamic font sizing — shorter names get bigger text, longer names scale down
function getFontSize(name) {
  const len = name.replace(/\s/g, '').length;
  if (len <= 1) return 'text-[clamp(5rem,20vw,12rem)]';
  if (len <= 6) return 'text-[clamp(3rem,10vw,8rem)]';
  if (len <= 10) return 'text-[clamp(2.5rem,8vw,7rem)]';
  if (len <= 15) return 'text-[clamp(2rem,6vw,5rem)]';
  return 'text-[clamp(1.5rem,4.5vw,3.5rem)]';
}

export default function AccountShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ACCOUNTS.length);
      setAnimKey((prev) => prev + 1);
    }, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const current = ACCOUNTS[activeIndex];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,225,124,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: '#ffe17c',
            color: '#000',
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
            fontFamily: "'Cabinet Grotesk', sans-serif",
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: '2px solid #000',
            boxShadow: '3px 3px 0 0 #000',
          }}
        >
          ⚡ HushLink Community
        </span>
      </motion.div>

      {/* Main reveal text area */}
      <div style={{ position: 'relative', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '95vw', maxWidth: '1200px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            {/* If name has spaces, render each word on its own line */}
            {current.name.includes(' ') ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                {current.name.split(' ').map((word, wordIdx) => (
                  <RevealText
                    key={`${animKey}-${wordIdx}`}
                    text={word.toUpperCase()}
                    textColor="text-white"
                    overlayColor={current.overlayColor}
                    fontSize={getFontSize(current.name)}
                    letterDelay={0.06}
                    overlayDelay={0.04}
                    overlayDuration={0.35}
                    springDuration={500}
                    letterImages={current.images}
                    autoCycle={true}
                    autoCycleSpeed={200}
                  />
                ))}
              </div>
            ) : (
              <RevealText
                text={current.name.toUpperCase()}
                textColor="text-white"
                overlayColor={current.overlayColor}
                fontSize={getFontSize(current.name)}
                letterDelay={0.06}
                overlayDelay={0.04}
                overlayDuration={0.35}
                springDuration={500}
                letterImages={current.images}
                autoCycle={true}
                autoCycleSpeed={200}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hover instruction */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5 }}
        style={{
          marginTop: '2rem',
          color: '#b7c6c2',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontFamily: "'Satoshi', sans-serif",
          letterSpacing: '0.04em',
        }}
      >
        Hover over the letters ✦
      </motion.p>

      {/* Account name pills at bottom */}
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          maxWidth: '700px',
          padding: '0 1rem',
        }}
      >
        {ACCOUNTS.map((account, i) => (
          <motion.button
            key={account.name}
            onClick={() => {
              setActiveIndex(i);
              setAnimKey((prev) => prev + 1);
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: activeIndex === i ? '2px solid #ffe17c' : '2px solid #333',
              background: activeIndex === i ? '#ffe17c' : 'transparent',
              color: activeIndex === i ? '#000' : '#888',
              fontWeight: 700,
              fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
              fontFamily: "'Satoshi', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeIndex === i ? '3px 3px 0 0 #000' : 'none',
            }}
          >
            {account.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
