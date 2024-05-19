# Loose Server

An e-commerce platform for women's clothing.

## Table of Contents

- [Loose Server](#loose-server)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Introduction

Loose Server is a backend server application designed to support an e-commerce platform specializing in women's clothing. It provides various features to manage users, products, orders, and more, facilitating seamless interaction between customers and the platform.

## Features

- User authentication and authorization using JSON Web Tokens (JWT).
- Secure password hashing with bcrypt.
- Integration with Cloudinary for image hosting and management.
- CORS middleware to enable cross-origin resource sharing.
- Environment configuration with dotenv.
- Rate limiting middleware using express-rate-limit.
- Security middleware such as helmet and xss-clean to enhance application security.
- Mongoose integration for MongoDB database management.
- Validation of request data with Joi.
- Logging middleware with Morgan.
- File upload handling with Multer.
- Sending emails using Nodemailer.
- Generating Swagger documentation with Swagger-jsdoc and Swagger-ui-express.

## Getting Started

To get started with Loose Server, follow these steps:

### Prerequisites

- Node.js installed on your machine
- MongoDB database

### Environment Variables

This project uses several environment variables for configuration. These variables can be set in a `.env` file in the root of your project. Below is a list of the environment variables used and their descriptions:

- **NODE_ENV**: Sets the environment mode to `development`, `production`, or `test`.
- **PORT**: The port number on which the server will listen. Default is `8080`.
- **TOKEN_SECRET**: Secret key used for JWT token generation.
- **TOKEN_EXPIRY**: Expiry duration for JWT tokens. Default is `10d` (10 days).
- **TOKEN_DEV**: Expiry duration for JWT tokens in development mode. Default is `30d` (30 days).
- **CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET**: Cloudinary credentials for file storage.
- **ADMIN_WHATSAPP_NUMBER**: Admin's WhatsApp number for notification purposes.
- **DB_URI**: MongoDB connection URI for production.
- **DB_LOCAL**: MongoDB connection URI for local development.
- **MAILER_USER, MAILER_PASS**: Username and password for the mailer service.

Make sure to set these environment variables according to your environment needs before running the project.

### Installation

1. Clone the repository:

```sh
git clone https://github.com/AbdulrahmanAbuzied/loose_server.git
```

2. Install dependencies:

```sh
npm install
```

## Usage

To run the server, use the following command:

```sh
npm run build
npm start
```

For development with live reloading, you can use:

```sh
npm run dev
```

## Contributing

Contributions to Loose Server are welcome! If you'd like to contribute, please follow these guidelines:
- Fork the repository
- Create a new branch
- Make your changes
- Commit your changes with descriptive commit messages
- Push your changes to your fork
- Submit a pull request

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This project utilizes various open-source libraries and tools. See the [package.json](package.json) file for a complete list of dependencies.
- Special thanks to the contributors of the dependencies used in this project.