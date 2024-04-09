
import { createContext, useState } from "react";
import { useContext, useEffect, useMemo } from "react";
import io from 'socket.io-client';


const SocketContext = createContext();

export function SocketProvider({id,children}) {

    const [socket,setSocket] = useState(null);
    
    useEffect(()=>{
        
        if( id && id !== "null"){
            // const s = useMemo(() => io("localhost:3001"), []);
            const s = io('ws://localhost:3001');
            s.emit("addId",id);
            setSocket(s);
            return () => {
                s.disconnect();
            };
        }

    },[id]);

    const memoizedSocket = useMemo(() => socket, [socket]);
    
    

    return (
        <SocketContext.Provider value={memoizedSocket}>
            {children}
        </SocketContext.Provider>
    )
} 

export function useSocket() {
    return useContext(SocketContext);
}