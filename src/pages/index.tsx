import React, {
  FormEvent, Fragment, useEffect, useState,
} from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import io, { Socket } from 'socket.io-client';
import { MessageType, UserType, userDefault } from '@/types';
import useLocalStorage from '../../@hooks/useLocalStorage';

const UserLoginModal = dynamic(() => import('@/components/user-login-modal'), { ssr: false });
let socket: Socket;

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [user] = useLocalStorage<UserType>('user', userDefault);
  const [messagesList, setMessagesList] = useState<MessageType[]>([]);

  async function socketInitializer() {
    await fetch('/api/socket?EIO=4&transport=polling');
    socket = io({ path: '/api/socket' });

    socket.on('receive-message', (msg: MessageType) => {
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

    const msg: MessageType = {
      message,
      userId: user.userId,
      messageId: uuidv4(),
      userName: user.userName,
      timestamp: new Date(),
    };

    socket.emit('send-message', msg);
    setMessagesList((pre) => [...pre, msg]);
    setMessage('');
  };

  return (
    <Fragment>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>

            <ul>
              {messagesList.map((data, index) => {
                const msgAlignClass = data.userId === user.userId ? 'text-right' : 'text-left';
                const msgColorClass = data.userId === user.userId ? 'bg-primary' : 'bg-secondary';

                return (
                  <li key={index} className={`py-1 ${msgAlignClass}`}>
                    <div className={`d-inline-block px-3 py-1 text-white rounded ${msgColorClass}`}>
                      <div className={`small mb-1 text-light font-weight-bold ${msgAlignClass}`}>{data.userName}</div>
                      <div>{data.message}</div>
                      <div className='small text-right'>
                        {`${new Date(data.timestamp).getHours()} : ${new Date(data.timestamp).getMinutes()}`}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <form id="form" onSubmit={handleSubmit}>
              <input
                id="input"
                name="message"
                value={message}
                autoComplete={'off'}
                placeholder="Message"
                onChange={(e) => setMessage(e.target.value)}
              />
              <button>Send</button>
            </form>

            {!user.userId && <UserLoginModal isDisplay={true} />}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
