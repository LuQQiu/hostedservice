import React, { useState } from 'react';
import loginImage from '../assets/images/login.jpg';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Left side - Image */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%' }}>
        <img src={loginImage} alt="Login" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Right side - Login form */}
      <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Sign in to LanceDB</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                required
              />
            </div>
            <button 
              type="submit" 
              style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Sign In
            </button>
          </form>
          <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
            Don't have an account? <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;