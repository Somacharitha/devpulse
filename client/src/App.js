import { useState } from 'react';

import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';

import Auth from './pages/Auth/Auth';

function App() {

  const [username, setUsername] = useState('');

  const token = localStorage.getItem('token');

  // NOT LOGGED IN
  if (!token) {
    return <Auth />;
  }

  // LOGGED IN
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onSearch={setUsername} showSearch={!!username} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Dashboard username={username} setUsername={setUsername} />
      </div>
    </div>
  );
}

export default App;