import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "./AuthContext";

function Dashboard() {
  const { user_session } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [initialUsername, setInitialUsername] = useState(username);
  const [initialEmail, setInitialEmail] = useState(email);
  const [initialBio, setInitialBio] = useState(bio);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user_session) {
        const { data: users, error } = await supabase
          .from("user")
          .select("username, email, bio")
          .eq("id", user_session.id);

        if (error) {
          console.error(error);
        } else if (users.length > 0) {
          setUsername(users[0].username);
          setEmail(users[0].email);
          setBio(users[0].bio);

          setInitialUsername(users[0].username);
          setInitialEmail(users[0].email);
          setInitialBio(users[0].bio);
        }
      }
    };

    fetchUserData();

  }, [user_session]);

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    // Mise à jour des paramètres utilisateurs | un update du type_compte (admin/user) par un user déclenchera un trigger qui refusera la requête
    const { error } = await supabase
      .from("user")
      .update({
        username: username,
        email: email,
        bio: bio,
      })
      .eq("id", user_session.id);

    if (error) {
      console.error(error);
    } else {
      console.log("User settings updated successfully");
      setInitialUsername(username);
      setInitialEmail(email);
      setInitialBio(bio);
    }
  };

  return (
    <div className="flex justify-start space-y-4 w-3/5 bg-gray-400 p-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Paramètres du compte</h2>
        <div className="grid grid-cols-2 gap-4 items-start">
          <label htmlFor="username" className="block text-right">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 border rounded ${
              username == initialUsername ? "bg-gray-300" : ""
            }`}
          />
          <label htmlFor="email" className="block text-right">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded ${
              email == initialEmail ? "bg-gray-300" : ""
            }`}
          />
          <label htmlFor="bio" className="block text-right">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`w-full p-2 border rounded h-12 max-h-64 min-h-12 ${
              bio == initialBio ? "bg-gray-300" : ""
            }`}
          />
        </div>
        <button
          onClick={handleSaveChanges}
          className={`px-4 py-2 rounded float-right text-white ${
            username === initialUsername &&
            email === initialEmail &&
            bio === initialBio
              ? "bg-gray-500"
              : "bg-green-600"
          }`}
          disabled={
            username === initialUsername &&
            email === initialEmail &&
            bio === initialBio
          }
        >
          {" "}
          Enregistrer{" "}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
