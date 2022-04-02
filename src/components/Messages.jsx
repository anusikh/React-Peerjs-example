import React from "react";

const Messages = (props) => {
  const {
    messageList,
    peerId,
    setMessage,
    chatboxRef,
    text,
    remotePeerIdValue,
    message,
  } = props;

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    text(remotePeerIdValue, message);
    chatboxRef.current = "";
  };

  return (
    <div className="Messages__main">
      {messageList.map((x, i) => {
        return (
          <div key={i}>
            <p style={{ color: peerId === x.sender ? "red" : "blue" }}>
              {x.message}
            </p>
            <p>{x.sender}</p>
          </div>
        );
      })}
      <p>
        <textarea onChange={handleChange} ref={chatboxRef} />
      </p>
      <button onClick={handleSend}>Text</button>
    </div>
  );
};

export default Messages;
