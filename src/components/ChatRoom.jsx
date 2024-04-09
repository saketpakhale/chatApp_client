import ContactSection from "./ContactsSection";
import ChatSection from "./ChatSection";
import { Modal, Button } from "react-bootstrap";
import { useSocket } from "../context/SocketProvider";
import { useContacts } from "../context/ContactProvider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import peer from "../service/peer";


function ChatRoom({id}) {
    
    const [incommingCallName, setIncommingCallName] = useState();
    const [incommingCallId, setIncommingCallId] = useState();
    const [incommingCallOffer, setIncommingCallOffer] = useState();    
    const {createContact, contactList} = useContacts();
    const navigate = useNavigate();
    const socket = useSocket();

    function handleIncommingCall ({from, offer})  {
        navigate("/recievecall");

    }

    useEffect(() => {
        if(id && id!=='null' && socket) {
            socket.on("incomming:call", handleIncommingCall );

            return () => {
                socket.off("incomming:call", handleIncommingCall);
            }
        }       
                

    }, [socket]);
    
    
    return (
        
        <div style={{display:'flex', height:'100vh'}}>
            <ContactSection id={id} />
            <ChatSection id={id} />            
        </div>
    )
}

export default ChatRoom;