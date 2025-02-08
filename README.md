# Ecommerce_Backend_Typescript

This is a backend project for an e-commerce application built with Node.js and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ecommerce_backend_typescript.git
    ```
2. Navigate to the project directory:
    ```sh
    cd ecommerce_backend_typescript/Ecommerce_Backend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Scripts

- `npm run dev`: Start the development server using `nodemon`.
- `npm run build`: Clean the `dist` folder and compile TypeScript files.
- `npm start`: Start the server from the `dist` folder.
- `npm run lint`: Run ESLint to check for linting errors.
- `npm run lint:fix`: Run ESLint and fix linting errors.
- `npm run prettier`: Check code formatting using Prettier.
- `npm run prettier:fix`: Format code using Prettier.

## Folder Structure

```
Ecommerce_Backend/
├── dist/                   # Compiled output
├── node_modules/           # Node.js modules
├── src/                    # Source files
│   ├── controllers/        # Controllers
│   ├── models/             # Models
│   ├── routes/             # Routes
│   ├── services/           # Services
│   └── index.ts            # Entry point
├── .env                    # Environment variables
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore file
├── package.json            # NPM package configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## License

This project is licensed under the ISC License.

