import { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);

    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });
    if (response.ok) {
      const responseBody = await response.json();
      const token = responseBody.token;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      navigate("/");
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Login failed.");
    }
  };

  const token = localStorage.getItem("token");

  if (token) {
    return (
      <WhiteCard>
        <h2 className="text-2xl font-bold pb-4 text-black text-center">You are already logged in!</h2>
        <p
          className="text-blue-500 text-md text-center hover:cursor-pointer p-1"
          onClick={() => navigate("/")}
        >
          Go to home page.
        </p>
      </WhiteCard>
    );
  }

  return (
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="py-4">
          <TextField
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className={error ? "pt-4" : "py-4"}>
          <TextField
            placeholder="Password"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <div className="min-h-5 pb-4">
            {<p className="text-red-500 text-sm">{`${error ? error : ""}`}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
      <div className="flex justify-center items-center pt-3">
        <div className="hover:cursor-pointer p-1">
          <p
            className="text-blue-500 text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password? click here!
          </p>
        </div>
      </div>
    </WhiteCard>
  );
}
