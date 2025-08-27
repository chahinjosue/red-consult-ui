import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    // Verificar si ya existe sesión activa
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Escuchar cambios de sesión (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-6">Cargando…</div>;

  // Si no hay sesión → mostrar login
  if (!session) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="rounded-2xl border bg-white p-6 w-full max-w-sm shadow">
          <div className="flex flex-col items-center mb-4">
            <img
              src="/logo-redconsult-vertical.png"
              alt="Red Consult"
              className="w-24 mb-2"
            />
            <div className="text-lg font-semibold">Iniciar sesión</div>
          </div>

          <input
            className="w-full border rounded-xl px-3 py-2 text-sm mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded-xl px-3 py-2 text-sm mb-3"
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            className="w-full rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password: pass,
              });
              if (error) alert(error.message);
            }}
          >
            Entrar
          </button>

          <button
            className="mt-2 w-full rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
            onClick={async () => {
              const { error } = await supabase.auth.signUp({
                email,
                password: pass,
              });
              if (error) alert(error.message);
              else alert("Revisa tu correo para confirmar la cuenta.");
            }}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    );
  }

  // Si hay sesión → renderiza el resto de la app
  return <>{children}</>;
}
