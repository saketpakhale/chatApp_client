import { useCallback, useContext, useState, useEffect } from "react";
import { useConversation } from "../context/ConversationsProvider";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Button } from "react-bootstrap";


function Calling({id}) {

    const {selectedConversation} = useConversation();
    const socket = useSocket();
    const navigate = useNavigate();
    const [myStream, setMySteam] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleCall = useCallback(async () => {
        const offer = await peer.getOffer();
        console.log(selectedConversation);
        socket.emit("user:call", {to: selectedConversation, from: id, offer});
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMySteam(stream);
    }, []);

    useEffect(() => {

        if(socket && selectedConversation) {
            
            handleCall();
        } else {
            navigate("/");
        } 

    },[]);


    const handleCallRejected = useCallback(({msg}) => {
        alert("call disconnected");
        navigate("/");
    }, []);

    const sendStreams = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        for (const track of stream.getTracks()) {
          peer.peer.addTrack(track, stream);
        }
        console.log("added tracks", stream);
    }, []); 

    const handleCallAccepted = useCallback(({from, ans}) => {
        console.log(ans, myStream);
        peer.setLocalDescription(ans);
        sendStreams();
          
    }, [myStream]);

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", {  to: selectedConversation, from: id, offer });
        console.log("negotiation needed");
      }, [selectedConversation, socket]);
    
      useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
          peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedFinal = useCallback(async ({ from, ans }) => {
        await peer.setLocalDescription(ans);
        console.log("negosiation done");
    }, []);


    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
          const remoteStream = ev.streams;
          console.log("GOT TRACKS!!");
          setRemoteStream(remoteStream[0]);
        });
      }, []);

    useEffect(() => {
        socket.on("call:disconnect", handleCallRejected);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:final", handleNegoNeedFinal);
 
        return () => {
            socket.off("call:disconnect", handleCallRejected);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        }

    }, [socket]);









    return(
        <div>
            <h1>Room Page Call</h1>
            {
                myStream &&
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
                <Button onClick={sendStreams}>Send Stream</Button>
                </>
            }
        </div>
    )
}


export default Calling;