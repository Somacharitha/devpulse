import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [username, setUsername] = useState('');

  return (
    <div>
      <Navbar onSearch={setUsername} />
      <Dashboard username={username} />
    </div>
  );
}

export default App;