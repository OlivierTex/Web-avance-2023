# Lab: Web API with Node.js

This lab requires to have installed Node.js, Express. The use of Nodemon is optional but recommended.

Nodemon installation : 

```bash
npm install nodemon
```

```bash
npm install express
```

Running the script :
```bash
npx nodemon index.js
```

**Part 1. Refactor your previous application to use Express** - refactoring the application from Lab 2 using Express.

**Part 2. Build an API** - is about creating a set of API routes to manage articles.

## Testing 

You can test it using the following command while in the directory :

```bash
npm run start
```

or :

```bash
node index.js
```

Once the application is launched, you can access it through any search engine parsing the following :

http://localhost:8080

### Part 1. ###

Access http://localhost:8080/hello for more informations.

### Part 2. ###

You can test the following API routes using **postman** :

- GET `/articles` - list all articles
- POST `/articles` - add a new article
- GET `/articles/:articleId` - get an article by ID
- GET `/articles/:articleId/comments` - get all comments of the article with `articleId`
- POST `/articles/:articleId/comments` - add a new comment to a specific article with `articleId`
- GET `/articles/:articleId/comments/:commentId` - get a comment with `commentId` of the article with `articleId`

The **GET** API routes can work directly in your search engine.

For the **POST** API routes, you need to use **postman** OR use the **curl** command through your terminal.

Example for `/articles/:articleId/comments` with curl :

```bash
curl -X POST -H "Content-Type: application/json" -d "{
  \"content\": \"Nouveau commentaire sur l'article\",
  \"author\": \"Prénom Nom\"
}" http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments
```
