// frontend/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import axios from 'axios';
import './RegisterPage.css';
import logo from '../assets/images/logo-bookswap.png';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');


    if (password !== password2) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await api.post('/users/', {
        username,
        email,
        full_name: fullName,
        password,
      });
      
      navigate('/login');

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        const formatErrorValue = (v: any) => {
          if (Array.isArray(v)) return v.join(' ');
          if (v && typeof v === 'object') {
            // quando v é um objeto (por exemplo {field: ["error"]} ou nested errors)
            return Object.values(v)
              .map((x: any) => (Array.isArray(x) ? x.join(' ') : String(x)))
              .join(' ');
          }
          return String(v);
        };

        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${formatErrorValue(value)}`)
          .join(' ');

        setError(errorMessages || 'Falha ao registar. Verifique os dados.');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="register-form">
        <img className="logo" src={logo} alt="logo-bookswap" />
        <h2>Criar Conta</h2>
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

        {/* --- CAMPO ADICIONAL: E-MAIL --- */}
        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* --- CAMPO ADICIONAL: NOME COMPLETO --- */}
        <div className="input-group">
          <label htmlFor="fullName">Nome Completo</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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

        {/* --- CAMPO ADICIONAL: CONFIRMAR PASSWORD --- */}
        <div className="input-group">
          <label htmlFor="password2">Confirmar Password</label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>

        <button type="submit">Registar</button>
        <label className='link-register'>Já tem uma conta? <a href="login">Entrar</a></label>
      </form>
    </div>
  );
}