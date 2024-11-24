import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Button, VStack, Container, useToast } from '@chakra-ui/react';
import { API_URL } from '../config';

const EmailConfirmation = () => {
  const [isConfirming, setIsConfirming] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    const confirmEmail = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setIsConfirming(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/confirm-email?token=${token}`);
        if (response.ok) {
          setIsConfirmed(true);
          toast({
            title: 'Email confirmed successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw new Error('Email confirmation failed');
        }
      } catch (error) {
        toast({
          title: 'Email confirmation failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsConfirming(false);
      }
    };

    confirmEmail();
  }, [location.search, toast]);

  return (
    <Box bg="white" minHeight="100vh">
      <Container maxW="container.sm" py={16}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" color="blue.500" textAlign="center">
            Email Confirmation
          </Heading>
          {isConfirming ? (
            <Text textAlign="center">Confirming your email...</Text>
          ) : isConfirmed ? (
            <>
              <Text textAlign="center">Your email has been confirmed successfully!</Text>
              <Button as={RouterLink} to="/login" colorScheme="blue" size="lg" width="100%">
                Go to Login
              </Button>
            </>
          ) : (
            <>
              <Text textAlign="center">Email confirmation failed. Please try again or contact support.</Text>
              <Button as={RouterLink} to="/signup" colorScheme="blue" size="lg" width="100%">
                Back to Sign Up
              </Button>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default EmailConfirmation;
