import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Heading, Text, Image, Select, Button, FormControl, FormLabel, Input, Avatar, HStack,} from '@chakra-ui/react';

export const loader = async ({ params }) => {
  const usersPromise = fetch('http://localhost:3000/users');
  const eventsPromise = fetch(`http://localhost:3000/events/${params.id}`);
  const categoriesPromise = fetch('http://localhost:3000/categories');

  const [usersRes, eventsRes, categoriesRes] = await Promise.all([
    usersPromise,
    eventsPromise,
    categoriesPromise,
  ]);

  return {
    users: await usersRes.json(),
    events: await eventsRes.json(),
    categories: await categoriesRes.json(),
  };
};

export const EventPage = () => {
  const navigate = useNavigate();
  const { users, events, categories } = useLoaderData();

  const creator = users.find((user) => user.id === events.createdBy);

  const [isEditing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(events.title);
  const [editedDescription, setEditedDescription] = useState(events.description);
  const [editedUser, setEditedUser] = useState(parseInt(events.createdBy));
  const [editedCategory, setEditedCategory] = useState(
    parseInt(events.categoryIds[0])
  );
  const [editedImage, setEditedImage] = useState(events.image);
  const [editedStartTime, setEditedStartTime] = useState(events.startTime);
  const [editedEndTime, setEditedEndTime] = useState(events.endTime);

  useEffect(() => {
    setEditedUser(parseInt(events.createdBy));
  }, [events.createdBy]);

  useEffect(() => {
    setEditedCategory(parseInt(events.categoryIds[0]));
  }, [events.categoryIds]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${events.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          createdBy: editedUser,
          categoryIds: [editedCategory],
          image: editedImage,
          startTime: editedStartTime,
          endTime: editedEndTime,
        }),
      });

      if (response.ok) {
        toast.success('Details updated successfully! This page will reload.');

        // Reload the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 5000);

        
      } else {
        toast.error('Failed to update event details');
      }
    } catch (error) {
      console.error('Error updating event details:', error.message);
    }

    setEditing(false);
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/events/${events.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Event deleted successfully');

          navigate('/');
        } else {
          toast.error('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error.message);
      }
    }
  };

  return (
    <Box>
      <Image
        src={isEditing ? editedImage : events.image}
        alt={events.title}
        maxW="100%"
        maxH="40vh"
        objectFit="cover"
        boxSize="100%"
        mb={4}
      />
      <Box pl={4}>
        <Heading
          mb={4}
          color={isEditing ? 'black' : '#db0891'}
        >
          {isEditing ? (
            <FormControl mb={2}>
            <FormLabel>Event title</FormLabel>
           <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />             </FormControl>
          ) : (
            events.title
          )}
        </Heading>
        <HStack alignItems="center" mt={2} mb={3}>
          {!isEditing && (
            <>
              <Avatar size="sm" src={creator.image} alt="User Avatar" mr={2} />
              <Text className="cardauthor">
                {users.find((user) => events.createdBy === user.id)?.name}
              </Text>
            </>
          )}
        </HStack>

        {isEditing ? (
          <form>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>User</FormLabel>
              <Select
                value={editedUser}
                onChange={(e) => setEditedUser(parseInt(e.target.value))}
              >
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
                value={editedCategory}
                onChange={(e) => setEditedCategory(parseInt(e.target.value))}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                type="text"
                value={editedImage}
                onChange={(e) => setEditedImage(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                value={editedStartTime}
                onChange={(e) => setEditedStartTime(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                value={editedEndTime}
                onChange={(e) => setEditedEndTime(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="pink" mr={4} mb={10} onClick={handleSave}>
              Save
            </Button>
            <Button mb={10} onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <Text mb={4}>{events.description}</Text>
            <Text mb={2} fontWeight="bold">
              Start Time:{' '}
              {new Date(events.startTime).toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Text>
            <Text mb={4} fontWeight="bold">
              End Time:{' '}
              {new Date(events.endTime).toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Text>
            <Text mb={10}>
              Categories:{' '}
              {events.categoryIds.map((categoryId) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId
                );
                return category ? (
                  <span key={category.id}>{category.name} </span>
                ) : null;
              })}
            </Text>
            <Button colorScheme="pink" mr={4} onClick={handleEdit}>
              Edit
            </Button>
            <Button onClick={handleDelete}>Delete</Button>
          </>
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
};
