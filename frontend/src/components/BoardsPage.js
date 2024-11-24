import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ChevronDownIcon, ShareIcon } from '@chakra-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { API_URL } from '../config';
import BoardSharingModal from './BoardSharingModal';

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [todoLists, setTodoLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSharingOpen, onOpen: onSharingOpen, onClose: onSharingClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoListTitle, setNewTodoListTitle] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/boards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      } else {
        throw new Error('Failed to fetch boards');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (title, backgroundColor) => {
    try {
      const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, background_color: backgroundColor }),
      });
      if (response.ok) {
        const newBoard = await response.json();
        setBoards([...boards, newBoard]);
        onClose();
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
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditBoard = async (id, title, backgroundColor) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, background_color: backgroundColor }),
      });
      if (response.ok) {
        const updatedBoard = await response.json();
        setBoards(boards.map(board => board.id === id ? updatedBoard : board));
        onClose();
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
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setBoards(boards.filter(board => board.id !== id));
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
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchTodoLists = async (boardId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/todo_lists`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodoLists(data);
      } else {
        throw new Error('Failed to fetch todo lists');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodoList = async (boardId, title) => {
    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/todo_lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        const newTodoList = await response.json();
        setTodoLists([...todoLists, newTodoList]);
        setNewTodoListTitle('');
        toast({
          title: 'Todo list created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to create todo list');
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

  const handleEditTodoList = async (id, title) => {
    try {
      const response = await fetch(`${API_URL}/todo_lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        const updatedTodoList = await response.json();
        setTodoLists(todoLists.map(list => list.id === id ? updatedTodoList : list));
        toast({
          title: 'Todo list updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to update todo list');
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

  const handleDeleteTodoList = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todo_lists/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setTodoLists(todoLists.filter(list => list.id !== id));
        toast({
          title: 'Todo list deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to delete todo list');
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

  const handleCreateTask = async (todoListId, title, description) => {
    try {
      const response = await fetch(`${API_URL}/todo_lists/${todoListId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        toast({
          title: 'Task created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to create task');
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

  const handleEditTask = async (id, title, description) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => task.id === id ? updatedTask : task));
        toast({
          title: 'Task updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to update task');
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

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
        toast({
          title: 'Task deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to delete task');
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

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startList = todoLists.find(list => list.id === parseInt(source.droppableId));
    const finishList = todoLists.find(list => list.id === parseInt(destination.droppableId));

    try {
      if (startList === finishList) {
        // Reordering within the same list
        const newTasks = Array.from(tasks.filter(task => task.todo_list_id === startList.id));
        const [reorderedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, reorderedTask);

        const newTasksState = tasks.map(t => {
          if (t.todo_list_id === startList.id) {
            return newTasks.find(newTask => newTask.id === t.id) || t;
          }
          return t;
        });

        setTasks(newTasksState);

        // Update task order in the backend
        await fetch(`${API_URL}/todo_lists/${startList.id}/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ task_ids: newTasks.map(task => task.id) }),
        });
      } else {
        // Moving task between lists
        const startTasks = Array.from(tasks.filter(task => task.todo_list_id === startList.id));
        const [movedTask] = startTasks.splice(source.index, 1);
        const finishTasks = Array.from(tasks.filter(task => task.todo_list_id === finishList.id));
        finishTasks.splice(destination.index, 0, { ...movedTask, todo_list_id: finishList.id });

        const newTasksState = tasks.map(t => {
          if (t.id === movedTask.id) {
            return { ...t, todo_list_id: finishList.id };
          }
          return t;
        });

        setTasks(newTasksState);

        // Update the task's todo_list_id in the backend
        await fetch(`${API_URL}/tasks/${movedTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            title: movedTask.title,
            description: movedTask.description,
            todo_list_id: finishList.id
          }),
        });
      }

      // Update todoLists state to reflect changes
      const updatedTodoLists = todoLists.map(list => ({
        ...list,
        tasks: tasks.filter(task => task.todo_list_id === list.id),
      }));
      setTodoLists(updatedTodoLists);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task position',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Revert the state if the API call fails
      fetchTodoLists(selectedBoard.id);
    }
  };
  const ColorPickerComponent = ({ value, onChange }) => {
    return (
      <Popover>
        <PopoverTrigger>
          <Button
            backgroundColor={value}
            width="100%"
            height="40px"
            _hover={{ opacity: 0.8 }}
          />
        </PopoverTrigger>
        <PopoverContent width="200px">
          <PopoverBody>
            <Input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              width="100%"
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };


  const BoardModal = ({ isOpen, onClose, board }) => {
    const [title, setTitle] = useState(board ? board.title : '');
    const [backgroundColor, setBackgroundColor] = useState(board ? board.background_color : '#0079BF');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (board) {
        handleEditBoard(board.id, title, backgroundColor);
      } else {
        handleCreateBoard(title, backgroundColor);
      }
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{board ? 'Edit Board' : 'Create New Board'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Background Color</FormLabel>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {board ? 'Save' : 'Create'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const TaskEditModal = ({ isOpen, onClose, task, onSave }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const handleSave = () => {
      onSave(task.id, title, description);
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const Task = ({ task, index, onEdit, onDelete }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            borderWidth={1}
            borderRadius="md"
            p={3}
            mb={2}
            bg={snapshot.isDragging ? "gray.100" : "white"}
            boxShadow={snapshot.isDragging ? "lg" : "sm"}
            transition="box-shadow 0.2s, background-color 0.2s"
          >
            <Flex justify="space-between" align="center">
              <Text fontWeight="medium">{task.title}</Text>
              <HStack spacing={1}>
                <IconButton
                  icon={<EditIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditModalOpen(true)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(task.id)}
                />
              </HStack>
            </Flex>
            {task.description && <Text fontSize="sm" color="gray.600" mt={2}>{task.description}</Text>}
            <TaskEditModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              task={task}
              onSave={onEdit}
            />
          </Box>
        )}
      </Draggable>
    );
  };

  const TodoList = ({ todoList }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState(todoList.title);

    const handleAddTask = () => {
      if (newTaskTitle.trim()) {
        handleCreateTask(todoList.id, newTaskTitle.trim());
        setNewTaskTitle('');
      }
    };

    const handleEditTodoListSubmit = () => {
      if (editTitle.trim() && editTitle !== todoList.title) {
        handleEditTodoList(todoList.id, editTitle.trim());
        setEditMode(false);
      }
    };

    return (
      <Droppable droppableId={todoList.id.toString()}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            borderWidth={1}
            borderRadius="lg"
            p={4}
            mb={4}
            bg={snapshot.isDraggingOver ? "blue.50" : "white"}
            boxShadow="md"
            transition="background-color 0.2s"
            minWidth="300px"
            maxWidth="300px"
          >
            <Flex justify="space-between" align="center" mb={4}>
              {editMode ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleEditTodoListSubmit}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditTodoListSubmit()}
                  autoFocus
                />
              ) : (
                <Heading size="md">{todoList.title}</Heading>
              )}
              <Menu>
                <MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="ghost" size="sm" />
                <MenuList>
                  <MenuItem icon={<EditIcon />} onClick={() => setEditMode(true)}>
                    Edit
                  </MenuItem>
                  <MenuItem icon={<DeleteIcon />} onClick={() => handleDeleteTodoList(todoList.id)}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <VStack align="stretch" spacing={2} minHeight="100px">
              {tasks
                .filter(task => task.todo_list_id === todoList.id)
                .map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={(title, description) => handleEditTask(task.id, title, description)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))}
              {provided.placeholder}
            </VStack>
            <Flex mt={4}>
              <Input
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                mr={2}
              />
              <Button onClick={handleAddTask} colorScheme="blue">Add</Button>
            </Flex>
          </Box>
        )}
      </Droppable>
    );
  };

  return (
    <Flex minHeight="100vh">
      <Box width="250px" bg="gray.100" p={4} boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Image src="/brello-logo.png" alt="Brello Logo" boxSize="40px" />
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => {
            setSelectedBoard(null);
            onOpen();
          }}>
            Create New Board
          </Button>
          <Divider />
          <VStack align="stretch" spacing={2} overflowY="auto" maxHeight="calc(100vh - 200px)">
            {boards.map((board) => (
              <Button
                key={board.id}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  setSelectedBoard(board);
                  fetchTodoLists(board.id);
                }}
              >
                {board.title}
              </Button>
            ))}
          </VStack>
        </VStack>
      </Box>
      <Box flex={1} bg="gray.50">
        <Flex as="header" bg="white" p={4} alignItems="center" boxShadow="sm">
          <Heading as="h1" size="lg">
            {selectedBoard ? selectedBoard.title : 'My Boards'}
          </Heading>
          {selectedBoard && (
            <Button leftIcon={<ShareIcon />} ml={4} onClick={() => onSharingOpen()}>
              Share Board
            </Button>
          )}
          <Box ml="auto">
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar size="sm" name="User Name" src="https://bit.ly/broken-link" />
              </MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
        <Container maxW="container.xl" py={8}>
          {isLoading ? (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" />
            </Flex>
          ) : !selectedBoard ? (
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
              {boards.map((board) => (
                <Box
                  key={board.id}
                  bg={board.background_color || '#FFFFFF'}
                  height="150px"
                  borderRadius="lg"
                  p={4}
                  color={board.background_color ? 'white' : 'black'}
                  position="relative"
                  onClick={() => {
                    setSelectedBoard(board);
                    fetchTodoLists(board.id);
                  }}
                  cursor="pointer"
                  boxShadow="md"
                  transition="transform 0.2s, box-shadow 0.2s"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                >
                  <Heading as="h3" size="md">
                    {board.title}
                  </Heading>
                  <Flex
                    position="absolute"
                    top={2}
                    right={2}
                    opacity={0}
                    transition="opacity 0.2s"
                    _groupHover={{ opacity: 1 }}
                  >
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="white"
                      mr={2}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBoard(board);
                        onOpen();
                      }}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                      }}
                    />
                  </Flex>
                </Box>
              ))}
            </Grid>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Flex overflowX="auto" pb={4}>
                {todoLists.map((todoList) => (
                  <Box key={todoList.id} minWidth="300px" mr={4}>
                    <TodoList todoList={todoList} />
                  </Box>
                ))}
                <Box minWidth="300px">
                  <Flex>
                    <Input
                      placeholder="New todo list title"
                      value={newTodoListTitle}
                      onChange={(e) => setNewTodoListTitle(e.target.value)}
                      mr={2}
                    />
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      onClick={() => {
                        if (newTodoListTitle.trim()) {
                          handleCreateTodoList(selectedBoard.id, newTodoListTitle.trim());
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </DragDropContext>
          )}
        </Container>
      </Box>
      <BoardModal isOpen={isOpen} onClose={onClose} board={selectedBoard} />
      <BoardSharingModal isOpen={isSharingOpen} onClose={onSharingClose} boardId={selectedBoard?.id} />
    </Flex>
  );
};

export default BoardsPage;
