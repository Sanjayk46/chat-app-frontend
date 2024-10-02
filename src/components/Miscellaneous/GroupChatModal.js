// import { useDisclosure,Modal,
//     ModalOverlay,
//     ModalContent,
//     ModalHeader,
//     ModalFooter,
//     ModalBody,
//     ModalCloseButton, Button,
//     useToast,
//     FormControl,
//     Input,
//     Box} from '@chakra-ui/react'
// import React, { useState } from 'react'
// import { ChatState } from '../../Context/ChatProvider';
// import AxiosService from '../../axiosConfig';
// import UserListItem from './../UserAvatar/UserListItem';
// import UserBadgeItem from '../UserAvatar/UserBadgeItem';

// const GroupChatModal = ({children}) => {

//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const [groupChatName, setGroupChatName] = useState();
//     const [selectedUsers, setSelectedUsers] = useState([]);
//     const [search, setSearch] = useState('');
//     const [searchResult, setsearchResult] = useState([]);
//     const [loading, setLoading] = useState(false)

//     const toast = useToast();

//     const {user, chats, setChats} = ChatState();

//     const handleSearch = async (query) =>{
//       setSearch(query);
//       if(!query){
//         return;
//       }

//       try {
//         setLoading(true);

//         const config = {
//           headers:{
//             Authorization: `Bearer ${user.token}`
//           }
//         };

//         const {data} = await AxiosService.get(`/api/user?search=${search}`,config);
        
//         setLoading(false);
//         setsearchResult(data);
//       } catch (error) {
//         toast({
//           title: 'Error Occured!',
//           description:'Failed to load search results',
//           status: 'error',
//           duration: 5000,
//           isClosable: true,
//           position:'bottom-left'
//         })
//       }
//     }

//     const handleSubmit = async () =>{
//       if(!groupChatName || !selectedUsers){
//         toast({
//           title: 'Please fill all the fields',
//           status: 'warning',
//           duration: 5000,
//           isClosable: true,
//           position:'top'
//         });
//         return;
//       }

//       try {
//         const config = {
//           headers:{
//             Authorization: `Bearer ${user.token}`
//           }
//         };

//         const {data} = await AxiosService.post('/api/chat/group',{
//           name: groupChatName,
//           users:JSON.stringify(selectedUsers.map((u)=> u._id))
//         }, config);
//         setChats([data, ...chats]);
//         onClose();
//         toast({
//           title: 'New group chat created!',
//           status: 'success',
//           duration: 5000,
//           isClosable: true,
//           position:'bottom'
//         });

//       } catch (error) {
//         toast({
//           title: 'Failed to create the chat',
//           description: error.response.data,
//           status: 'error',
//           duration: 5000,
//           isClosable: true,
//           position:'bottom'
//         });
//       }
//     }

//     const handleDelete = (delUser)=>{
//       setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== delUser._id))
//     }

//     const handleGroup = (userToAdd) =>{
//       if(selectedUsers.includes(userToAdd)){
//         toast({
//           title: 'User already added!',
//           status: 'warning',
//           duration: 5000,
//           isClosable: true,
//           position:'top'
//         });
//         return;
//       }

//       setSelectedUsers([...selectedUsers,userToAdd]);
//     }
//     return (
//         <>
//           <span onClick={onOpen}>{children}</span>
    
//           <Modal isOpen={isOpen} onClose={onClose}>
//             <ModalOverlay />
//             <ModalContent>
//               <ModalHeader
//               fontSize='35px'
//               fontFamily='Work sans'
//               d='flex'
//               justifyContent='center'
//               >Create Group Chat</ModalHeader>
//               <ModalCloseButton />
//               <ModalBody
//               d='flex'
//               flexDir='column' alignItems='center'
//               >
//                 <FormControl>
//                     <Input placeholder='Chat Name' mb={3}
//                     onChange={(e)=> setGroupChatName(e.target.value)}
//                     />
//                 </FormControl>
//                 <FormControl>
//                     <Input placeholder='Add Users eg: John, Dulanjali, Nisitha' mb={1}
//                     onChange={(e)=> handleSearch(e.target.value)}
//                     />
//                 </FormControl>
//                 <Box w='100%' display='flex' flexWrap='wrap'>
//                 {selectedUsers.map(u=>(
//                   <UserBadgeItem key={user._id} user={u} handleFunction={()=> handleDelete(u)}/>
//                 ))}
//                 </Box>
                
