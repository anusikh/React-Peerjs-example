import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import "./App.css";
import Messages from "./components/Messages";
import TextEditor from "./components/TextEditor";
import Recorder from "./components/Recorder";

function App() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [message, setMessage] = useState("");
  const [textEditor, setTextEditor] = useState("");
  const [messageList, setMessageList] = useState([]);
  const chatboxRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    const peer = new Peer({
      host: "/",
      port: 3001,
      path: "/",
    });

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        if (data.type === "message") {
          setRemotePeerIdValue(data.sender);
          setMessageList((prevState) => [...prevState, data]);
        } else {
          setRemotePeerIdValue(data.sender);
          setTextEditor(data.message);
          console.log(data);
        }
      });
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const text = (remotePeerId, message) => {
    const x = peerInstance.current.connect(remotePeerId);
    x.on("open", () => {
      let data = {
        message: message,
        sender: peerId,
        type: "message",
      };

      setMessageList((prevState) => [...prevState, data]);

      x.send(data);
    });
  };

  const editor = (remotePeerId, message) => {
    const x = peerInstance.current.connect(remotePeerId);
    x.on("open", () => {
      let data = {
        message: message,
        sender: peerId,
        type: "text-editor",
      };
      x.send(data);
    });
  };

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      const call = peerInstance.current.call(remotePeerId, mediaStream);

      mediaStreamRef.current = mediaStream;

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  const handleDisconnect = () => {
    const tracks = mediaStreamRef?.current.getTracks();

    tracks.forEach((track) => track.stop());

    for (let conn in peerInstance.current.connections) {
      peerInstance.current.connections[conn].forEach((conn, i, arr) => {
        conn.peerConnection.close();
        if (conn.close) conn.close();
      });
      remoteVideoRef.current.srcObject = null;
    }
  };

  return (
    <div className="App">
      <h4>current user: {peerId}</h4>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>call</button>
      <button onClick={handleDisconnect}>cut</button>

      <div>
        <video ref={remoteVideoRef} />
      </div>

      <Messages
        messageList={messageList}
        peerId={peerId}
        message={message}
        setMessage={setMessage}
        chatboxRef={chatboxRef}
        remotePeerIdValue={remotePeerIdValue}
        text={text}
      />

      <TextEditor
        textEditor={textEditor}
        setTextEditor={setTextEditor}
        remotePeerIdValue={remotePeerIdValue}
        editor={editor}
      />

      <Recorder />
    </div>
  );
}

export default App;
