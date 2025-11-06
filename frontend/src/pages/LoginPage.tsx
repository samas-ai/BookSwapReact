import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/axios';
import axios from 'axios';
import './LoginPage.css';
import logo from '../assets/images/logo-bookswap.png';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      // Use axios directly for auth endpoint so the default Authorization header
      // (if present) from the api instance is NOT sent. Sending an invalid/expired
      // token in the Authorization header can make the token-obtain view fail
      // with "Given token not valid for any token type" before credentials are checked.
      const response = await axios.post(`${api.defaults.baseURL}/token/`, {
        username,
        password,
      });

      const { access } = response.data;
      await signIn(access);
      navigate('/'); // Redirect to home page after login
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        console.error('login error full:', data);
        // Prefer messages array if present, otherwise detail
        if (data.messages && Array.isArray(data.messages)) {
          const msgs = data.messages
            .map((m: any) => (m.message ? `${m.token_type || ''}: ${m.message}` : JSON.stringify(m)))
            .join(' ');
          setError(msgs);
        } else if (data.detail) {
          setError(String(data.detail));
        } else {
          setError('Failed to login. Please check your credentials.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <>
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img className="logo" src={logo} alt="logo-bookswap" />
        <h2>Bem vindo ao Bookswap</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <label className='link-register'>Não tem uma conta? <a href="register">Registre-se</a></label>
      </form>
    </div>
    </>
  );
}
