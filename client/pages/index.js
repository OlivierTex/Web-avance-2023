import Navigation from '../components/navigation';

function Home() {
  return (
    <div className={`bg-light dark:bg-dark`}>

      <h1 className="h1">Bienvenue sur notre site</h1>
      <p className="paragraphe">Découvrez notre sélection de photos de haute qualité.</p>
      <div className="mt-8">
      <Navigation/>
      </div>
      
    </div>

  );
}

export default Home;
