import { useState } from 'react';
import './Auth.css';

function Auth() {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const endpoint = isLogin
        ? 'login'
        : 'register';

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/${endpoint}`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // SAVE TOKEN
      localStorage.setItem('token', data.token);
      localStorage.setItem(
  'user',
  JSON.stringify(data.user)
);
      window.location.reload();

      alert(
        isLogin
          ? 'Login successful'
          : 'Registration successful'
      );

      console.log(data);

    } catch (error) {

      console.log(error);

      alert('Authentication failed');
    }
  };

  return (

    <div className="auth-page">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <h2>
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">

          {isLogin ? 'Login' : 'Register'}

        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            cursor: 'pointer'
          }}
        >

          {isLogin
            ? 'Create new account'
            : 'Already have an account? Login'
          }

        </p>

      </form>

    </div>
  );
}

export default Auth;