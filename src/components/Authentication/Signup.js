import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react';
import AxiosService from '../../axiosConfig';
import {useNavigate} from 'react-router-dom';

const Signup = () => {

  const toast = useToast()

const [show, setShow] = useState(false)
const [firstName, setFirstName] = useState();
const [lastName,setLastName] = useState();
const [email, setEmail] = useState();
const [password, setPassword] = useState();
const [confirmpassword, setConfirmpassword] = useState();
const [pic, setPic] = useState();
const [loading, setLoading] = useState(false)
const history = useNavigate();

const handleClick = () =>{
  setShow(!show);
 
}

const postDetails = (pics) =>{
  setLoading(true);

  if(pics === undefined){
    toast({
      title: 'Please select an Image',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position:'bottom'
    })
    return;
  }

  if(pics.type === 'image/jpeg' || pics.type ==='image/png'){
    const data = new FormData();
    data.append("file",pics);
    data.append('upload_preset','chat-app');
    data.append('cloud_name','diwunv4ge');
    fetch('https://api.cloudinary.com/v1_1/diwunv4ge/image/upload',{
      method:'post',
      body: data
    }).then((res)=>res.json())
    .then((data)=>{
      setPic(data.url.toString());
      console.log(data.url.toString());
      setLoading(false);
    })
    .catch((err)=>{
      console.log(err);
      setLoading(false);
    });
  }else{
    toast({
      title: 'Please select an Image',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position:'bottom'
    })
    setLoading(false);
    return;
  }
}
const submitHandler = async () =>{
  setLoading(true);
  if(!firstName ||!lastName || !email || !confirmpassword){
    toast({
      title: 'Please fill all the fields',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position:'bottom'
    })
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
      headers:{
        "Content-Type":"application/json"
      }
    }

    const {data} = await AxiosService.post("/api/user",{firstName,lastName,email,password,pic}, config);
    toast({
      title: 'Registration Successfull',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position:'bottom'
    })

    localStorage.setItem('userInfo', JSON.stringify(data));
    setLoading(false);
    history('/chats')

  } catch (error) {
    toast({
      title: 'Error occured!',
      description: error.response.data.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position:'bottom'
    })
    setLoading(false);
  }
}

  return (
    <VStack spacing='5px' color='black'>
<FormControl id='firstName' isRequired>
    <FormLabel>FirstName</FormLabel>
    <Input placeholder='Enter your first name' onChange={(event)=> setFirstName(event.target.value)}/>
</FormControl>
<FormControl id='lastName' isRequired>
    <FormLabel>LastName</FormLabel>
    <Input placeholder='Enter your last name' onChange={(event)=> setLastName(event.target.value)}/>
</FormControl>
<FormControl id='email' isRequired>
    <FormLabel>Email</FormLabel>
    <Input placeholder='Enter your email' onChange={(event)=> setEmail(event.target.value)}/>
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

<FormControl id='pic'>
    <FormLabel>Upload your picture</FormLabel>
    <Input
    type='file'
    p={1.5}
    accept='image/*'
    onChange={(event)=> postDetails(event.target.files[0])}/>
</FormControl>
<Button colorScheme='blue' w='100%' style={{marginTop:15}}
onClick={submitHandler}
isLoading={loading}
>
Sign Up
</Button>
    </VStack>
  )
}

export default Signup