import React, { useContext, useEffect, useRef } from 'react';
import {
  Button, Form, InputGroup, FormControl,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

// import { useRollbar } from '@rollbar/react';

import { selectAllMessages } from '../reducers/messagesSlice.js';
import {
  selectCurrentChannelId, selectCurrentChannel,
} from '../reducers/channelsSlice.js';
import webSocketContext from '../webSocketContext.js';
import useAuth from '../useAuth.js';

const ChatWindow = () => {
  // const rollbar = useRollbar();

  const webSocket = useContext(webSocketContext);
  const authInfo = useAuth();
  const inputRef = useRef();
  const endElement = useRef();
  const { t } = useTranslation();

  const messages = useSelector(selectAllMessages);

  const currentChannelId = useSelector(selectCurrentChannelId);
  const currentChannel = useSelector(selectCurrentChannel);

  const messagesForActiveChannel = messages
    ?.filter((message) => message.channelId === currentChannelId);

  useEffect(() => {
    inputRef.current.focus();
    endElement.current?.scrollIntoView({ behavior: 'smooth' });
  });

  const renderHeader = () => {
    if (!currentChannelId) {
      return null;
    }

    const { name } = currentChannel;
    return (
      <div className="mb-3 p-2">
        <h6>
          <b>{t('chatWindow.title', { channelName: name })}</b>
          <p>{t('chatWindow.messageCount.counter', { count: messagesForActiveChannel.length })}</p>
        </h6>
      </div>
    );
  };

  const renderMessages = () => {
    if (!messagesForActiveChannel) {
      return null;
    }

    const chatMessages = messagesForActiveChannel
      .map(({ body, username, id }) => (
        <div key={id} className="mb-2">
          <b>
            {`${username}: `}
          </b>
          {body}
        </div>
      ));

    return (
      <div className="overflow-auto">
        {chatMessages}
        <div ref={endElement} />
      </div>
    );
  };

  const renderTextInput = () => {
    const formik = useFormik({
      initialValues: {
        message: '',
      },
      onSubmit: (values) => {
        const newMessage = {
          username: authInfo.username,
          body: values.message,
          channelId: currentChannelId,
        };

        if (newMessage.body === 'ктулху фхтагн') {
          // rollbar.log("It's hello");
          // rollbar.error('unacceptable message');
          throw new Error();
        }

        webSocket.sendMessage(newMessage);
        formik.resetForm();
        inputRef.current.focus();
      },
    });

    return (
      <Form onSubmit={formik.handleSubmit}>
        <InputGroup className="mb-2">
          <FormControl
            name="message"
            id="message"
            placeholder={t('chatWindow.messagePlaceholder')}
            ref={inputRef}
            value={formik.values.message}
            onChange={formik.handleChange}
            aria-label="message"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Append>
            <Button
              variant="primary"
              type="submit"
              disabled={!formik.dirty}
            >
              {t('chatWindow.sendButton')}
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    );
  };

  return (
    <>
      <div className="d-flex flex-column h-100">
        {renderHeader()}
        {renderMessages()}
        <div className="mt-auto px-5 py-3">
          {renderTextInput()}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
