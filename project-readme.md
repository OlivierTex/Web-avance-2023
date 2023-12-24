# Blogging application - ECE Webtech project

Bienvenue sur ImageHive - Votre Source Créative d'Images et de Vidéos
Introduction
Bienvenue sur ImageHive, l'essence même de l'inspiration visuelle. Notre plateforme est conçue pour répondre à vos besoins créatifs, qu'il s'agisse de projets professionnels, artistiques ou simplement de la recherche d'une dose d'esthétisme au quotidien.

À Propos d'ImageHive
ImageHive a été créé par une équipe passionnée qui comprend l'importance des images et des vidéos de haute qualité dans le monde moderne. Notre mission est de fournir une banque d'images et de vidéos exceptionnelle, accessible à tous.

Fonctionnalités Principales
Diversité Créative : Explorez une bibliothèque riche et diversifiée d'images et de vidéos, soigneusement sélectionnées pour répondre à toutes les préférences et tous les projets.

Qualité Exceptionnelle : Chaque média sur ImageHive est choisi pour sa qualité visuelle exceptionnelle, garantissant une source d'inspiration inépuisable.

Facilité de Téléchargement : Téléchargez facilement des contenus en haute résolution pour vos projets, que vous soyez un professionnel de la création ou un passionné de photographie.

Partage Social : Partagez vos découvertes avec la communauté créative sur ImageHive et sur vos réseaux sociaux préférés.

Comment Ça Marche
Explorez : Naviguez à travers nos collections diversifiées en utilisant des filtres intuitifs pour trouver l'image ou la vidéo parfaite.

Téléchargez : Téléchargez en toute simplicité en haute résolution, mettant à votre disposition des ressources visuelles exceptionnelles.

Inspirez et Partagez : Partagez vos créations avec le monde et découvrez le travail d'autres artistes pour une inspiration continue.

Crédits
Nous exprimons notre gratitude envers les artistes talentueux qui contribuent à la richesse de ImageHive. Leurs œuvres créatives enrichissent notre plateforme et inspirent la créativité dans le monde entier.

Merci d'avoir choisi ImageHive - Où l'Imagination Prend Vie ! 📸🌟

Ce projet a été réalisé dans le cadre scolaire en quatrième année d'ingénierie à ECE Paris.

## Production

- Vercel URL: https://ece-webtech-602.vercel.app

- Supabase project URL: https://supabase.com/dashboard/project/abzhxqqgpeastgmtrcci

## Usage

Guide pour Démarrer et Utiliser l'Application
Pour commencer à utiliser l'application et exécuter les tests, suivez ces étapes simples :

- Cloner le Répertoire en local sur votre ordinateur:

```bash
git clone https://github.com/OlivierTex/ece-webtech-602
```

```bash
cd ece-webtech-602/client
```

- Installer les dépendances nécessaires et lancer l'application :

```bash
npm install
npm run build
npm start
```

- Démarrer Supabase

```bash
cd supabase
docker-compose up
```

## Authors

Olivier TEXIER : olivier.texier@edu.ece.fr  
Marc HAM-CHOU-CHONG : marc.hamchouchong@edu.ece.fr  
Greg DEMIRDJIAN : greg.demirdjian@edu.ece.fr

## Log :

Compte utilisateur :

```bash
user@user.user
```

```bash
user
```

Compte admin :

```bash
admin@admin.admin
```

```bash
admin
```



## Tasks

### Project management:

- Naming convention
    - Self-evaluation: 2/2
    - Comments: 
- Project structure
    - Self-evaluation: 2/2
    - Comments: Nous avons essayé de créer une structure de projet et des dossiers la plus simple et la plus compréhensible au possible. Ainsi les composants sont tous regroupés en un dossier, les images sont organisés dans le dossier public, pour les pages, nous avons essayé de les regrouper au maximum de manière logique dans des dossiers quand c'était possible.
- Git
    - Self-evaluation: 2/2
    - Comments: Nous avons suivi les conventionnal commits ce qui est vérifiable dans l'historique des commits.
- Code quality
    - Self-evaluation: 4/4
    - Comments: Nous utilisons Prettier.
- Design, UX, and content
    - Self-evaluation: 4/4
    - Comments: Le visuel de la webapp a été pensé pour être simple d'utilisation et intuitif. Par exemple, pour l'affichage des banques, nous avons créé une grid view en x2 x4 ou x6 images par ligne. De plus, pour toutes nos classes tailwind et leurs dimensions nous nous basons sur la taille de la fenêtre afin de pouvoir adpater l'affichage à tous les écrans. Nous avons essayé d'utiliser le minimum de composants préfaits et avons privilégié de les créer nous-même.

### Application development:

- Home page
    - Self-evaluation: 2/2
    - Comments: place your comments
- Navigation
    - Self-evaluation: 2/2
    - Comments: La barre de navigation est intégrée dans le composant Layout qui est appelé dans le _app.js et donc dans toutes les pages de notre webapp. Cette barre contient tous les liens vers les banques, albums, comptes, accueil, about, contact, etc ...
