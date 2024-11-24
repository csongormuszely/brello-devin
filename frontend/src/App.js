import React from 'react';
import { ChakraProvider, Box, Heading, Flex, Link } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import BoardsPage from './components/BoardsPage';
import EmailConfirmation from './components/EmailConfirmation';
import ChakraTest from './components/ChakraTest';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white">
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              Brello
            </Heading>
          </Flex>

          <Box>
            <Link as={RouterLink} to="/" mr={4}>Home</Link>
            <Link as={RouterLink} to="/signup" mr={4}>Sign Up</Link>
            <Link as={RouterLink} to="/login" mr={4}>Log In</Link>
            <Link as={RouterLink} to="/boards" mr={4}>Boards</Link>
            <Link as={RouterLink} to="/chakra-test">Chakra Test</Link>
          </Box>
        </Flex>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/confirm-email" element={<EmailConfirmation />} />
          <Route path="/chakra-test" element={<ChakraTest />} />
          {/* Add more routes here as we implement other pages */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
