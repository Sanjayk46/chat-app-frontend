import React, { useEffect } from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import ForgotPassword from '../components/Authentication/ForgotPassword';
import { useNavigate ,Link} from 'react-router-dom';

const ForgotPage = () => {
  
  return (
    <Container maxWidth='xl' centerContent marginBottom={10}>
      <Box
        display='flex'
        justifyContent='center'
        p={3}
        bg={'white'}
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Link to='/'>
        <Text fontSize='4xl' fontFamily='Work Sans' color='black'>
          Chat App - Forgot Password
        </Text>
        </Link>
      </Box>

      <Box bg='white' w='100%' p={4} color='black' borderRadius='lg' borderWidth='1px'>
        {/* Render only ForgotPassword component */}
        <ForgotPassword />
      </Box>
    </Container>
  );
};

export default ForgotPage;
