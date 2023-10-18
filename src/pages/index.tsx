import React, { FormEvent, Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import io, { Socket } from 'socket.io-client';
import { MessageType, UserType, userDefault } from '@/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import useLocalStorage from '../../@hooks/useLocalStorage';

const UserLoginModal = dynamic(() => import('@/components/user-login-modal'), { ssr: false });
let socket: Socket;

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [msgOffset, setMsgOffset] = useState(10);

  const [user] = useLocalStorage<UserType>('user', userDefault);
  const [messagesList, setMessagesList] = useState<MessageType[]>([]);

  async function socketInitializer() {
    const data = await fetch('/api/sheet-action?limit=10&offset=0');
    const messageData = await data.json();

    setMessagesList([
      ...messageData.map((x: any) => ({
        message: x.data.message,
        userId: x.data.user_id,
        userName: x.data.user_name,
        timestamp: x.data.timestamp,
        messageId: x.data.message_id,
      })),
    ]);

    await fetch('/api/socket?EIO=4&transport=polling');
    socket = io({ path: '/api/socket' });

    socket.on('receive-message', (msg: MessageType) => {
      console.log('receive-message', msg);
      setMessagesList((pre) => [msg, ...pre]);
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
    if (!message.trim()) {
      return;
    }
    const msg: MessageType = {
      message,
      userId: user.userId,
      messageId: uuidv4(),
      userName: user.userName,
      timestamp: new Date(),
    };

    socket.emit('send-message', msg);
    setMessagesList((pre) => [msg, ...pre]);
    setMessage('');
  };

  const fetchData = async () => {
    const data = await fetch(`/api/sheet-action?limit=10&offset=${msgOffset}`);
    const messageData = await data.json();
    setMsgOffset((prev) => prev + 10);

    if (messageData.length < 10) {
      setHasMore(false);
    }

    setMessagesList((pre) => [
      ...pre,
      ...messageData.map((x: any) => ({
        message: x.data.message,
        userId: x.data.user_id,
        userName: x.data.user_name,
        timestamp: x.data.timestamp,
        messageId: x.data.message_id,
      })),
    ]);

    return messageData;
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <ul
              className="mb-5 vh-100"
              id="msg-box"
              style={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
              }}
            >
              <InfiniteScroll
                inverse={true}
                next={fetchData}
                hasMore={hasMore}
                dataLength={messagesList.length}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                scrollableTarget="msg-box"
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                {messagesList.map((data, index) => {
                  const msgAlignClass = data.userId === user.userId ? 'text-right' : 'text-left';
                  const msgColorClass = data.userId === user.userId ? 'bg-primary' : 'bg-secondary';

                  return (
                    <li key={index} className={`py-1 ${msgAlignClass}`}>
                      <div
                        className={`d-inline-block px-3 py-1 text-white rounded ${msgColorClass}`}
                      >
                        <div className={`small mb-1 text-light font-weight-bold ${msgAlignClass}`}>
                          {data.userName}
                        </div>
                        <div>{data.message}</div>
                        <div className="small text-right">
                          {`${new Date(data.timestamp).getHours()} : ${new Date(
                            data.timestamp
                          ).getMinutes()}`}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </InfiniteScroll>
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
              <button type="submit" disabled={!message.trim()} className="send-button">
                Send
              </button>
            </form>

            {!user.userId && <UserLoginModal isDisplay={true} />}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
