# Ece-Webtech-602

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#participants">Participants</a>
    </li>
    <li>
        <a href="#progress">Progress</a>
    </li>
    <li>
        <a href="#testing">Testing</a>
    </li>
    <li>
      <a href="#server">Server</a>
    </li>
    <li>
        <a href="#client">Client</a>
    </li>
  </ol>
</details>


## Participants 

Olivier TEXIER : olivier.texier@edu.ece.fr  
Marc HAM-CHOU-CHONG : marc.hamchouchong@edu.ece.fr  
Greg DEMIRDJIAN : greg.demirdjian@edu.ece.fr


## Progress

In this section, we'll explain what stage our project has reached.  
  
At this point, we've integrated the first six labs and they're all up and running.
  - The first three labs form the server section. 
  - The rest are on the client side and are still being developed.

Our latest additions include : 
- DarkMode.
- Retrieving images from an image bank with an API.
- Merging bank and article pages with two modes: default and gried view.
- Dynamically generated image pages displaying all info, likes, dislikes and comments.
- Adding and using supabase in the project (features below).
- Create an account and log in as user or admin.
- Account page after logging in.
- Comment, report comments, like, dislike images.
- Managing reported comments.

You can check the latest deployment here : [ece-webtech-602.vercel.app](https://ece-webtech-602.vercel.app)


## Testing 

You can test it using the following command while in the directory :

```bash
 npm install 
```

Server launch :
```bash
npm run dev  
 ```

Once the application is launched, you can access it through any search engine parsing the following :

http://localhost:3000


## Server 

We use Node.js.

README du [server](server/README.md)  

## Client 

We're using React together with Next.js and tailwind CSS.

README du [client](client/README.md)  
