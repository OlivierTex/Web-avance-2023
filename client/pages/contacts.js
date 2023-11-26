import React from 'react';

export default function Contacts() {
  return (
    <div className="bg-light dark:bg-dark p-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Contacts</h1>

      <form className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-custom5 text-sm dark:text-white mb-2">
            Message :
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Saisissez votre message"
            className="form-input p-2 w-full bg-custom2 border-2 border-custom3 rounded-md"
          />
        </div>

        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md">
          Envoyer
        </button>
      </form>

      <div className="dark:text-white">
        <p className="text-lg font-semibold mb-2">Contacts :</p>
        <div className="mb-4">
          <p>Greg Demirdjian</p>
          <p>Email: greg.demirdjian@edu.ece.fr</p>
          <a href="https://www.linkedin.com/in/greg-demirdjian/" className="text-custom5 font-bold">LinkedIn</a>
        </div>

        <div className="mb-4">
          <p>Marc Hamchouchong</p>
          <p>Email: marc.hamchouchong@edu.ece.fr</p>
          <a href="https://www.linkedin.com/in/marc-hamchouchong/" className="text-custom5 font-bold">LinkedIn</a>
        </div>

        <div>
          <p>Olivier Texier</p>
          <p>Email: olivier.texier@edu.ece.fr</p>
          <a href="https://www.linkedin.com/in/olivier-texier-898828222/" className="text-custom5 font-bold">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}
