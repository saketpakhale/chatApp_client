import React, { useState } from 'react'
import { Tab, Nav, Button, Modal } from 'react-bootstrap'
import NewConvo from './NewConvo'
import Contacts from './Contacts'
import { useNavigate } from 'react-router-dom';

function ContactSection({id}) {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    
    function closeModal() {
        setModalOpen(false)
    }  
    
    function handleNewConvo() {
        if(id && id!=='null') {
            setModalOpen(true);
        } else {
            navigate("/login");
        }
        
    }


    return (
        <div style={{ width: '450px', display: 'flex', flexDirection: 'column', height: '100vh', borderRight:'1px solid grey', backgroundColor:'#363b37' }} className="d-flex flex-column">
            <Tab.Container activeKey='contacts' >
                <Nav variant="tabs" className="p-2 m-2 justify-content-center" >
                    <h5 style={{color:'whitesmoke', fontWeight:'bold'}}>Conversations</h5>                
                </Nav>
                <Tab.Content className="border-right overflow-auto flex-grow-1">
                    <Tab.Pane eventKey= 'contacts' className='m-2' style={{ cursor: 'pointer' }}>
                        {(id && id!=='null') ? <Contacts id={id} /> : 
                        <div style={{color: 'grey', fontSize:'25px', display:'flex', height:'70vh', justifyContent:'center' }} className='p-4'>
                            Let's to start a new conversation!    
                        </div>}
                    </Tab.Pane>
                </Tab.Content>
                
            </Tab.Container>

            <div className="p-2 m-2  border-right small" style={{background:'#9ba89f', borderRadius:"10px", fontWeight:'bold', color:'black'}} >
                    Your Id: <span className="text-muted">{(id && id!=='null')? id : ""}</span>
            </div>
            <Button onClick={handleNewConvo} className="p-2 m-2 mb-3">
                New Conversation
            </Button>

            <Modal show={modalOpen} onHide={closeModal}>
                <NewConvo closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default ContactSection;