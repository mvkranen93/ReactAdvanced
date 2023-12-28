import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Heading, Input, Select,} from '@chakra-ui/react';

export const loader = async () => {
  const users = await fetch('http://localhost:3000/users');
  const categories = await fetch('http://localhost:3000/categories');

  return {
    users: await users.json(),
    categories: await categories.json(),
  };
};

export const NewEventPage = () => {
  const navigate = useNavigate();
  const { users = [], categories = [] } = useLoaderData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      description,
      image,
      location,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      createdBy: parseInt(selectedUser),
      categoryIds: [parseInt(selectedCategory)],
    };

    try {
      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        // Reset form fields
        setTitle('');
        setDescription('');
        setLocation('');
        setStartTime('');
        setEndTime('');
        setSelectedUser('');
        setSelectedCategory('');

        // Navigate to the home page after successful submission
        navigate('/');
        
      } else {
        console.error('Failed to add event:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <Box maxW="600px" m="auto" p={4}>
      <Heading mb={4} color="#db0891">
        New Event
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Description</FormLabel>
          <Input
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Image</FormLabel>
          <Input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Location</FormLabel>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Start Time</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>End Time</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Created By</FormLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Category</FormLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button colorScheme="pink" type="submit">
          Add Event
        </Button>
      </form>
    </Box>
  );
};
