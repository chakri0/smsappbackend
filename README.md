# PhillysBestPizza-Backend

## Project Setup

Follow these steps to set up and run the project:

1. **Fork and Clone the Repository**

Clone the project repository to your local machine by running:
`git clone <https://github.com/<YOUR_USERNAME>/PhillysBestPizza-Backend.git>`

2. **Install Dependencies**

Navigate to the project directory and install the required Node.js dependencies using npm:
`npm install`

3. **Start MySQL Server**

Before starting the project, ensure that the MySQL server is running. You can check if the MySQL server is running and the port it's using. By default, the port is set to 4306 in the `.env` file. If your MySQL server is running on a different port, update the `.env` file with the correct port.

4. **Create a MySQL Database**

Create a MySQL database named `phillypizza_local` in your MySQL server. You can use a MySQL client or a command-line tool to create the database.

5. **Start the Server**

Once you have set up the database and configured the environment, you can start the project by running the following command:
`npm run start`

# Coding Practices to Follow

When working on the project, make sure to adhere to the following coding practices:

-   Use uppercase for interface names.
-   Use camel case for variable names.
-   Before committing your changes, run the following commands to ensure code formatting and linting are in place:
    `npm run format && npm run lint`
