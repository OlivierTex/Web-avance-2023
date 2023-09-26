// ./index.js

// Define a string constant concatenating strings
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
const app = express()

app.set('port', 8080)

const db = require('./dbClient')

app.get('/hello', function (req, res) {
    res.send("Vous pouvez visiter : <br/> -> /hello/SaisirUnNom pour dire bonjour a la personne <br/> -> /hello/SaisirNomAuteur pour avoir plus d'informations sur l'auteur")
 })


app.get('/hello/:name', function (req, res) {
    if (req.params.name === 'Greg')
        res.send("Bonjour, je m'appelle Greg et je suis l'auteur de cette petite application. <br/>Celle-ci est creee dans le cadre du cours de Technologies Web a l'ECE Paris.")
    else
        res.send("Hello " + req.params.name)
})


app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
)