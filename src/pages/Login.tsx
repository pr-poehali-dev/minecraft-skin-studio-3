import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { loginUser } from "@/lib/store";

export default function Login() {
  const navigate = useNavigate();
  const [nick, setNick] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = loginUser(nick.trim(), pass.trim());
      if (user) {
        navigate("/admin");
      } else {
        setError("Неверный ник или пароль");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#080808" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: "var(--neon)" }}>
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, fontWeight: 700, color: "#080808" }}>PC</span>
            </div>
          </div>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, letterSpacing: "4px", color: "white", textTransform: "uppercase" }}>
            PIXELCRAFT
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "2px" }}>ПАНЕЛЬ УПРАВЛЕНИЯ</div>
        </div>

        <div style={{ background: "#0d0d0d", border: "1px solid rgba(0,255,110,0.15)", padding: 32 }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "2px", marginBottom: 8, textTransform: "uppercase" }}>
                Ник
              </label>
              <input
                className="input-neon"
                placeholder="Введи ник"
                value={nick}
                onChange={e => { setNick(e.target.value); setError(""); }}
                autoComplete="username"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "2px", marginBottom: 8, textTransform: "uppercase" }}>
                Пароль
              </label>
              <input
                className="input-neon"
                type="password"
                placeholder="Введи пароль"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(""); }}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div style={{ fontSize: 13, color: "#ff4444", padding: "10px 14px", background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.2)" }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              className="btn-neon w-full justify-center"
              style={{ padding: "13px", marginTop: 8 }}
              disabled={loading}>
              {loading ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <>
                  <Icon name="LogIn" size={16} />
                  Войти
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => navigate("/")} style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
            className="nav-link">
            ← Вернуться на сайт
          </button>
        </div>
      </div>
    </div>
  );
}
