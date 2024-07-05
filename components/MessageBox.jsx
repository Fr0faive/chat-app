import { format } from "date-fns";
import React from "react";

const MessageBox = ({ message, currentUser }) => {
  return message?.sender?._id !== currentUser?._id ? (
    <div className="message-box">
      <img
        src={message?.sender?.profileImage || "/assets/person.jpg"}
        alt="profile-Photo"
        className="message-profilePhoto"
      />
      <div className="message-info">
        <div className="text-small-bold flex justify-between">
          <p>{message?.sender?.username}</p>
          <p>{format(new Date(message?.createdAt), "p")}</p>
        </div>
        {message?.text ? (
          <p className="message-text">{message?.text}</p>
        ) : (
          <img src={message?.photo} alt="photo" className="message-photo" />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>
        {message?.text ? (
          <p className="message-text">{message?.text}</p>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
