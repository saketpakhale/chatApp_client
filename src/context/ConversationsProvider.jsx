import React, { useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";


const ConversationContext = React.createContext();

export function ConversationProvider({children}) {

    const [selectedConversation, setSelectecConversations] = useState(null);
    const [allConversations, setAllConversations] = useState([]);
    const socket = useSocket();

    function handleSetActiveConversation(id) {
        setSelectecConversations(id);
    }

    function getSelectedConversation() {
        if(selectedConversation!==null) {
            
            const data = allConversations.filter((obj)=> {
                return (obj.emailId === selectedConversation);
            });

            if(data.length===1) {
                return data[0];
            }
            
            
        }
        return null;        
    }

    useEffect(()=> {
        if(socket!=null) {
            socket.on('recieve-message',(msg)=> {
                
                if(msg.senderId!==selectedConversation && msg.recieverId!==selectedConversation) {
                    
                    allConversations.forEach((contact)=> {
                        if(contact.emailId===msg.senderId || contact.emailId===msg.recieverId) {
                            
                            contact.conversations?.push(msg);
                        } 
                    });
                    
                }
                
            })
        }
    },[socket,selectedConversation])



    return (
        <ConversationContext.Provider value={{selectedConversation, handleSetActiveConversation, getSelectedConversation, setAllConversations}}>
            {children}
        </ConversationContext.Provider>
    )
}

export function useConversation() {
    return useContext(ConversationContext);
}