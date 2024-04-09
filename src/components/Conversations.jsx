import { useEffect, useState } from "react";
import { useConversation } from "../context/ConversationsProvider";
import { v4 as uuid } from 'uuid';
import { useSocket } from "../context/SocketProvider";


function Conversations({id}) {

    const {selectedConversation, handleSetActiveConversation, getSelectedConversation} = useConversation();
    
    const [convList, setConvList] = useState([]);
    const [name, setName] = useState("");
    const socket = useSocket();

    useEffect(()=>{
        
        const fetchSelectedConversation = async () => {
            const list = await getSelectedConversation();
            if (list !== null) {
                console.log(list);
                setName(list.name);
                setConvList(list.conversations);
            }
        };

        fetchSelectedConversation();

    }, [selectedConversation]);

    

    useEffect(()=>{
        if(socket!=null) {
            console.log("Socket is ready!");
            socket.on('recieve-message',(msg)=> {
                console.log(msg.senderId,msg.recieverId,selectedConversation);
                if(msg.senderId===selectedConversation || msg.recieverId===selectedConversation) {
                    setConvList((list)=>{
                        
                        return [...list, msg];
                    });
                }
                
            })
        }
        
    },[socket,selectedConversation])

    



    

    return (
        <div>
            {convList?.map((message)=> {
                const newUuid = uuid();
                return (
                    <div
                        ref={null}
                        key={newUuid}
                        className={`my-1 d-flex flex-column ${(message?.senderId===id) ? 'align-self-end align-items-end' : 'align-items-start'}`}
                    >
                        <div
                        className={`rounded px-2 py-1 ${(message?.senderId===id) ? 'bg-primary text-white' : 'bg-success text-white'}`}>
                        {message?.msg}
                        </div>
                        <div className={`text-muted small ${(message?.senderId===id) ? 'text-right' : ''}`}>
                        {(message?.senderId===id) ? 'You' : name }
                        </div>
                    </div>
                )
            })}

            
        </div>
    )

}

export default Conversations;