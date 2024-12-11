# Prerequisites
### [Node.js](https://nodejs.org/en/download/package-manager) Version 20.18.1 or higher
### [MySQL](https://dev.mysql.com/downloads/installer/) Version 8.0.40, Must have root user priviledges
# Setup
## Clone the project
### Open the project in an IDE of your choice
### There will be two folders "server" and "client"
## Installing dependency modules
### Use commands `cd server` then `npm install` to install the server modules
### Use commands `cd client` then `npm install` to install the client modules
### I usually have two different terminals for both the server and client running at the same time
# Setting up MySQL
### Open the MySql workbench or use the MySQL shell
### Create a server with connection Port 3306 (This is the default port for a MySQL server). I am using the MySQL workbench to create the connection, but this is not required.
### Create a database called 'league_tracker'. 
### The command I use looks like this `CREATE DATABASE league_tracker`
# Riot Games API
### Unfortunately the API keys last 24 hours so in order to run the app you will have to create a riot account and login through their developer portal to create your own API key.
### [Riot API](https://developer.riotgames.com/)
# Creating the `.env` file
### In the server directory, create a `.env` file and add the lines below. Replace the {} with your information.
### RIOT_API_KEY = {api_key}
### DB_HOST=localhost
### DB_USER=root
### DB_PASSWORD={password_for_root_user}
### DB_NAME=league_tracker
### JWT_SECRET = b33f48bef06e82be07132a0f2974168a972982f142df9da38c48605e3fe9a1ef393ddf98730fa1e4d78b60fed19768e1041a35b51f97ee5795aff682b2e070a7
# Running the APP
### Open two terminals, with one in the server directory and one in the client directory.
### Use the command `npm run dev` in both terminals.
# Navigating the APP
### The first thing you will see is a login/register page.
### I use a [Temporary Email Generator](https://temp-mail.org/en/) to create fake accounts.
### After registering an account it will ask you to link a riot account.
### Here you can put any valid North American game name and tagline. If you do not have one you can use this as an example: `Koala` `Euca`
