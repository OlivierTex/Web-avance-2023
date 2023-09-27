// ./index.js

const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'       <p>Hello World!</p>' +
'    </body>' +
'</html>'

const express = require('express')
const { v4: uuidv4 } = require('uuid');

const app = express()

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set('port', 8080)

const db = require('./dbClient')

app.get('/articles', (req, res) => {
    res.json(db.articles);
  });
  
app.post('/articles', (req, res) => {
    const newArticle = req.body;
    newArticle.id = uuidv4();
    db.articles.push(newArticle);
    res.status(201).json(newArticle);
  });

app.get('/articles/:articleId', (req, res) => {
    const articleId = req.params.articleId;
    const article = db.articles.find((article) => article.id === articleId);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  });

app.get('/articles/:articleId/comments', (req, res) => {
    const articleId = req.params.articleId;
    const comments = db.comments.filter((comment) => comment.articleId === articleId);
    res.json(comments);
  });



  /*
 potentiellement à debug - probleme au moment du test 

 - fix sur la requête à bien encadrer avec les guillemets, exemple : 
 
 curl -X POST -H "Content-Type: application/json" -d "{
  \"content\": \"Nouveau commentaire sur l'article\",
  \"author\": \"Prénom Nom\"
}" http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments

  */
app.post('/articles/:articleId/comments', (req, res) => {   
    const articleId = req.params.articleId;
    const newComment = {
      id: uuidv4(),
      timestamp: Date.now(),
      content: req.body.content,
      articleId,
      author: req.body.author,
    };
    db.comments.push(newComment);
    res.status(201).json(newComment);
  });
  
app.get('/articles/:articleId/comments/:commentId', (req, res) => {
    const articleId = req.params.articleId;
    const commentId = req.params.commentId;
    const comment = db.comments.find((comment) => comment.id === commentId && comment.articleId === articleId);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
});

app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
)