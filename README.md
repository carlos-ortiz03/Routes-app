# RouteCrafter

RouteCrafter is a web application designed to help users generate custom routes for walking, cycling, or driving. Built using the MERN stack (MongoDB, Express, React, Node.js) and powered by the Mapbox API, RouteCrafter allows users to specify the distance they want to travel (in miles or kilometers) and their preferred mode of transportation. The app then generates a closed-loop route, making it perfect for those who want to explore new areas or plan their workouts. The user interface was designed in close collaboration with a designer, with whom I met with two times per week to review progress and make strategic decisions. We prioritized features to ensure the most critical ones were implemented within the project’s timeline constraints, resulting in a user-friendly and visually appealing experience.

## Live Demo

Check out the live demo of RouteCrafter [here](https://routecrafter.vercel.app/).

## Features

- **Custom Route Creation**: Generate routes based on a specified distance and mode of transportation.
- **Mode Options**: Choose between walking, cycling, or driving.
- **Closed Loop Routes**: All routes are designed to start and end at the same location.
- **Save Routes**: Save your favorite routes for easy access at a later time.
- **User Authentication**: Create an account and log in to manage your saved routes.
- **Interactive Map**: Visualize your routes on an interactive map powered by Mapbox.

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **API**: Mapbox API for map and route generation
- **Deployment**: Vercel (Frontend) and Heroku (Backend)

## Reflection

### Timeline

- **June to July**: Project development and completion.

### Main Challenges and Solutions

- **Closed Loop Route Generation**:
  - **Challenge**: When generating a closed-loop route with Mapbox, the route would generate at the same location repeatedly.
  - **Solution**: Developed an algorithm to set up waypoints, ensuring the route formed a proper closed loop.

- **Monorepo Deployment**:
  - **Challenge**: Configuring deployment in a monorepo was difficult, and ensuring all deployment specifications were met required extensive debugging.
  - **Solution**: Spent considerable time debugging and adjusting configurations to successfully deploy both the frontend and backend.

### Things Learned

- **Algorithm Development**: Improved skills in algorithm design by creating a solution for generating closed-loop routes with Mapbox.
- **Monorepo Management**: Gained experience in handling complex deployments within a monorepo, including managing dependencies and configurations.
- **REST API Development**: Developed a REST API in the backend to enable the frontend to access and interact with data stored in the MongoDB database.
- **Collaboration**: Enhanced collaboration skills by working closely with a designer. We prioritized features strategically to fit within the project’s timeline constraints, ensuring a well-rounded and user-friendly final product.
