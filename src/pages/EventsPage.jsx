import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { Input, Stack, Select, Flex, Box, InputGroup, InputLeftElement, HStack, Text, Avatar } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export const loader = async () => {
  const users = await fetch('http://localhost:3000/users');
  const events = await fetch('http://localhost:3000/events');
  const categories = await fetch('http://localhost:3000/categories');

  return {
    users: await users.json(),
    events: await events.json(),
    categories: await categories.json(),
  };
};

export const EventsPage = () => {
  const { users, events, categories } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEvents = events.filter((event) => {
    const matchTitle = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === 'all' || event.categoryIds.includes(Number(selectedCategory));
    return matchTitle && matchCategory;
  });

  return (
    <Box bg="lightgray" minHeight="100vh" p={6}>
      <Stack spacing={4}>
        <HStack spacing={4} justify="center">
          <InputGroup maxW="65%">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300"/>
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              _placeholder={{ color: 'gray.500' }}
              _focus={{ boxShadow: 'outline' }}
            />
          </InputGroup>

          <Select
            placeholder="Filter by category"
            size="md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            maxW="20%"
            bg="white"
            _focus={{ boxShadow: 'outline'}}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </HStack>

        <Flex wrap="wrap" justify="center">
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              borderWidth="1px"
              borderRadius="25px"
              overflow="hidden"
              cursor="pointer"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.05)' }}
              maxW="sm"
              width="300px"
              margin="1em"
              bg="white"
            >
              <img src={event.image} alt={event.title} style={{ height: '200px', width: '100%' }} />
              <Box padding="30" paddingTop="5">
                <Link to={`events/${event.id}`}>
                  <Text className='cardtitle'>{event.title}</Text>
                </Link>
                <p><Text className='carddescription'>{event.description}</Text></p>
                <p>Start Time: {new Date(event.startTime).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}</p>
                <p>End Time: {new Date(event.endTime).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}</p>
                <p>
                  Categories:{' '}
                  {event.categoryIds.map((categoryId) => (
                    <span key={categoryId}>
                      {categories.find((category) => category.id === categoryId)?.name}{' '}
                    </span>
                  ))}
                </p>
                <HStack alignItems="center" mt={2}>
                  <Avatar size="sm" src={users.find((user) => event.createdBy === user.id)?.image} alt="User Avatar" mr={2} />
                  <Text className='cardauthor'>{users.find((user) => event.createdBy === user.id)?.name}</Text>
                </HStack>
              </Box>
            </Box>
          ))}
        </Flex>
      </Stack>
    </Box>
  );
};
