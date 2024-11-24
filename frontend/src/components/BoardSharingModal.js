import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { API_URL } from '../config';

const BoardSharingModal = ({ isOpen, onClose, boardId }) => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleShare = async () => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast({
          title: 'Board shared successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error('Failed to share board');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Board</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              placeholder="Enter email to share with"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleShare}>
            Share
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BoardSharingModal;
