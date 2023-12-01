export default function About() {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1 mb-3">About</h1>
      {
        <div>
          <p className="dark:text-white text-xl mb-3 text-center">
            Bienvenue sur ImageHive - Votre Source Créative d'Images et de
            Vidéos
          </p>
          <div className="dark:text-white m-4">
            <p className="mb-1">Introduction</p>
            <p className="mb-1">
              Bienvenue sur ImageHive, l'essence même de l'inspiration visuelle.
              Notre plateforme est conçue pour répondre à vos besoins créatifs,
              qu'il s'agisse de projets professionnels, artistiques ou
              simplement de la recherche d'une dose d'esthétisme au quotidien.
            </p>
            <p className="mb-1">À Propos d'ImageHive</p>
            <p className="mb-1">
              ImageHive a été créé par une équipe passionnée qui comprend
              l'importance des images et des vidéos de haute qualité dans le
              monde moderne. Notre mission est de fournir une banque d'images et
              de vidéos exceptionnelle, accessible à tous.
            </p>
            <p className="mb-1">Fonctionnalités Principales</p>
            <p>
              {" "}
              - Diversité Créative : Explorez une bibliothèque riche et
              diversifiée d'images et de vidéos, soigneusement sélectionnées
              pour répondre à toutes les préférences et tous les projets.
            </p>
            <p>
              {" "}
              - Qualité Exceptionnelle : Chaque média sur ImageHive est choisi
              pour sa qualité visuelle exceptionnelle, garantissant une source
              d'inspiration inépuisable.
            </p>
            <p>
              {" "}
              - Facilité de Téléchargement : Téléchargez facilement des contenus
              en haute résolution pour vos projets, que vous soyez un
              professionnel de la création ou un passionné de photographie.
            </p>
            <p className="mb-1">
              {" "}
              - Partage Social : Partagez vos découvertes avec la communauté
              créative sur ImageHive et sur vos réseaux sociaux préférés.
            </p>
            <p className="mb-1">Comment Ça Marche</p>
            <p>
              {" "}
              - Explorez : Naviguez à travers nos collections diversifiées en
              utilisant des filtres intuitifs pour trouver l'image ou la vidéo
              parfaite.
            </p>
            <p>
              {" "}
              - Téléchargez : Téléchargez en toute simplicité en haute
              résolution, mettant à votre disposition des ressources visuelles
              exceptionnelles.
            </p>
            <p className="mb-1">
              {" "}
              - Inspirez et Partagez : Partagez vos créations avec le monde et
              découvrez le travail d'autres artistes pour une inspiration
              continue.
            </p>
            <p className="mb-1">Crédits</p>
            <p>
              Nous exprimons notre gratitude envers les artistes talentueux qui
              contribuent à la richesse de ImageHive. Leurs œuvres créatives
              enrichissent notre plateforme et inspirent la créativité dans le
              monde entier.
            </p>
            <p className="mb-3">
              Merci d'avoir choisi ImageHive - Où l'Imagination Prend Vie ! 📸🌟
            </p>
            <p className="mb-6">
              Ce projet a été réalisé dans le cadre scolaire en quatrième année
              d'ingénierie à ECE Paris.
            </p>
          </div>
        </div>
      }
      <div>
        <p className="dark:text-white text-xl mb-3 text-center">
          Les images et les vidéos proviennent de l'API du site pexels.com. Nous
          vous demandons de respecter les règles du site.
        </p>
        <div className="dark:text-white m-4">
          <p className="mb-1">
            - Les personnes identifiables ne doivent pas apparaître sous un
            mauvais jour ou d'une manière offensante.
          </p>
          <p className="mb-1">
            - Ne vendez pas de copies non modifiées d'une photo ou d'une vidéo,
            par exemple sous la forme d'une affiche, d'une impression ou d'un
            produit physique, sans les avoir modifiées au préalable.
          </p>
          <p className="mb-1">
            - Ne laissez pas entendre que des personnes ou des marques figurant
            sur les images approuvent votre produit.
          </p>
          <p className="mb-1">
            - Ne pas redistribuer ou vendre les photos et les vidéos sur
            d'autres plateformes de photos de stock ou de fonds d'écran.
          </p>
        </div>
      </div>
    </div>
  );
}
