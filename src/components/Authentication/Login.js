import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import AxiosService from '../../axiosConfig';
import { ChatState } from '../../Context/ChatProvider'
import {useToast} from '@chakra-ui/react';

const Login = () => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useNavigate();
  const { setUser } = ChatState();
  
  const handleClick = () =>{
    setShow(!show)
  }
const submithandler=()=>{
  history('/forgotPassword')
}
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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
  
      const { data } = await AxiosService.post('/api/user/login', { email, password }, config);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history('/chats');
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
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

      <FormControl id='email-login' isRequired> {/* Updated the id to be unique */}
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
      </FormControl>
    
      <FormControl id='password-login' isRequired> {/* Updated the id to be unique */}
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            type={show ? "text" : "password"}
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    
      <Button
        colorScheme='blue'
        w='100%'
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
        <Link to='/forgotPassword'>If you don't know your password click here</Link>
    </VStack>
    
    )
}

export default Login