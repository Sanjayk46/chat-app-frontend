import {createContext,useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children})=>{

    const [user, setUser] = useState(null);
    const history = useNavigate();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([])
    
    useEffect(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) ;
      console.log(userInfo);
      setUser(userInfo);
      if(!userInfo){

      }
      
    },[history]);

    return (
       <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>
        {children}
       </ChatContext.Provider> 
    )
};

export const ChatState = () =>{
    return useContext(ChatContext);
}

export default ChatProvider;