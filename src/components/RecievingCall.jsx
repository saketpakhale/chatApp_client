
import { useSocket } from "../context/SocketProvider";
import { Modal, Button } from "react-bootstrap";
import { useContacts } from "../context/ContactProvider";
import { useState, useEffect, useCallback } from "react";
import peer from "../service/peer";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";


function RecievingCall({id}) {

    const socket = useSocket();
    const [incommingCallId, setIncommingCallId] = useState();
    const [incommingCallOffer, setIncommingCallOffer] = useState();
    const [incommingCallName, setIncommingCallName] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const {createContact, contactList} = useContacts();
    const navigate = useNavigate();
    const [remoteStream, setRemoteStream] = useState();

    const handleIncommingCall = useCallback( ({from, offer}) => {
        console.log(from, offer);
        setIncommingCallId(from);
        setIncommingCallOffer(offer);
        if(contactList) {
            contactList.forEach(contact => {
                if(contact.id === from) {
                    setIncommingCallName(contact.name);
                }
                
            });
        }       
        
        setModalOpen(true);

    }, []);

    useEffect(() => {
        if(id && id!=='null' && socket) {
            socket.on("incomming:call", handleIncommingCall );

            return () => {
                socket.off("incomming:call", handleIncommingCall);
            }
        }       
                

    }, [socket, handleIncommingCall]);

    const sendStreams =  () => {
        // const stream = await navigator.mediaDevices.getUserMedia({
        //     audio: true,
        //     video: true,
        // });
        // for (const track of stream.getTracks()) {
        //   peer.peer.addTrack(track, stream);
        // }
        console.log("sending tracks");
    }; 


    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
          const remoteStreams = ev.streams;
          console.log("GOT TRACKS!!", remoteStreams[0]);
          setRemoteStream(remoteStreams[0]);
        });
      }, []);


    function closeModal() {
        setModalOpen(false)
    }

    async function handleAcceptCall() {
        
        console.log(`Incoming Call`, incommingCallId, incommingCallOffer);
        const ans = await peer.getAnswer(incommingCallOffer);
        socket.emit("call:accepted", { to: incommingCallId, from: id,  ans });
        closeModal();
        
    }    

    function handleRejectCall() {
        socket.emit("call:rejected", {to: incommingCallId});
        closeModal();
        navigate("/");
    }

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
          const ans = await peer.getAnswer(offer);
          socket.emit("peer:nego:done", { to: from, from: id, ans });
          // sendStreams();
          console.log("negotiation done");
        },
        [socket]
      );

    useEffect(() => {
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
  
  
        return () => {
          socket.off("peer:nego:needed", handleNegoNeedIncomming);
        }
      },[socket]);

    return (
        <div>
            <Modal show={modalOpen} onHide={closeModal}>
                <Modal.Header closeButton>Incomming Call</Modal.Header>
                <Modal.Body>
                    <div>
                        {`Incomming call from ${(incommingCallName ? incommingCallName : "No one")}`}
                    </div>
                    <Button onClick={handleAcceptCall}  className='mt-4'  >Accept</Button>
                    <Button onClick={handleRejectCall} className='mt-4'>Reject</Button>
                    
                </Modal.Body>
            </Modal>

            <h1>Room Page Call</h1>
            {
                remoteStream &&
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
            }
            <Button onClick={sendStreams}>Send Stream</Button> 
        </div>
    )
}

export default RecievingCall;