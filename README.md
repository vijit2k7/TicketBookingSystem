# TicketBookingSystem
 
## About the project
**This project contains the API of the Ticket Booking Platform 🎫.

## Technology Stack
**NodeJS with Express is used as framework for the development of the application.

## Database: MongoDB


## Installation
1.In the console, download a copy of the repo by running git clone https://github.com/vijit2k7/TicketBookingSystem.git.

2.Just run npm install to install all the dependencies.

## Development server
Run npm start or node server for a running development server. Navigate to http://localhost:3000/.


## App WorkFlow
**.Step by step Workflow for setting up the whole app on local or cloud server:**
  - **Register an admin user** db in mongodb by running the register user service(First create an admin user) using the following api-
    http://localhost:3000/api/users
    Req Eg-{
            "name":"Vijit Mishra",
            "phone":"9013523717",
            "email":"sachin2k7@yahoo.in",
            "password":"abcde",
            "isAdmin": "true"
           }
    In the response you will recieve a jwt authentication token just copy it and save it for further requirement.
  *Note You can register other users as well but you need to save the jwt token for each* 
  - **Register other users**- Using the api http://localhost:3000/api/users we can register other user by keeping the **isAdmin Flag as false**
  - **Authenticating Registered users** - Now we will need to authenticate users based on the token recieved earlier which can be done by the following api
  
    - First create a **tickets db** by running the tickets api to post all 40 tickets for a particular bus
    http://localhost:3000/api/tickets/all


## Screenshots
