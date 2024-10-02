import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AxiosService from '../../axiosConfig';
import { ChatState } from '../../Context/ChatProvider'
import {useToast} from '@chakra-ui/react';

const  ResetPassword = () => {
  const [show, setShow] = useState(false)
  const [OTP, setOTP] = useState();
  const [password, setPassword] = useState();
const [confirmpassword, setConfirmpassword] = useState();

  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useNavigate();
  const { setUser } = ChatState();
  
  const handleClick = () =>{
    setShow(!show)
  }
  
  const submitHandler = async () => {
    setLoading(true);
    if (!OTP) {
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
    if(password !== confirmpassword){
        toast({
          title: 'Password not match',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
        return;
      }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
  
      const { data } = await AxiosService.post('/api/user/resetPassword', { OTP,password}, config);
  
      toast({
        title: 'Password changed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history('/');
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

  <FormControl id='otp' isRequired>
      <FormLabel>OTP</FormLabel>
      <Input placeholder='Enter your Otp' onChange={(event)=> setOTP(event.target.value)}
      value={OTP}
      />
  </FormControl>
  <FormControl id='password' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup size='md'>
    <Input type={show ? "text" : "password"} placeholder='Password' onChange={(event)=> setPassword(event.target.value)}/>
    <InputRightElement width='4.5rem'>
    <Button h='1.75rem' size='sm' onClick={handleClick}>
      {show ? 'Hide' :'Show'}
    </Button>
    </InputRightElement>
    </InputGroup>
   
</FormControl>
<FormControl id='confirm-password' isRequired>
    <FormLabel>Confirm Password</FormLabel>
    <InputGroup size='md'>
    <Input type={show ? "text" : "password"} placeholder='Confirm Password' onChange={(e)=> setConfirmpassword(e.target.value)}/>
    <InputRightElement width='4.5rem'>
    <Button h='1.75rem' size='sm' onClick={handleClick}>
      {show ? 'Hide' :'Show'}
    </Button>
    </InputRightElement>
    </InputGroup>
</FormControl>
    <Button colorScheme='blue' w='100%' style={{marginTop:15}}
  isLoading={loading}
  onClick={submitHandler}
  >
  Submit
  </Button>
          
      </VStack>
    )
}

export default ResetPassword;