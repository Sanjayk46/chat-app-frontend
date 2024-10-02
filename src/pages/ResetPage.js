import React, { useEffect } from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import ResetPassword from '../components/Authentication/ResetPassword';
import { Link, useNavigate } from 'react-router-dom';

const ResetPage = () => {
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
        to='/'
      >
        <Link to='/'>
        <Text fontSize='4xl' fontFamily='Work Sans' color='black'>
          Chat App - Reset Password
        </Text>
        </Link>
      </Box>

      <Box bg='white' w='100%' p={4} color='black' borderRadius='lg' borderWidth='1px'>
        {/* Render only ForgotPassword component */}
        <ResetPassword />
      </Box>
    </Container>
  );
};

export default ResetPage;
