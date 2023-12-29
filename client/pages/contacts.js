import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/router";
import supabase from "../supabase";

export default function Contacts() {
  const { user_session } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");

  const ajouter_commentaire = async (comment) => {
    try {
      if (!user_session) {
        console.error("User not logged in");
        router.push("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("username")
        .eq("id", user_session.id)
        .single();

      if (userError) {
        throw userError;
      }

      const username = userData?.username;

      const { data, error } = await supabase.from("commentaire_admin").insert([
        {
          commentaire: comment,
          id_user: user_session.id,
          username: username,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Comment added successfully:", data);
      window.location.reload();
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ajouter_commentaire(message);
    setMessage("");
  };

  return (
    <div className="mx-auto w-4/5">
      <div className="bg-light dark:bg-dark p-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Contacts</h1>
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="mb-3 dark:text-white m-4">
              Vous pouvez nous laisser un commentaire, une suggestion ou un avis
              sur notre site web. Nous vous répondrons dans les plus brefs
              délais grace à votre adresse mail. Merci de votre aide !
            </p>
            <input
              type="text"
              id="name"
              name="name"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Saisissez votre commentaire"
              className="form-input p-2 w-full bg-custom2 border-2 border-custom3 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            Envoyer
          </button>
        </form>

        <div className="dark:text-white">
          <p className="text-lg font-semibold mb-2">Contacts :</p>
          <div className="mb-4">
            <p>Greg Demirdjian</p>
            <p>Email: greg.demirdjian@edu.ece.fr</p>
            <a
              href="https://www.linkedin.com/in/greg-demirdjian/"
              className="text-custom5 font-bold"
            >
              LinkedIn
            </a>
          </div>

          <div className="mb-4">
            <p>Marc Hamchouchong</p>
            <p>Email: marc.hamchouchong@edu.ece.fr</p>
            <a
              href="https://www.linkedin.com/in/marc-hamchouchong/"
              className="text-custom5 font-bold"
            >
              LinkedIn
            </a>
          </div>

          <div>
            <p>Olivier Texier</p>
            <p>Email: olivier.texier@edu.ece.fr</p>
            <a
              href="https://www.linkedin.com/in/olivier-texier-898828222/"
              className="text-custom5 font-bold"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
