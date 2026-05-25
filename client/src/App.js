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
    <div>

      <Navbar onSearch={setUsername} />

      <Dashboard
        username={username}
        setUsername={setUsername}
      />

    </div>
  );
}

export default App;