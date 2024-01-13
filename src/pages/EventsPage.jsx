import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { Input, Stack, Select, Flex, Box, InputGroup, InputLeftElement, HStack, Text, Avatar } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export const loader = async () => {
  try {
    const usersResponse = await fetch('http://localhost:3000/users');
    const eventsResponse = await fetch('http://localhost:3000/events');
    const categoriesResponse = await fetch('http://localhost:3000/categories');

    console.log('Users API Response:', usersResponse);
    console.log('Events API Response:', eventsResponse);
    console.log('Categories API Response:', categoriesResponse);


    // Check if all responses are ok
    if (!usersResponse.ok || !eventsResponse.ok || !categoriesResponse.ok) {
      console.error('Error fetching data:', usersResponse.statusText, eventsResponse.statusText, categoriesResponse.statusText);
      return {
        users: [],
        events: [], 
        categories: [],
        error: 'Failed to fetch data',
      };
    }

    const usersData = await usersResponse.json();

    let eventsData = [];
    try {
      eventsData = await eventsResponse.json();
      console.log('Events Data:', eventsData);
    } catch (error) {
      console.error('Error parsing events data:', error.message);
      return {
        users: [],
        events: [], 
        categories: [],
        error: 'Failed to parse events data',
      };
    }

    const categoriesData = await categoriesResponse.json();

    return {
      users: usersData,
      events: eventsData,
      categories: categoriesData,
    };
  } catch (error) {
    console.error('Error loading data:', error.message);
    return {
      users: [],
      events: [], 
      categories: [],
      error: 'Failed to load data',
    };
  }
};



export const EventsPage = () => {
  const { users, events, categories, error } = useLoaderData();

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Check if events is defined before using filter
  if (!events || !Array.isArray(events)) {
    console.error('Events data is not a defined array:', events);
    return (
      <div>
        <p>Error: Events data is not a defined array</p>
      </div>
    );
  }


  // Ensure that events is an array before using filter
  const eventsArray = Array.isArray(events) ? events : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEvents = eventsArray.filter((event) => {
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
        <Text className='carddescription'>{event.description}</Text>

        {/* Start Time */}
        <div>
          Start Time:{' '}
          {new Date(event.startTime).toLocaleString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          })}
        </div>

        {/* End Time */}
        <div>
          End Time:{' '}
          {new Date(event.endTime).toLocaleString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          })}
        </div>

        {/* Categories */}
        <div>
          Categories:{' '}
          {event.categoryIds.map((categoryId) => (
            <span key={categoryId}>
              {categories.find((category) => category.id === categoryId)?.name}{' '}
            </span>
          ))}
        </div>

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
