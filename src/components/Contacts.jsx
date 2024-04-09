import { ListGroup } from "react-bootstrap";
import { useContacts } from "../context/ContactProvider";
import { v4 as uuid } from 'uuid';
import { useConversation } from "../context/ConversationsProvider";


function Contacts({id}) {

    const {createContact, contactList} = useContacts();
    const {selectedConversation, handleSetActiveConversation, getSelectedConversation} = useConversation();

    function handleClick(contact) {
        handleSetActiveConversation(contact.id);
        
    }

    return (
        <>
        {id ?
        (<ListGroup>
            {contactList.map((contact)=>{
                const newUuid = uuid();
                return (
                <ListGroup.Item
                key={newUuid}
                onClick={()=> {
                    handleClick(contact);
                }}    
                style={{
                    backgroundColor: selectedConversation && selectedConversation === contact.id ? '#f2f2f2' : 'white',
                    display: 'flex',
                    justifyContent:'center',
                    fontWeight: selectedConversation && selectedConversation === contact.id ? 'bold' : 'normal',
                  }}
                    
                >
                    {contact.name}
                </ListGroup.Item>);
            })}
        </ListGroup>) : null
        }
        </>
    )




}

export default Contacts;