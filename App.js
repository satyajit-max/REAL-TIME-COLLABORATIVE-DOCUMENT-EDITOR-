import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [content, setContent] = useState('');

  useEffect(() => {
    socket.on('doc-update', (data) => setContent(data));
    return () => socket.off('doc-update');
  }, []);

  const handleChange = (e) => {
    setContent(e.target.value);
    socket.emit('doc-change', e.target.value);
  };

  return (
    <div>
      <h1>Collaborative Editor</h1>
      <textarea value={content} onChange={handleChange} rows="20" cols="80" />
    </div>
  );
}

export default App;