//                 {loading ? <div>Loading</div> : (
//                   searchResult?.slice(0,4).map(user=>(
//                     <UserListItem key={user._id} user={user} handleFunction={()=> handleGroup(user)}/>
//                   ))
//                 )}
//               </ModalBody>
    
//               <ModalFooter>
//                 <Button colorScheme='blue' onClick={handleSubmit}>
//                   Create Group
//                 </Button>
                
//               </ModalFooter>
//             </ModalContent>
//           </Modal>
//         </>
//       )
// }

// export default GroupChatModal


import { 
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalFooter, ModalBody, ModalCloseButton, Button, useToast, 
  FormControl, Input, Box 
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import AxiosService from '../../axiosConfig';
import UserListItem from './../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  // Debounce search query for better performance
  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
          if (search) {
              handleSearch(search);
          }
      }, 500); // Delay of 500ms to avoid sending too many requests

      return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSearch = async (query) => {
      if (!query) {
          setSearchResult([]);
          return;
      }

      try {
          setLoading(true);
          const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          };

          const { data } = await AxiosService.get(`/api/user?search=${query}`, config);
          setSearchResult(data);
          setLoading(false);
      } catch (error) {
          setLoading(false);
          toast({
              title: "Error Occurred!",
              description: "Failed to load search results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left"
          });
      }
  };

  const handleSubmit = async () => {
      if (!groupChatName || selectedUsers.length === 0) {
          toast({
              title: "Please fill all the fields",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top"
          });
          return;
      }

      try {
          const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          };

          const { data } = await AxiosService.post('/api/chat/group', {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id))
          }, config);

          setChats([data, ...chats]);
          onClose();
          toast({
              title: "New group chat created!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });

      } catch (error) {
          toast({
              title: "Failed to create the chat",
              description: error.response?.data || "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
      }
  };

  const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
          toast({
              title: "User already added!",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top"
          });
          return;
      }

      setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleAccessGroupChat = async () => {
      try {
          const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          };

          const { data } = await AxiosService.post('/api/chat/access', { chatId }, config);

          if (!data.isActive) {
              toast({
                  title: "Group chat closed!",
                  description: "This group chat is closed as the admin has left.",
                  status: "warning",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom"
              });
              return;
          }

          toast({
              title: "Accessed Group Chat!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });

          // Do something with the data or navigate to the group chat
      } catch (error) {
          toast({
              title: "Failed to access group chat",
              description: error.response?.data || "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
      }
  };

  const handleLeaveGroupChat = async () => {
      try {
          const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          };

          const { data } = await AxiosService.patch('/api/chat/group/leave', { chatId }, config);

          toast({
              title: data.message || "Left Group Chat",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });

          onClose();

          // Optionally remove the chat from the local state if needed
      } catch (error) {
          toast({
              title: "Failed to leave the group chat",
              description: error.response?.data || "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom"
          });
      }
  };

  return (
      <>
          <span onClick={onOpen}>{children}</span>

          <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
                      Manage Group Chat
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody display="flex" flexDirection="column" alignItems="center">
                      <FormControl>
                          <Input
                              placeholder="Chat Name"
                              mb={3}
                              value={groupChatName}
                              onChange={(e) => setGroupChatName(e.target.value)}
                          />
                      </FormControl>
                      <FormControl>
                          <Input
                              placeholder="Add Users eg: John, Dulanjali, Nisitha"
                              mb={1}
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                          />
                      </FormControl>
                      <Box w="100%" display="flex" flexWrap="wrap">
                          {selectedUsers.map((u) => (
                              <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                          ))}
                      </Box>

                      {loading ? (
                          <div>Loading...</div>
                      ) : (
                          searchResult?.slice(0, 4).map((user) => (
                              <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                          ))
                      )}
                  </ModalBody>

                  <ModalFooter>
                      <Button colorScheme="blue" onClick={handleSubmit} mr={3}>
                          Create Group
                      </Button>
                      <Button colorScheme="green" onClick={handleAccessGroupChat} mr={3}>
                          Access Group
                      </Button>
                      <Button colorScheme="red" onClick={handleLeaveGroupChat}>
                          Leave Group
                      </Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
      </>
  );
};

export default GroupChatModal;


