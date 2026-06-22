import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const user = jwtDecode(credentialResponse.credential);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="glass-card p-10 rounded-3xl max-w-md w-full mx-4 relative z-10 animate-in">
        <div className="text-center mb-8">
          <h1 className="text-headline-xl font-bold text-primary mb-2">Task Tracker</h1>
          <p className="text-on-surface-variant text-body-md">Manage your daily tasks efficiently</p>
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
            theme="filled_black"
            shape="pill"
            size="large"
            text="signin_with"
          />
        </div>
        <p className="text-center text-on-surface-variant text-label-sm mt-8 opacity-50">
          Task Tracker v2.0 &bull; Built for Clarity & Focus
        </p>
      </div>
    </div>
  );
}

export default Login;