- Login and profile page
    - Self-evaluation: 4/4
    - Comments: Nous utilisons le composant Auth de Supabase pour la connexion des utilisateurs. Lorsqu'un utilisateur se connecte, il a un bouton avec son image de profil Gravatar et son username qui le dirige vers sa page personnelle. Celle-ci lui permet de voir et modifier ses informations. De plus nous avons ajouté une page spécialement pour les administrateurs. Celle-ci n'est accessible que par eux via un bouton qui s'affiche dans le header si l'on est admin. Ils peuvent notamment gérer les utilisateurs et modérer s'il y a eu des signalements de commentaires.
- Post creation and display
    - Self-evaluation: 6/6
    - Comments: Pour cette partie nous avons décidé de donner la possibilité de créer des albums aux utilisateurs connectés. Ils peuvent donc ajouter des images et vidéos depuis les banques dans leurs albums. Les albums sont tous affichés sur la page album, avec pagination et tri par date de création. Lorsque l'on clique sur un album, chacun a une page à part entière avec le contenu et les commentaires des autres utilisateurs s'il y en a. Pour choisir quelle image ou vidéo ajouter à un album, il faut aller sur la page de la dite image ou vidéo et cliquer sur le bouton associé qui ouvrira un menu dans ce but.
- Comment creation and display
    - Self-evaluation: 4/4
    - Comments: Sur les albums, un utilisateur connecté peut ajouter un commentaire en bas de la page, il peut aussi signaler un autre commentaire ou éditer ses propres commentaires. De plus, un utilisateur peut aussi rajouter des commentaires directement sur les images et vidéos des banques.
- Post modification and removal
    - Self-evaluation: 4/4
    - Comments: Après avoir créé un album, seul l'utilisateur qui l'a créé peut le modifier, que ce soit la description ou ajouter et supprimer des photos ou vidéos. De plus, il peut aussi supprimer son album.
- Search
    - Self-evaluation: 6/6
    - Comments: Un utilisateur connecté ou non peut effectuer une recherche sur la page album via la barre de recherche associée. Celle-ci est effectuée côté serveur. De plus, dans les banques d'images et vidéos, il est également possible d'effectuer une recherche sur la banque Pexels.
- Use an external API
    - Self-evaluation: 2/2
    - Comments: Nous utilisons l'API de Pexels pour récupérer des images et vidéos de qualité. C'est sur cette base que nous avons intégré la banque d'images et vidéos ainsi que les albums. Nous y récupérons les images et vidéos ainsi que leurs informations.
- Resource access control
    - Self-evaluation: 6/6
    - Comments: La RLS a été activée, en particulier sur notre table user. Les utilsateurs n'ont accès qu'à leurs informations et ne peuvent pas modifier leur catégorie user/admin. Les admins ont accès à toutes les informations, peuvent les modifier, supprimer ou insérer à leur gré. Cela a été fait en utilisant des policies sur la RLS d'une part et des triggers pour un cas particulier.
- Account settings
    - Self-evaluation: 4/4
    - Comments: Sur la page de son compte l'utilisateur peut modifier : Username, email, langue et bio. Chacun des paramètres est envoyé en BDD lorsque valdié.
- WYSIWYG integration
    - Self-evaluation: 
    - Comments: 
- Gravatar integration
    - Self-evaluation: 2/2
    - Comments: Nous avons intégré Gravatar pour associer une image de profile aux utilisateurs via leur adresse mail. Par exemple, celle-ci est affichée dans le header à côté du username lorsque l'utilisateur est connecté. Nous avons attribué l'image 'rétro' par défault.
- Light/dark theme
    - Self-evaluation: 2/2
    - Comments: Un bouton pour changer de mode Light/Dark est disponible dans le header, en haut à gauche sur toute les pages.
## Bonuses

- Admin dashboard to manage users and posts
    - Self-evaluation: fonctionnelle 
    - Comments: Vous pouvez vous connecter en tant qu'administrateur. Cela vous permet d'ajouter et de supprimer un utilisateur. Vous pouvez également gérer les commentaires signalés et répondre aux messages qui ont été envoyés.
- Add likes and/or reactions on posts.
    - Self-evaluation: fonctionnelle 
    - Comments: Vous pouvez réagir aux images, vidéos et albums avec des likes. Cela vous permet de les retrouver à tout moment sur votre compte utilisateur.
- Add nested comments.
    - Self-evaluation: fonctionnelle 
    - Comments: Vous pouvez réagir aux images, vidéos et albums avec des commentaires. Que vous pouvez modifier, supprimer et signaler.
- Preview video.
    - Self-evaluation: fonctionnelle 
    - Comments: Si vous accédez à la page vidéo et basculez en mode "Grid View", vous avez la possibilité d'apercevoir le début de la vidéo en survolant la souris. Veuillez noter que la page peut mettre du temps à se charger.
