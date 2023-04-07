# Products Frontend and Backend

This project consists of a frontend and backend application for managing product information.

## Prerequisites

To run this project, you need to have the following installed on your machine:

- Node.js
- MySQL
- npm or yarn

## Installation

1. Clone this repository onto your local machine.
2. Navigate to the backend directory using the terminal and run `npm install` or `yarn install` to install the necessary dependencies.
3. Create a `.env` file in the backend directory with the following environment variables:
    - DB_URI: the connection string for your MongoDB database.
    - JWT_SECRET: a secret key for generating JSON web tokens.
    - PORT: the port number to run the backend server on.
4. Run `npm start` or `yarn start` to start the backend server.
5. Navigate to the frontend directory using the terminal and run `npm install` or `yarn install` to install the necessary dependencies.
6. Create a `.env` file in the frontend directory with the following environment variables:
    - REACT_APP_API_BASE_URL: the base URL for your backend API.
7. Run `npm start` or `yarn start` to start the frontend application.

## Usage

Once you have both the frontend and backend applications running, you can access the application by navigating to http://localhost:3000/ in your web browser. From here, you can add, edit, and delete products.

## Deployment

To deploy this project, you can follow these steps:

1. Create an EC2 instance on Amazon Web Services.
2. Install Node.js, MongoDB, and other necessary dependencies on the server.
3. Clone this repository onto the server.
4. Set up a reverse proxy to redirect incoming traffic to the backend server.
5. Use a service like Let's Encrypt to obtain an SSL certificate for your domain.
6. Update the `.env` files on the server to include the necessary environment variables.
7. Start the backend and frontend servers using `npm start` or `yarn start`.
8. Navigate to your domain in a web browser to access the application.

## Contributing

If you want to contribute to this project, you can follow these steps:

1. Fork this repository.
2. Make changes to your forked repository.
3. Submit a pull request to the original repository.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
