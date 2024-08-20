import React, { useState } from 'react';
import axios from 'axios';
import loginImage from '../assets/images/login.jpg';
import { API_BASE_URL } from '../config';

interface LoginPageProps {
  onLogin: (username: string, token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      if (isSignUp) {
        // Sign Up
        const signupResponse = await axios.post(`${API_BASE_URL}/signup`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        });
        console.log('Signup response:', signupResponse.data);
        setIsSignUp(false);
        setUsername('');
        setPassword('');
        setError('Signup successful. Please log in.');
      } else {
        // Sign In
        const loginResponse = await axios.post(`${API_BASE_URL}/token`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        });
        console.log('Login response:', loginResponse.data);
        const { access_token } = loginResponse.data;
        if (access_token) {
          onLogin(username, access_token);
        } else {
          setError('Login successful, but no token received. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Error details:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        setError(err.response.data.detail || `An error occurred: ${err.response.status}`);
      } else if (err.request) {
        console.error('Request made but no response received');
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Left side - Image */}
      <div style={{
        flex: '1 1 50%',
        maxWidth: '50%',
        overflow: 'hidden'
      }}>
        <img 
          src={loginImage} 
          alt="Login" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }} 
        />
      </div>

      {/* Right side - Login/Signup form */}
      <div style={{
        flex: '1 1 50%',
        maxWidth: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '2rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            {isSignUp ? 'Sign up for LanceDB' : 'Sign in to LanceDB'}
          </h2>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem'
                }}
                required
              />
            </div>
            <button 
              type="submit" 
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              style={{
                color: '#3b82f6',
                marginLeft: '0.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
