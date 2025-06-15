# Ecommerce_Backend_Typescript

This is a backend project for an e-commerce application built with Node.js and TypeScript, featuring a modular architecture with message queue integration.

## Table of Contents

- [Ecommerce\_Backend\_Typescript](#ecommerce_backend_typescript)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Scripts](#scripts)
    - [Ecommerce\_Backend](#ecommerce_backend)
    - [sys\_message\_queue\_shop](#sys_message_queue_shop)
  - [Folder Structure](#folder-structure)
  - [API Documentation](#api-documentation)
  - [Using Bruno](#using-bruno)
  - [Documentation](#documentation)
  - [Architecture](#architecture)
  - [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ecommerce_backend_typescript.git
    ```
2. Navigate to the project directory:
    ```sh
    cd ecommerce_backend_typescript
    ```
3. Install dependencies for both services:
    ```sh
    # For main backend
    cd Ecommerce_Backend
    npm install
    
    # For message queue service
    cd ../sys_message_queue_shop
    npm install
    ```

## Scripts

### Ecommerce_Backend
- `npm run dev`: Start the development server using `nodemon`.
- `npm run build`: Clean the `dist` folder and compile TypeScript files.
- `npm start`: Start the server from the `dist` folder.
- `npm run lint`: Run ESLint to check for linting errors.
- `npm run lint:fix`: Run ESLint and fix linting errors.
- `npm run prettier`: Check code formatting using Prettier.
- `npm run prettier:fix`: Format code using Prettier.

### sys_message_queue_shop
- `npm run dev`: Start the message queue service in development mode.
- `npm run build`: Compile TypeScript files.
- `npm start`: Start the service from compiled files.
- `npm test`: Run Jest tests.

## Folder Structure

```
Ecommerce_Backend_Typescript/
├── docs/                           # Documentation and API testing
│   ├── api/                       # Bruno API collections
│   │   ├── bruno.json            # Bruno configuration
│   │   ├── product/              # Product API tests
│   │   ├── shop/                 # Shop API tests
│   │   └── test/                 # General API tests
│   ├── Data_Test/                # Test data
│   ├── knowledge/                # Project documentation
│   │   ├── class.md             # Class design patterns
│   │   ├── factoryPattern.md    # Factory pattern documentation
│   │   ├── nguyenLy.md          # Express error handling principles
│   │   └── reviewProject.md     # Project review and best practices
│   └── README_BUG/              # Bug reports and fixes
├── Ecommerce_Backend/             # Main backend service
│   ├── src/                      # Source files
│   │   ├── base/                 # Base/common components
│   │   │   ├── common/models/    # Base models
│   │   │   └── swagger/          # Swagger configuration
│   │   ├── modules/              # Feature modules
│   │   │   └── auth/             # Authentication module
│   │   │       ├── models/       # Auth models (ApiKey, Shop, etc.)
│   │   │       └── repository/   # Data access layer
│   │   └── ...                   # Other modules and components
│   ├── docs/                     # API documentation (OpenAPI)
│   ├── logs/                     # Application logs
│   ├── .env                      # Environment variables
│   ├── package.json              # NPM package configuration
│   └── tsconfig.json             # TypeScript configuration
└── sys_message_queue_shop/        # Message queue service
    ├── src/                      # Source files
    │   └── common/models/        # Common models
    ├── logs/                     # Service logs
    ├── .env                      # Environment variables
    ├── package.json              # NPM package configuration
    ├── jest.config.js            # Jest testing configuration
    └── tsconfig.json             # TypeScript configuration
```

## API Documentation

The project includes Swagger/OpenAPI documentation accessible at `/api-docs` when running the server. The documentation is automatically generated from the OpenAPI specification file located in [`Ecommerce_Backend/docs/openapi.yml`](Ecommerce_Backend/docs/openapi.yml).

## Using Bruno

Bruno is used in this project for API testing. Below are the steps to use Bruno:

1. Install Bruno from the official website or via npm:
    ```sh
    npm install -g brunorc
    ```

2. Open Bruno and import the collection from the [`docs/api/bruno.json`](docs/api/bruno.json) file.

3. You can find example requests in the following directories:
   - [`docs/api/shop/`](docs/api/shop/) - Shop-related API tests
   - [`docs/api/product/`](docs/api/product/) - Product-related API tests
   - [`docs/api/test/`](docs/api/test/) - General API tests

4. To run specific tests:
    ```sh
    # Run shop API tests
    bruno run docs/api/shop/
    
    # Run product API tests
    bruno run docs/api/product/
    
    # Run all tests
    bruno run docs/api/test/
    ```

## Documentation

The project includes comprehensive documentation in the [`docs/knowledge/`](docs/knowledge/) directory:

- [`class.md`](docs/knowledge/class.md) - Object-oriented design patterns and principles
- [`factoryPattern.md`](docs/knowledge/factoryPattern.md) - Factory pattern implementation guide
- [`nguyenLy.md`](docs/knowledge/nguyenLy.md) - Express.js error handling principles and flow
- [`reviewProject.md`](docs/knowledge/reviewProject.md) - Project review, best practices, and improvement suggestions

## Architecture

This project follows a modular architecture with:

- **Ecommerce_Backend**: Main API service handling business logic
- **sys_message_queue_shop**: Message queue service for asynchronous processing
- **Shared Models**: Common base models used across services
- **Authentication Module**: Centralized auth with API key management
- **Error Handling**: Centralized error handling with custom response types

## License

This project is licensed under the ISC License.

