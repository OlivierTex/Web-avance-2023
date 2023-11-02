import Navigation from '../components/navigation';

function Home() {
  return (
    <div>
      <h1 className="text-3xl text-center text-custom5 mt-8">Bienvenue sur notre site</h1>
      <p className="text-lg text-center text-custom5 mt-4">Découvrez notre sélection de photos de haute qualité.</p>
      <div className="mt-8">
      <Navigation/>
      </div>
    </div>
  );
}

export default Home;
