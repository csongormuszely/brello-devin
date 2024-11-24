import React from 'react';
import { Box, useToast, Modal, ModalOverlay, ModalContent, ModalHeader } from '@chakra-ui/react';

const ChakraTest = () => {
  const toast = useToast();

  return (
    <Box>
      <button onClick={() => toast({ title: 'Test Toast', status: 'success' })}>
        Show Toast
      </button>
      <Modal isOpen={false} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Test Modal</ModalHeader>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ChakraTest;
