import React from 'react';
import { Box, VStack, Heading, Text, Button, Image, Container, Flex, HStack, Link, SimpleGrid } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box bg="white" minHeight="100vh">
      <Container maxW="container.xl">
        {/* Header */}
        <Flex as="header" justify="space-between" align="center" py={4}>
          <Image src="/brello-logo.png" alt="Brello Logo" boxSize="40px" />
          <HStack spacing={4}>
            <Link as={RouterLink} to="/login" color="gray.600">Log In</Link>
            <Button as={RouterLink} to="/signup" colorScheme="blue" size="sm">
              Sign Up
            </Button>
          </HStack>
        </Flex>

        {/* Main Content */}
        <VStack spacing={8} align="center" textAlign="center" py={16}>
          <Heading as="h1" size="2xl" color="blue.500">
            Get Organized
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="container.md">
            Organize your tasks, collaborate with your team, and boost your productivity with Brello's interactive and advanced to-do lists.
          </Text>
          <Button
            as={RouterLink}
            to="/signup"
            colorScheme="blue"
            size="lg"
            fontSize="md"
            fontWeight="bold"
            px={8}
            _hover={{ bg: 'blue.600' }}
          >
            Sign Up - It's Free!
          </Button>
        </VStack>

        {/* Sample Board Previews */}
        <SimpleGrid columns={3} spacing={8} mt={16}>
          {[1, 2, 3].map((index) => (
            <Box
              key={index}
              bg={`blue.${index * 100}`}
              height="150px"
              borderRadius="md"
              boxShadow="md"
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LandingPage;
