import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const user = jwtDecode(credentialResponse.credential);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-2xl shadow-lg">

        <h1 className="text-4xl font-bold text-center mb-4">
          Task Tracker
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Manage your daily tasks efficiently
        </p>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />

      </div>

    </div>
  );
}

export default Login;