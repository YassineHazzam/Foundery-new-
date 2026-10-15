"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnexionPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/");
  }

  return (
    <main id="main" className="wrap wrap--narrow section">
      <h1>Connexion</h1>
      <form action={handleSubmit} style={{ maxWidth: 360, marginTop: 20 }}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" name="password" type="password" required />
        </div>
        {error && <p style={{ color: "var(--red-700)", fontSize: ".88rem" }}>{error}</p>}
        <button type="submit" className="btn btn--primary btn--block">Se connecter</button>
      </form>
    </main>
  );
}
