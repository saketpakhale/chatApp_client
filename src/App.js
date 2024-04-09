import Login from "./components/Login";
import SignUp from "./components/Signup";
import ChatRoom from "./components/ChatRoom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ContactProvider } from './context/ContactProvider';
import { ConversationProvider } from './context/ConversationsProvider';
import { SocketProvider } from './context/SocketProvider';
import useLocalStorage from "./hooks/useLocalStorage";
import RecievingCall from "./components/RecievingCall";
import Call from "./components/Call";
import Calling from "./components/Calling";

function App() {
  const [id, setId] = useLocalStorage('id');
  return (
    <div> 
      <SocketProvider id={id}>
        <ConversationProvider>
          <ContactProvider id={id}>
          
            <BrowserRouter>          
              <Routes> 
                <Route path="/" element={  <ChatRoom id={id} />} />
                <Route path="/login" element={<Login onIdSubmit={setId} />} />                   
                <Route path="/signup" element={<SignUp />} />
                <Route path="/call" element={<Calling id={id} />} />
                <Route path="/recievecall" element={<RecievingCall id={id} />} />
              </Routes>
            </BrowserRouter>
          </ContactProvider>
        </ConversationProvider>        
      </SocketProvider>
    
    </div>
    
  );
}

export default App;
