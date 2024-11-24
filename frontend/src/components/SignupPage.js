import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: 'Account created.',
          description: 'Please check your email for confirmation.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An error occurred during signup');
      }
    } catch (error) {
      toast({
        title: 'Signup failed.',
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
            <Link as={RouterLink} to="/login" color="gray.600">Log In</Link>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Container maxW="container.sm" py={16}>
          <VStack
            as="form"
            onSubmit={handleSignup}
            spacing={8}
            align="stretch"
            bg="white"
            p={8}
            borderRadius="md"
            boxShadow="md"
          >
            <Heading as="h2" size="xl" color="blue.500" textAlign="center">
              Sign Up
            </Heading>
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
                placeholder="Create a password"
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
              Sign Up - It's Free!
            </Button>
            <Text textAlign="center">
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="blue.500">
                Log in
              </Link>
            </Text>
          </VStack>
        </Container>
      </Container>
    </Box>
  );
};

export default SignupPage;
