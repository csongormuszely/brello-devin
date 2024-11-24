import React, { useState } from 'react';
import { API_URL } from '../config';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  Input,
  FormControl,
  FormLabel,
  Link,
  Container,
  useToast,
  Flex,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/boards');
      } else {
        const errorData = await response.json();
        if (errorData.detail === 'Email not confirmed') {
          setIsEmailConfirmed(false);
        } else {
          throw new Error(errorData.detail || 'An error occurred during login');
        }
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="white" minHeight="100vh">
      <Container maxW="container.xl">
        {/* Header */}
        <Flex as="header" justify="space-between" align="center" py={4}>
          <Image src="/brello-logo.png" alt="Brello Logo" boxSize="40px" />
          <HStack spacing={4}>
            <Link as={RouterLink} to="/signup" color="gray.600">Sign Up</Link>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Container maxW="container.sm" py={16}>
          <VStack
            as="form"
            onSubmit={handleLogin}
            spacing={8}
            align="stretch"
            bg="white"
            p={8}
            borderRadius="md"
            boxShadow="md"
          >
            <Heading as="h2" size="xl" color="blue.500" textAlign="center">
              Log In
            </Heading>
            {!isEmailConfirmed && (
              <Alert status="warning">
                <AlertIcon />
                Your email is not confirmed. Please check your inbox for the confirmation email.
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="100%"
              _hover={{ bg: 'blue.600' }}
              isLoading={isLoading}
            >
              Log In
            </Button>
            <Text textAlign="center">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/signup" color="blue.500">
                Sign up
              </Link>
            </Text>
          </VStack>
        </Container>
      </Container>
    </Box>
  );
};

export default LoginPage;
