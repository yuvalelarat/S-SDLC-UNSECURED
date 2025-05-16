import React, { useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password, email }),
    });
    if (response.ok) {
      navigate("/login");
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Registration failed.");
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
      <h2 className="text-2xl font-bold pb-4 text-black">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="py-4">
          <TextField
            placeholder="Email"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="py-4">
          <TextField
            placeholder="Username"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
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
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
    </WhiteCard>
  );
}
