import React from 'react';
import ReactDOM from 'react-dom/client';
import { EventPage, loader as eventLoader } from './pages/EventPage';
import { EventsPage, loader as eventsLoader } from './pages/EventsPage';
import { NewEventPage, loader as newEventLoader } from './pages/NewEvent';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import './components/index.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <EventsPage />,
        loader: eventsLoader,
      },
      {
        path: '/events/:id',
        element: <EventPage />,
        loader: eventLoader,
      },
      {
        path: '/new-event',
        element: <NewEventPage />,
        loader: newEventLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
