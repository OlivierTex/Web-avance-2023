import Layout from '../components/layout';

export default function Contacts() {
  return (
    <Layout>
      <h1 className="text-3xl text-center mt-8">Contacts</h1>

      <form className="mt-8">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Nom :
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Saisissez votre nom"
          className="form-input mt-1 p-2 w-full border-2 border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-4 hover:bg-blue-700 transition-all duration-300 rounded-md"
        >
          Envoyer
        </button>
      </form>

      <div className="text-center mt-8 text-gray-700">
        <p className="text-lg">Contacts :</p>
        <br />
        - Greg Demirdjian
        <br />
        - Marc Hamchouchong
        <br />
        - Olivier Texier
      </div>

      <div className="text-center mt-8">
        <p className="text-lg">Adresse : XXX Rue de XXXX, 75000 Paris</p>
        <p className="text-lg">Téléphone : +33 X XX XX XX XX</p>
        <p className="text-lg">Email : xxx@xxx.com</p>
      </div>
    </Layout>
  );
}
