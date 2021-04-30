import React from 'react';

const Notification = ({ message, messageClass }) =>
  message === null ? null : <div className={`${messageClass} message`}>{message}</div>;

export default Notification;
