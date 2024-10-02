import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AxiosService from '../../axiosConfig';
import { ChatState } from '../../Context/ChatProvider'
import {useToast} from '@chakra-ui/react';

const ForgotPassword = () => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useNavigate();
  const { setUser } = ChatState();
  
  const handleClick = () =>{
    setShow(!show)
  }
  
  const submitHandler = async () => {
    setLoading(true);
    if (!email) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
  
      const { data } = await AxiosService.post('/api/user/forgotPassword', { email}, config);
  
      toast({
        title: 'Password reset email sent successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history('/resetPassword');
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: error.response && error.response.data ? error.response.data.message : error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
   
    return (
      <VStack spacing='5px' color='black'>

  <FormControl id='email' isRequired>
      <FormLabel>Email</FormLabel>
      <Input placeholder='Enter your email' onChange={(event)=> setEmail(event.target.value)}
      value={email}
      />
  </FormControl>
    <Button colorScheme='blue' w='100%' style={{marginTop:15}}
  isLoading={loading}
  onClick={submitHandler}
  >
  ForgotPassword
  </Button>
          
      </VStack>
    )
}

export default ForgotPassword;