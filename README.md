# Udagram Serverless

This project is a part of Udacity Cloud Developer nanodegree.
Main goal is to learn how to create a serverless application using AWS cloud.

# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# Goals


* Create a TODO item
* Update an existing TODO item to mark it DONE
* Delete an existing item
* Get all todo Items of a User
* Upload an attachment for a TODO item

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application run following commands

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

## AWS API endpoint

```
https://oi3gapjky7.execute-api.us-east-1.amazonaws.com/dev
```

