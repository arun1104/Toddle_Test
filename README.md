# Toddle_Test

## Setup
npm install

## Configuring node server
Change configuration variables in .env file.

## Supported Http versions:
Only HTTPS


## Default port running:
3000


## Url to access:
https://localhost:3000/v1

## Version of API
v1


## Server framework used:
Express

## Automation Testing framework used:
Chai,Mocha and Sinon

## Manual Testing tool used:
Postman

## Design and implementation
Used mongodb-in-memory npm module to store data in memory.
It is a simple implementation with very few validations.
Following things are not taken care of:
a) Uniqueness while submitting survey reponse i.e same user should not submit the survey again.
b) Password encryption at client side and DB side.
c) Deployment script.
d) Unit test cases for all files
