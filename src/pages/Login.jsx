import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('username', formData.username)
        .single();

      if (error || !data) {
        setError('Invalid credentials');
        return;
      }

      if (data.password === formData.password) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch(err) {
      setError('Login failed');
    }
  };

  return (
    <div className="bg-dots" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="card shadow-hard-lg" style={{maxWidth: '400px', width: '90%'}}>
        <h2 style={{fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '1rem', lineHeight: '1.2'}}>Welcome to HushLink</h2>
        {error && <div style={{color: 'red', marginBottom: '1rem'}}><b>{error}</b></div>}
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
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
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
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
            <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Login</button>
          </div>
        </form>
        <p style={{marginTop: '2rem', textAlign: 'center'}}>
          Don't have an account? <Link to="/register" style={{color: 'var(--color-black)', textDecoration: 'underline'}}>Register here.</Link>
        </p>
      </div>
    </div>
  );
}
