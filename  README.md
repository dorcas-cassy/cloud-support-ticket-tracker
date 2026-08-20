# Cloud Support Ticket Tracker

A responsive IT support ticket management application built with HTML, CSS, JavaScript, Node.js and Express. The application was deployed on an Ubuntu AWS EC2 instance and configured to run continuously using PM2.

## Project Overview

The Cloud Support Ticket Tracker allows an IT support team to record, prioritize and manage technical support requests.

Users can create tickets for issues such as:

- Network connectivity problems
- Password and account problems
- Software errors
- Hardware faults
- VPN and cloud-access issues

## Features

- Create new IT support tickets
- Assign network, account, software or hardware categories
- Set low, medium or high priority
- View open, in-progress and resolved ticket totals
- Move tickets from Open to In Progress
- Mark completed tickets as Resolved
- Filter tickets by status
- Responsive design for desktop and mobile devices

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- Git and GitHub
- Ubuntu Linux
- AWS EC2
- PM2

## Project Architecture

User Browser  
↓  
AWS EC2 Public IP — Port 3000  
↓  
Node.js and Express Server  
↓  
HTML, CSS and JavaScript Application  

## Local Installation

Clone the repository:

```bash
git clone https://github.com/dorcas-cassy/cloud-support-ticket-tracker.git

```

Enter the project directory:

```bash
cd cloud-support-ticket-tracker
```

Install the dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

Open the application locally:

```text
http://localhost:3000
```

## AWS Deployment

The application was deployed using the following process:

1. Created an Ubuntu EC2 instance.
2. Configured SSH access on port 22.
3. Configured Custom TCP access on port 3000.
4. Connected to EC2 using an SSH key pair.
5. Installed Node.js, npm and Git.
6. Cloned the project from GitHub.
7. Installed the application dependencies.
8. Started the Node.js application.
9. Used PM2 to keep the application running.
10. Configured PM2 to restart automatically after a server reboot.

## Security Configuration

The EC2 security group permits:

- SSH traffic on port 22
- Application traffic on port 3000

The private `.pem` key, environment variables and `node_modules` directory are excluded from the GitHub repository.

## Skills Demonstrated

- Linux server administration
- AWS EC2 configuration
- SSH remote access
- Security-group configuration
- Node.js application deployment
- Process management using PM2
- Git version control
- GitHub repository management
- Application troubleshooting

## Author

Dorcas Asantewaa

GitHub: [dorcas-cassy](https://github.com/dorcas-cassy)