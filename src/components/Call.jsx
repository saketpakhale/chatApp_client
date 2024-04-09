import { useEffect, useState, useCallback, useRef } from "react";
import { useConversation } from "../context/ConversationsProvider";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";



function Call({id}) {


    const {selectedConversation} = useConversation();
    const [caller, setCaller] = useState();
    const [reciever, setReciever] = useState();
    const [myStream, setMyStream] = useState();
    const myStreamRef = useRef();
    const [remoteStream, setRemoteStream] = useState();
    const navigate = useNavigate();
    const socket = useSocket();


    async function getStream() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      }); 
      setMyStream(stream);
      myStreamRef.current = stream;
      return stream;
    }


    const handleCallUser = useCallback(async () => {
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: selectedConversation, from: id, offer });
      setMyStream(stream);
      myStreamRef.current = stream;
    }, [socket]);

    useEffect(() => {
        if(id && id!=='null') {
            setCaller(id);
        }
        if(selectedConversation) {
            setReciever(selectedConversation);
            handleCallUser();
        }

    }, []);

    

    
    function handleCallDisconnected() {
        alert("call disconnected")
        navigate("/");
    }

    const sendStreams = useCallback(() => {
        for (const track of myStreamRef.current.getTracks()) {
          peer.peer.addTrack(track, myStreamRef.current);
        }
      }, [myStreamRef]);

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!", myStreamRef.current);
            if(myStreamRef) {
              sendStreams();
            } else {
              getStream();
              sendStreams();
              console.log(myStreamRef);
            }
                        
        },
        [sendStreams, myStreamRef]
    );

    const handleNegoNeeded = useCallback(async () => {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", { offer, to: selectedConversation });
    }, [selectedConversation, socket]);
  
    useEffect(() => {
      peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
      return () => {
        peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      };
    }, [handleNegoNeeded]);

    const handleNegoNeedFinal = useCallback(async ({ from, ans }) => {
      await peer.setLocalDescription(ans);
    }, []);
  
    useEffect(() => {
      peer.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log("GOT TRACKS!!");
        setRemoteStream(remoteStream[0]);
      });
    }, []);
  

    useEffect(() => {
        if(socket) {
          socket.on("call:disconnect", handleCallDisconnected);
          socket.on("call:accepted", handleCallAccepted);
          socket.on("peer:nego:final", handleNegoNeedFinal);
          

          return () => {
            socket.off("call:disconnect", handleCallDisconnected);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:final", handleNegoNeedFinal);
          }
        }
        


        
    }, [socket]);







    return (
        <div>
      <h1>Room Page Call</h1>
      {(
        <>
          <h1>My Stream</h1>          
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
            style={{backgroundColor:"black"}}
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
    );
}

export default Call;