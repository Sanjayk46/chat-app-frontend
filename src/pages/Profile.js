// import React, { useEffect, useState } from 'react';
// import { Box, Container, Text, Image, Button, Spinner } from '@chakra-ui/react';
// import { Link } from 'react-router-dom';
// import AxiosService from '../axiosConfig'; // Assuming you're using axios for API requests
// import {ChatState} from '../Context/ChatProvider'
// const ProfilePage = () => {
//   const {user, setUser} = ChatState();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const config = {
//         headers: {
//             "Content-type": "application/json",
//             Authorization: `Bearer ${user.token}`
//         }
//     };
//       try {
//         // Example API call to fetch user details
//         const { data } = await AxiosService.get('/api/user/profile',config);
//         setUser(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   if (loading) {
//     return (
//       <Container centerContent>
//         <Spinner size="xl" />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="xl" centerContent marginBottom={10}>
//       <Box
//         display="flex"
//         justifyContent="center"
//         p={3}
//         bg="white"
//         w="100%"
//         m="40px 0 15px 0"
//         borderRadius="lg"
//         borderWidth="1px"
//         to="/"
//       >
//         <Link to="/">
//           <Text fontSize="4xl" fontFamily="Work Sans" color="black">
//             Chat App - Profile
//           </Text>
//         </Link>
//       </Box>

//       <Box bg="white" w="100%" p={4} color="black" borderRadius="lg" borderWidth="1px">
//         <Box display="flex" justifyContent="space-around" flexWrap="wrap">
//           <Box>
//             <Image
//               borderRadius="full"
//               boxSize="150px"
//               src={user?.avatar ?? './images/default_avatar.png'}
//               alt={user?.name}
//               mb={5}
//             />
//             <Link to="/myprofile/update">
//               <Button colorScheme="blue" width="100%" mb={5}>
//                 Edit Profile
//               </Button>
//             </Link>
//           </Box>

//           <Box>
//             <Text fontSize="2xl" fontWeight="bold">
//               Full Name
//             </Text>
//             <Text fontSize="lg">{user?.name}</Text>

//             <Text fontSize="2xl" fontWeight="bold" mt={4}>
//               Email Address
//             </Text>
//             <Text fontSize="lg">{user?.email}</Text>

//             <Text fontSize="2xl" fontWeight="bold" mt={4}>
//               Joined
//             </Text>
//             <Text fontSize="lg">{String(user?.createdAt).substring(0, 10)}</Text>

//             <Link to="/chats">
//               <Button colorScheme="red" width="100%" mt={5}>
//                 MyChats
//               </Button>
//             </Link>

//             <Link to="/myprofile/update/password">
//               <Button colorScheme="blue" width="100%" mt={3}>
//                 Change Password
//               </Button>
//             </Link>
//           </Box>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState } from 'react';
import { Box, Container, Text, Image, Button, Spinner, Input, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import AxiosService from '../axiosConfig'; // Assuming you're using axios for API requests
import { ChatState } from '../Context/ChatProvider';

const ProfilePage = () => {
  const { user, setUser } = ChatState();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null); // Stores the actual Cloudinary URL
  const [picPreview, setPicPreview] = useState(''); // Stores the image preview URL
  const toast = useToast();
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user || !user.token) return;

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(config)
      try {
        const { data } = await AxiosService.get('/api/user/profile', config);
        setUser(data.user); 
        setFirstName(data.user.firstName); 
        setLastName(data.user.lastName); 
        setPicPreview(data.user.profilePic); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user, setUser]);

  const postDetails = (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: 'Please select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append("file", pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'diwunv4ge');
      fetch('https://api.cloudinary.com/v1_1/diwunv4ge/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfilePic(data.url.toString()); // Set the actual Cloudinary image URL
          setPicPreview(URL.createObjectURL(pics)); // Preview uploaded image
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please select a valid image file (JPEG/PNG)',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  const handleProfileUpdate = async () => {
    const config = {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
        },
    };
    const updatedUser = { firstName, lastName, profilePic };

    try {
        const { data } = await AxiosService.put('/api/user/updateUserProfile', updatedUser, config);
        setUser(data.user); // Update the user state after the profile is updated
        toast({
            title: 'Profile updated successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        toast({
            title: 'Error updating profile',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
        });
    }
};  

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" centerContent marginBottom={10}>
      <Box display="flex" justifyContent="center" p={3} bg="white" w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
        <Link to="/chats">
          <Text fontSize="4xl" fontFamily="Work Sans" color="black">
            Chat App - Profile
          </Text>
        </Link>
      </Box>

      <Box bg="white" w="100%" p={4} color="black" borderRadius="lg" borderWidth="1px">
        <Box display="flex" justifyContent="space-around" flexWrap="wrap">
          <Box>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={picPreview || user?.profilePic || './images/default_avatar.png'}
              alt={user?.name}
              mb={5}
            />
            <Input
              id='pic'
              type="file"
              accept="image/*"
              onChange={(event) => postDetails(event.target.files[0])} // Pass the file for Cloudinary upload
              mb={4}
            />
            <Text fontSize="2xl" fontWeight="bold">
              First Name
            </Text>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              mb={4}
            />
            <Text fontSize="2xl" fontWeight="bold">
              Last Name
            </Text>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              mb={4}
            />

            <Text fontSize="2xl" fontWeight="bold" mt={4}>
              Email Address
            </Text>
            <Text fontSize="lg">{user.email}</Text>

            <Text fontSize="2xl" fontWeight="bold" mt={4}>
              Joined
            </Text>
            <Text fontSize="lg">{String(user?.createdAt).substring(0, 10)}</Text>

            <Button colorScheme="blue" width="100%" onClick={handleProfileUpdate}>
              Update Profile
            </Button>
            <Link to="/chats">
              <Button colorScheme="red" width="100%" mt={5}>
                My Chats
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
