export default function Contacts() {
  return (
    <div>
      <h1 className="text-3xl text-custom5 text-center mt-8">Contacts</h1>

      <form className="mt-8">
        <label htmlFor="name" className="block text-custom5 text-sm font-bold mb-2">
          Nom :
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Saisissez votre nom"
          className="form-input mt-1 p-2 w-full bg-custom2 border-2 border-custom3 rounded-md"
        />

        <button
          type="submit"
          className="bg-custom5 text-white p-2 mt-4 hover:bg-custom4 transition-all duration-300 rounded-md"
        >
          Envoyer
        </button>
      </form>

      <div className="text-center mt-8 text-custom5">
        <p className="text-lg">Contacts :</p>
        <br />
        greg.demirdjian@edu.ece.fr
        <br />
        marc.hamchouchong@edu.ece.fr
        <br />
        olivier.texier@edu.ece.fr
      </div>


    </div>
  );
}
