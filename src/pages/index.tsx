import React, {
  FormEvent, Fragment, useEffect, useState,
} from 'react';
import dynamic from 'next/dynamic';
import { MessageType } from '@/types';
import io, { Socket } from 'socket.io-client';
import useLocalStorage from '../../@hooks/useLocalStorage';

const UserLoginModal = dynamic(() => import('@/components/user-login-modal'), { ssr: false });
let socket: Socket;

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [user] = useLocalStorage<any>('user', {});
  const [messagesList, setMessagesList] = useState<MessageType[]>([]);

  async function socketInitializer() {
    await fetch('/api/socket?EIO=4&transport=polling');
    socket = io({ path: '/api/socket' });

    socket.on('receive-message', (msg) => {
      console.log('receive-message', msg);
      setMessagesList((pre) => [...pre, msg]);
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
    setMessagesList((pre) => [...pre, { message, userName: user.userName }]);

    socket.emit('send-message', {
      userName: user.userName,
      message,
    });

    setMessage('');
  };

  return (
    <Fragment>
      <div className='container-fluid'>

        <ul id="messages">
          {messagesList.map((data, index) => (
            <li key={index}>
              {data.userName}: {data.message}
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

        {!Object.keys(user).length && <UserLoginModal isDisplay={true} />}
      </div>
    </Fragment>
  );
};

export default HomePage;
