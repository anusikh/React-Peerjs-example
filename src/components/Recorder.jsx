import React from "react";

const Recorder = () => {
  const streamRef = React.useRef(null);
  const voiceStreamRef = React.useRef(null);
  const recorderRef = React.useRef(null);

  async function startRecording() {
    streamRef.current = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    voiceStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    let audio = voiceStreamRef.current.getAudioTracks()[0];
    let video = streamRef.current.getVideoTracks()[0];

    let newStream = new MediaStream([audio, video]);

    recorderRef.current = new MediaRecorder(newStream);

    const chunks = [];
    recorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    recorderRef.current.onstop = (e) => {
      const blob = new Blob(chunks, { type: chunks[0].type });
      console.log(blob);
      streamRef.current.getVideoTracks()[0].stop();

      let filename = "recording";
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    };
    recorderRef.current.start();
  }

  const stopRecording = () => {
    recorderRef.current.stop();
    const tracks = streamRef.current.getTracks();
    tracks.forEach(function (track) {
      track.stop();
    });
  };

  return (
    <>
      <button onClick={startRecording}>Record</button>
      <button onClick={stopRecording}>Stop</button>
    </>
  );
};

export default Recorder;
