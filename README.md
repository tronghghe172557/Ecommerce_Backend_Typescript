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
    cd ecommerce_backend_typescript
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
Ecommerce_Backend_Typescript/
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

## Using Bruno

Bruno is used in this project for API testing. Below are the steps to use Bruno:

1. Install Bruno from the official website or via npm:
    ```sh
    npm install -g brunorc
    ```

2. Open Bruno and import the collection from the [bruno.json](http://_vscodecontentref_/4) file.

3. You can find example requests in the [shop](http://_vscodecontentref_/5) and [test](http://_vscodecontentref_/6) directories. For example, to test the sign-up API, use the [signUp.bru](http://_vscodecontentref_/7) file:
    ```sh
    bruno run docs/api/shop/signUp.bru
    ```

4. To run all tests in the [test](http://_vscodecontentref_/8) directory:
    ```sh
    bruno run docs/api/test/

## License

This project is licensed under the ISC License.

