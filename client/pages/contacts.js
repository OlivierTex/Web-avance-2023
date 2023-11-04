export default function Contacts() {
  return (
    <div className={`bg-light dark:bg-dark`}>
      <h1 className="h1">Contacts</h1>

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
          type="submit"bg
          className="bouton-sumbit "
        >
          Envoyer
        </button>
      </form>

      <div className="paragraphe">
        <p className="paragraphe">Contacts :</p>
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
