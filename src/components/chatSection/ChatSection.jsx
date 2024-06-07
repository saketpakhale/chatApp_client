import React, {useState, useEffect} from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
import Conversations from './Conversations'
import { useConversation } from '../../context/ConversationsProvider';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketProvider';
import { useContacts } from '../../context/ContactProvider';


function ChatSection({id}) {

    const {selectedConversation} = useConversation();
    const {createContact, contactList} = useContacts();
    const [text,setText] = useState("");
    const [selectedConversationName, setSelectedConversationName] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const socket = useSocket();


    useEffect(() => {
        contactList.forEach(contact => {
            if(contact.id === selectedConversation) {
                setSelectedConversationName(contact.name);
            }
        });
        scrollToBottom();
    }, [selectedConversation]);

    function handleSubmit(e) {
        e.preventDefault();
        if(text!=="") {
            const message = {senderId:id, recieverId:selectedConversation, msg:text};
            socket.emit('send-message',message);
            
        }
        setText(""); 
        scrollToBottom();       

    }

    function handleLogin() {
        navigate("/login");
    }

    function handleSignup() {
        navigate("/signup");
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        socket.disconnect();
        navigate("/login");
    }

    function handleCall() {
        navigate('/call');
    }

    function scrollToBottom() {
        const conversationsDiv = document.getElementById('conversationsDiv');
        if (conversationsDiv) {
            conversationsDiv.scrollTop = conversationsDiv.scrollHeight;
        }
    };


    return (
        
         
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between' , minHeight: '100vh', width:"-webkit-fill-available", backgroundColor:"#67706a" }}>
            <div className="p-3" style={{ display: 'flex', justifyContent: 'space-between'}}>
                <h4 style={{color:'whitesmoke'}}>{ selectedConversation ? selectedConversationName : "Chat App" }</h4>
                <div>
                    {
                        selectedConversation && (<Button onClick={handleCall} style={{marginRight:'15px'}}> Video Call</Button>)
                    }
                    {
                        token && (<Button onClick={handleLogout}>Log out</Button>)
                    }
                </div>
                
            </div>
            
            {(id && id!=='null') ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background:'#9faba3' }}>
                    <div id="conversationsDiv" className='p-5 flex-grow-1 overflow-auto' style={{ scrollBehavior: 'smooth'}}>
                        <Conversations id={id} />
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        {selectedConversation !== null && (
                        <Form onSubmit={handleSubmit} className="m-1" >
                            <InputGroup>
                            <Form.Control
                                as="textarea"
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter" && !e.shiftKey) {
                                        // e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                style={{ height: '30px', resize: 'none' }}
                                placeholder='Enter your message here'
                            />
                            <Button type='submit'>Send</Button>
                            </InputGroup>
                        </Form>
                        )}
                    </div>               

                </div>
            ): 
            <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontSize:'30px'}} >
                <h2 className='mb-4'>Wanna have a conversation :) </h2>
                <h4 className='mb-3'>Login/SighUp below</h4>
                <div>
                <Button onClick={handleLogin} className='m-2'>Log in</Button>  
                <Button onClick={handleSignup} className='m-2'>Sign Up</Button>  
                </div>
            </div>}
        </div>
 
        
    )
}

export default ChatSection;