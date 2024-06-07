import { useEffect, useState, useRef, useCallback } from "react";
import { useConversation } from "../../context/ConversationsProvider";
import { useSocket } from "../../context/SocketProvider";
import peer from "../../service/peer";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";


function RecieveCall({id}) {
    const {selectedConversation} = useConversation();
    const [caller, setCaller] = useState();
    const [reciever, setReciever] = useState();
    const [myStream, setMyStream] = useState();
    const myStreamRef = useRef();
    const [remoteStream, setRemoteStream] = useState();
    const navigate = useNavigate();
    const socket = useSocket();


    const handleRecieveUser = useCallback(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      // const offer = await peer.getOffer();
      setMyStream(stream);
      myStreamRef.current = stream;
    }, [socket]);

    useEffect(() => {
        if(id && id!=='null') {
            setCaller(id);
        }
        if(selectedConversation) {
            setReciever(selectedConversation);
            
            handleRecieveUser();
        }

    }, []);

    useEffect(() => {
      console.log("remoteStream set", remoteStream);
    }, [remoteStream]);


    const sendStreams = useCallback(() => {
      for (const track of myStreamRef.current.getTracks()) {
        peer.peer.addTrack(track, myStreamRef.current);
      }
    }, [myStreamRef]);

    const handleNegoNeedIncomming = useCallback(
      async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, from: id, ans });
        sendStreams();
      },
      [socket]
    );

    useEffect(() => {
      peer.peer.addEventListener("track", async (ev) => {
        const remoteStreams = ev.streams;
        console.log("GOT TRACKS!!", remoteStreams[0]);
        setRemoteStream(remoteStreams[0]);
      });
    }, []);


    useEffect(() => {
      socket.on("peer:nego:needed", handleNegoNeedIncomming);


      return () => {
        socket.off("peer:nego:needed", handleNegoNeedIncomming);
      }
    },[socket]);

    return (
        <div>
      <h1>Room Page Recieve</h1>
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
            style={{backgroundColor:"black"}}
          />
        </>
      )}
    </div>
    )

}

export default RecieveCall;