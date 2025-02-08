import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/login`, {
        phoneNumber: phone,
        password,
      });
  
      const token = response.data.accessToken;
      localStorage.setItem('accessToken', token)
  
      navigate('/');
    } catch (error) {
      alert('Неверные данные для входа');
    }
  };
  

  return (
    <div className="container">
    <div className="login-wrapper">
      <div className="login-form">
        <h2 className="form-title">Вход</h2>

        <div className="input-group">
          <label htmlFor="phone" className="input-label">Номер телефона</label>
          <input
            id="phone"
            type="tel"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Введите номер телефона"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">Пароль</label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </div>

        <button className="login__btn default-btn reverse" onClick={handleLogin}>
          Войти
        </button>
      </div>
    </div>
    </div>

  );
}
