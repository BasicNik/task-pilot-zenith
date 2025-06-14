
import React, { useState } from "react";

interface Props {
  onLogin: () => void;
}
const MockAuth: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 600); // fake
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-card border rounded-xl shadow-lg px-8 py-10 animate-fade-in">
      <h2 className="font-bold text-2xl mb-5 text-center">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          autoFocus
          className="border px-4 py-2 rounded"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border px-4 py-2 rounded"
          type="password"
          placeholder="Password"
          required
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 mt-3 font-bold rounded hover-scale"
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <div className="text-center mt-3">
        <button
          className="underline text-muted-foreground text-sm"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "No account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default MockAuth;
