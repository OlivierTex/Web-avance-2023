// ./handles.js
// Necessary imports
module.exports = {
    serverHandle: function (req, res) {
        const url = require('url')
        const qs = require('querystring')
        const about = require("./content/about.json");

          const route = url.parse(req.url)
          const path = route.pathname 
          const params = qs.parse(route.query)
          /*const queryParams = qs.parse(url.parse(req.url).query)
          console.log(path)
          console.log(queryParams)*/
          
          res.writeHead(200, {'Content-Type': 'text/html'})

          if (path === '/')
          {
            res.write("Vous pouvez visiter : <br/> -> /hello?Name=SaisirUnNom pour dire bonjour a la personne <br/> -> /hello?SaisirNomAuteur pour avoir plus d'informations sur l'auteur");
          }
          else if (path === '/hello' && 'name' in params)
          {

            if (route.query)
            {
              if (params['name'] === "Greg")
              {
                res.write("Bonjour, je m'appelle Greg et je suis l'auteur de cette petite application. <br/>Celle-ci est creee dans le cadre du cours de Technologies Web a l'ECE Paris.")
              }
              else if (params['name'] === "Marc")
              {
                res.write("Bonjour, je m'appelle Marc et je suis un collaborateur de cette petite application. <br/>Celle-ci est creee dans le cadre du cours de Technologies Web a l'ECE Paris.")
              }
              else if (params['name'])
              {
                res.write("Bonjour " + params['name'])
              }
            }
          }
          else if (path === '/about')
          {
            res.write("Author : " + about.author + "<br/>Content : " + about.content + "<br/>Date : " + about.date + "<br/>Title : " + about.title);
          }
          else
          {
            res.write("404 Code - Not found");
          }
          
          res.end()
        
    } 
  }

