import { useEffect, useState } from "react";
import { useConversation } from "../../context/ConversationsProvider";
import { v4 as uuid } from 'uuid';
import { useSocket } from "../../context/SocketProvider";
import ContextMenu from "./contextMenu";
import config from "../../config/config";


function Conversations({id}) {

    const {selectedConversation, handleSetActiveConversation, getSelectedConversation} = useConversation();
    
    const [convList, setConvList] = useState([]);
    const [name, setName] = useState("");
    const socket = useSocket();
    const [toggled,setToggled] = useState(false);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [selsectedMessage, setSelectedMessage] = useState(null);



    useEffect(()=>{ 
        
        const fetchSelectedConversation = async () => {
            const list = await getSelectedConversation();
            if (list !== null) {
                setName(list.name);
                setConvList(list.conversations);
            }
        };

        fetchSelectedConversation();

    }, [selectedConversation]);

    useEffect(() => {
        const handleClick = () => setToggled(false);        

        window.addEventListener('click',handleClick);
        return () => window.removeEventListener('click',handleClick);
    },[]);

    

    useEffect(()=>{
        if(socket!=null) {
            // console.log("Socket is ready!");
            socket.on('recieve-message',(msg)=> {
                // console.log(msg.senderId,msg.recieverId,selectedConversation);
                if(msg.senderId===selectedConversation || msg.recieverId===selectedConversation) {
                    setConvList((list)=>{
                        
                        return [...list, msg];
                    });
                }
                
            })
        }
        
    },[socket,selectedConversation]);

    const handleDelete = async () => {
        if(selsectedMessage) {
        
            await fetch(`${config.backendUrl}/deletemessage`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify(selsectedMessage)

            })
            .then((data) => data.json())
            .then((message) =>  {
                if(message.error) {
                    alert(message.error);
                } else if (message.message) {
                    setConvList((prev) => prev.filter((msg) => msg._id!==selsectedMessage._id));
                }
            });
            
            setSelectedMessage(null);
        }
        setToggled(false);


    }

    const handleCopy = () => {

    }



    

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
                        <div className={`rounded px-2 py-1 ${(message?.senderId===id) ? 'bg-primary text-white' : 'bg-success text-white'}`}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setToggled(true);
                                setPosX(e.pageX);
                                setPosY(e.pageY);
                                setSelectedMessage(message);
                        }}>
                            {message?.msg}
                        </div>
                        <div className={`text-muted small ${(message?.senderId===id) ? 'text-right' : ''}`}>
                            {(message?.senderId===id) ? 'You' : name }
                        </div>
                    </div>
                )
            })}
            {toggled && <ContextMenu posX={posX} posY={posY} handleDelete={handleDelete} handleCopy={handleCopy} />}

            
        </div>
    )

}

export default Conversations;