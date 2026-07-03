import React, { useState } from 'react';

import Register from './pages/register';
import Login from './pages/login';


function App(){
  const [view, setView] = useState('register'); {/*default registerpage for now*/}
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {/*Register*/}
        <button onClick={() => setView('register')}
                style={{ padding: '8px 16px', cursor: 'pointer' }} >
        Register
        </button>
        <button onClick={() => setView('login')}
                style={{ padding: '8px 16px', cursor: 'pointer' }} >
        Login
        </button>
      </nav>
      <hr />
      <main style={{ marginTop: '20px' }}>
        {view === 'register' && <Register />}
        {view === 'login' && <Login />}
      </main>
      

    </div>
  )
}

export default App;