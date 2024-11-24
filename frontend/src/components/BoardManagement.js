import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

const BoardManagement = ({ onBoardsChange }) => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('#FFFFFF');
  const [editingBoard, setEditingBoard] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch('http://localhost:8001/boards', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
        onBoardsChange(data);
      } else {
        throw new Error('Failed to fetch boards');
      }
    } catch (error) {
      toast({
        title: 'Error fetching boards',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const createBoard = async () => {
    try {
      const response = await fetch('http://localhost:8001/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newBoardTitle, background_color: newBoardColor }),
      });
      if (response.ok) {
        setNewBoardTitle('');
        setNewBoardColor('#FFFFFF');
        fetchBoards();
        toast({
          title: 'Board created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to create board');
      }
    } catch (error) {
      toast({
        title: 'Error creating board',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateBoard = async () => {
    try {
      const response = await fetch(`http://localhost:8001/boards/${editingBoard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: editingBoard.title, background_color: editingBoard.background_color }),
      });
      if (response.ok) {
        setEditingBoard(null);
        onClose();
        fetchBoards();
        toast({
          title: 'Board updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to update board');
      }
    } catch (error) {
      toast({
        title: 'Error updating board',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      const response = await fetch(`http://localhost:8001/boards/${boardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (response.ok) {
        fetchBoards();
        toast({
          title: 'Board deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to delete board');
      }
    } catch (error) {
      toast({
        title: 'Error deleting board',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Board Title</FormLabel>
          <Input
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board title"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Background Color</FormLabel>
          <Input
            type="color"
            value={newBoardColor}
            onChange={(e) => setNewBoardColor(e.target.value)}
          />
        </FormControl>
        <Button onClick={createBoard} colorScheme="teal">
          Create Board
        </Button>
      </VStack>

      <VStack mt={8} spacing={4} align="stretch">
        {boards.map((board) => (
          <HStack key={board.id} justifyContent="space-between">
            <Box
              bg={board.background_color}
              p={2}
              borderRadius="md"
              flex={1}
            >
              {board.title}
            </Box>
            <Button onClick={() => {
              setEditingBoard(board);
              onOpen();
            }}>
              Edit
            </Button>
            <Button onClick={() => deleteBoard(board.id)} colorScheme="red">
              Delete
            </Button>
          </HStack>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Board</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Board Title</FormLabel>
                <Input
                  value={editingBoard?.title || ''}
                  onChange={(e) => setEditingBoard({ ...editingBoard, title: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Background Color</FormLabel>
                <Input
                  type="color"
                  value={editingBoard?.background_color || '#FFFFFF'}
                  onChange={(e) => setEditingBoard({ ...editingBoard, background_color: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateBoard}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BoardManagement;
