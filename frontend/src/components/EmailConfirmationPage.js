import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  useToast,
} from '@chakra-ui/react';

const EmailConfirmationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isConfirming, setIsConfirming] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8001/confirm/${token}`, {
          method: 'GET',
        });

        if (response.ok) {
          toast({
            title: 'Email confirmed',
            description: 'Your email has been successfully confirmed. You can now log in.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'An error occurred during email confirmation');
        }
      } catch (error) {
        toast({
          title: 'Confirmation failed',
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
  }, [token, toast]);

  return (
    <Box bg="gray.100" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="container.sm">
        <VStack
          spacing={8}
          align="stretch"
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="md"
        >
          <Heading as="h2" size="xl" color="teal.500" textAlign="center">
            Email Confirmation
          </Heading>
          {isConfirming ? (
            <Text textAlign="center">Confirming your email...</Text>
          ) : (
            <>
              <Text textAlign="center">
                Your email has been confirmed. You can now log in to your account.
              </Text>
              <Button
                colorScheme="teal"
                size="lg"
                width="100%"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default EmailConfirmationPage;
