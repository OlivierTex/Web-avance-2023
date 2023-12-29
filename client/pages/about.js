export default function About() {
  return (
    <div className="mx-auto w-4/5">
      <div className="bg-light dark:bg-dark dark:text-white p-6">
        <div className="mb-8">
          <h1 className=" text-3xl font-bold mb-6 text-center">
            Bienvenue sur ImageHive
          </h1>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className=" text-xl mb-4">
            Bienvenue sur ImageHive, l'essence même de l'inspiration visuelle.
            Notre plateforme est conçue pour répondre à vos besoins créatifs,
            qu'il s'agisse de projets professionnels, artistiques ou simplement
            de la recherche d'une dose d'esthétisme au quotidien.
          </p>
        </div>

        <div className="mb-8">
          <h2 className=" text-2xl font-bold mb-4">À Propos d'ImageHive</h2>
          <p className=" text-xl mb-4">
            ImageHive a été créé par une équipe passionnée qui comprend
            l'importance des images et des vidéos de haute qualité dans le monde
            moderne. Notre mission est de fournir une banque d'images et de
            vidéos exceptionnelle, accessible à tous.
          </p>
        </div>

        <div className="mb-8">
          <h2 className=" text-2xl font-bold mb-4">
            Fonctionnalités Principales
          </h2>
          <ul className="list-disc list-inside text-lg">
            <li className=" mb-2">
              Diversité Créative : Explorez une bibliothèque riche et
              diversifiée d'images et de vidéos, soigneusement sélectionnées
              pour répondre à toutes les préférences et tous les projets.
            </li>
            <li className=" mb-2">
              Qualité Exceptionnelle : Chaque média sur ImageHive est choisi
              pour sa qualité visuelle exceptionnelle, garantissant une source
              d'inspiration inépuisable.
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className=" text-2xl font-bold mb-4">Comment Ça Marche</h2>
          <ul className="list-disc list-inside text-lg">
            <li className=" mb-2">
              Explorez : Naviguez à travers nos collections diversifiées en
              utilisant des filtres intuitifs pour trouver l'image ou la vidéo
              parfaite.
            </li>
            <li className=" mb-2">
              Téléchargez : Téléchargez en toute simplicité en haute résolution,
              mettant à votre disposition des ressources visuelles
              exceptionnelles.
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className=" text-2xl font-bold mb-4">Crédits</h2>
          <p className=" text-xl mb-4">
            Nous exprimons notre gratitude envers les artistes talentueux qui
            contribuent à la richesse de ImageHive. Leurs œuvres créatives
            enrichissent notre plateforme et inspirent la créativité dans le
            monde entier.
          </p>
          <p className=" text-xl mb-6">
            Merci d'avoir choisi ImageHive - Où l'Imagination Prend Vie ! 📸🌟
          </p>
          <p className=" text-xl mb-6">
            Ce projet a été réalisé dans le cadre scolaire en quatrième année
            d'ingénierie à ECE Paris.
          </p>
        </div>

        <div>
          <h2 className=" text-2xl font-bold mb-4">Crédits pour les Médias</h2>
          <p className=" text-xl mb-4 text-center">
            Les images et les vidéos proviennent de l'API du site pexels.com.
            Nous vous demandons de respecter les règles du site.
          </p>
          <ul className="list-disc list-inside text-lg">
            <li className=" mb-2">
              Les personnes identifiables ne doivent pas apparaître sous un
              mauvais jour ou d'une manière offensante.
            </li>
            <li className=" mb-2">
              Ne vendez pas de copies non modifiées d'une photo ou d'une vidéo,
              par exemple sous la forme d'une affiche, d'une impression ou d'un
              produit physique, sans les avoir modifiées au préalable.
            </li>
            {/* Ajoutez d'autres éléments de liste selon les besoins */}
          </ul>
        </div>
      </div>
    </div>
  );
}
