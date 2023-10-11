import io, { Socket } from 'socket.io-client';
import React, {
  FormEvent, Fragment, useEffect, useState,
} from 'react';

let socket: Socket;

const HomePage = () => {
  const [message, setMessage] = useState('');
  // const [username, setUsername] = useState('');
  const [allMessages, setAllMessages] = useState<any[]>([]);

  async function socketInitializer() {
    await fetch('/api/socket?EIO=4&transport=polling');
    socket = io({ path: '/api/socket' });

    socket.on('receive-message', (msg) => {
      console.log('receive-message', msg);
      setAllMessages((pre) => [...pre, msg]);
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  useEffect(() => {
    socketInitializer();

    return () => {
      // Disconnect user
      socket?.disconnect();
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    socket.emit('send-message', {
      // username,
      message,
    });

    setMessage('');
  };

  return (
    <Fragment>
      {/* <input value={username} onChange={(e) => setUsername(e.target.value)} /> */}

      <ul id="messages">
        {allMessages.map((data, index) => (
          <li key={index}>
            Raju: {data.message}
          </li>
        ))}
      </ul>

      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          name="message"
          value={message}
          autoComplete={'off'}
          placeholder="enter your message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </Fragment>
  );
};

export default HomePage;
