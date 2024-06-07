import React,{  useContext, useEffect, useState } from "react";
import { useConversation } from "./ConversationsProvider";
import config from "../config/config";

const ContactContext = React.createContext();
const backendUrl = config.backendUrl;
export function ContactProvider({id, children}) {

    const [contactList, setContactList] = useState([]);
    const {selectedConversation, handleSetActiveConversation, getSelectedConversation,setAllConversations} = useConversation();

    useEffect(()=>{
        fetchContacts();
        
    },[id]);

    async function fetchContacts() {
        await fetch(backendUrl, {
            method: "get",
            headers: {'Content-Type': 'application/json', "authorization": localStorage.getItem("token")},            
          }).then(async (data)=> await data.json()).then((data)=> {
            if(data.result == null) {
                const allContacts = data.map((object)=> {
                    return {id: object.emailId, name: object.name}
                });
                setContactList(allContacts);
                setAllConversations(data);

            }
        })
    }

    async function createContact(eid,name) {


        
        const newContact = {
            id: eid,
            name: name,
        }
        const userInfo = {
            userId: id,
            contactId: eid,
            contactName: name
        }

        await fetch(`${backendUrl}/newcontact`,{
            method: "post",
            headers: {'Content-Type': 'application/json', "authorization": localStorage.getItem("token")},
            body: JSON.stringify(userInfo),
        }).then((result)=> {
            return  result.json();                
        }).then((result)=> {
            if(result.result==="Contact added") {
                let check = false;
                const newContactList = contactList.map((contact)=> {
                    if(contact.id===eid) {
                        contact.name = name;
                        check = true;
                    }
                });
                if(check === true) {
                    setContactList((data)=>{return [newContactList]});
                } else {
                    setContactList((data)=>{return [...data,newContact]});
                }
                
            } else {
                alert(result.result);                
            }
            
        });
            
            
        
    }

    return (
        <ContactContext.Provider value={{createContact, contactList}}>
            {children}
        </ContactContext.Provider>
    )
}

export function useContacts() {
    return useContext(ContactContext);
}



