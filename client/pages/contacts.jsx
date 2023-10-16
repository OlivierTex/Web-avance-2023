import Layout from '../components/layout';

export default function Contacts() {
  return (
    <Layout>
      <h1>Contacts</h1>

      <form>
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Nom :
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Saisissez votre nom"
          className="form-input mt-1 p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-4 hover:bg-blue-700 transition-all duration-300"
        >
          Envoyer
        </button>
      </form>

      <div>
        Contacts :
        <br />
        - Greg Demirdjian
        <br />
        - Marc Hamchouchong
        <br />
        - Olivier Texier
      </div>
    </Layout>
  );
}
