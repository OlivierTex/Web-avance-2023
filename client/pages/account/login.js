import { supabase } from "../../supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../components/AuthContext";

const Login = () => {
  const router = useRouter();
  const { user_session } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (user_session) {
        const { data, error } = await supabase
          .from("user")
          .select("type_compte")
          .eq("id", user_session.id);

        if (error) {
          console.error(
            "Erreur lors de la récupération des informations de l'utilisateur:",
            error,
          );
          return;
        }

        if (data.length > 0) {
          const user = data[0];
          if (user.type_compte === "user") {
            setTimeout(() => {
              router.push(`/account`);
            }, 500);
          } else if (user.type_compte === "admin") {
            setTimeout(() => {
              router.push(`/account/admin`);
            }, 500);
          }
        }
      }
    };
    fetchUser();
  }, [user_session]);

  if (!user_session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
          <div className="mt-8">
            <Auth
              supabaseClient={supabase}
              providers={["github"]}
              appearance={{
                theme: ThemeSupa,
              }}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion réussie
          </h2>
          <p className="text-center text-gray-600">
            Vous allez être redirigé dans un instant...
          </p>
        </div>
      </div>
    );
  }
};
export default Login;
