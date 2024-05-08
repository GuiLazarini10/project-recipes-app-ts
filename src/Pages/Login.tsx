import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateInput = () => {
      const regex = /\S+@\S+\.\S+/;
      const validTest = regex.test(email) && password.length > 6;
      setIsValid(validTest);
    };

    validateInput();
  }, [email, password]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { type, value } = e.target;
    if (type === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email }));
    navigate('/meals');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={ handleSubmit }>
        <input
          type="email"
          value={ email }
          onChange={ handleChange }
          placeholder="Email"
          data-testid="email-input"
        />
        <input
          type="password"
          value={ password }
          onChange={ handleChange }
          placeholder="Password"
          data-testid="password-input"
        />
        <button disabled={ !isValid } type="submit" data-testid="login-submit-btn">
          Enter
        </button>
      </form>
    </div>
  );
}

export default Login;
