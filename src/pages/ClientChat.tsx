import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getOrders, addMessageToOrder, Order } from "@/lib/store";

export default function ClientChat() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [msg, setMsg] = useState("");
  const [nick, setNick] = useState("");
  const [nickSet, setNickSet] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const reload = () => {
    const orders = getOrders();
    const found = orders.find(o => o.id === orderId);
    setOrder(found || null);
  };

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [order?.messages]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080808" }}>
        <div className="text-center">
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, color: "white" }}>Заказ не найден</div>
          <button className="btn-outline mt-4" onClick={() => navigate("/")}>На главную</button>
        </div>
      </div>
    );
  }

  const sendMsg = () => {
    if (!msg.trim() || !nickSet) return;
    addMessageToOrder(order.id, { author: "client", authorName: nick || order.nickname, text: msg.trim() });
    setMsg("");
    reload();
  };

  const STATUS_COLORS: Record<Order["status"], string> = {
    new: "#00ff6e",
    in_progress: "#00cfff",
    done: "rgba(255,255,255,0.4)",
    cancelled: "#ff4444",
  };
  const STATUS_LABELS: Record<Order["status"], string> = {
    new: "Новый",
    in_progress: "В работе",
    done: "Выполнен",
    cancelled: "Отклонён",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080808", maxWidth: 680, margin: "0 auto" }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0d0d0d" }}>
        <button onClick={() => navigate("/")} style={{ color: "rgba(255,255,255,0.35)" }}>
          <Icon name="ArrowLeft" size={18} />
        </button>
        <div className="flex-1">
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 700, color: "white", textTransform: "uppercase" }}>
            {order.product}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[order.status] }} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{STATUS_LABELS[order.status]}</div>
          </div>
        </div>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: "2px", color: "rgba(255,255,255,0.3)" }}>
          PIXELCRAFT
        </div>
      </div>

      {/* Nick setup */}
      {!nickSet && (
        <div className="p-5 flex flex-col items-center justify-center flex-1">
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, color: "white", textTransform: "uppercase", marginBottom: 20 }}>
            Как тебя называть в чате?
          </div>
          <div className="w-full max-w-xs space-y-3">
            <input
              className="input-neon"
              placeholder={order.nickname}
              value={nick}
              onChange={e => setNick(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") setNickSet(true); }}
            />
            <button className="btn-neon w-full justify-center" style={{ padding: "12px" }}
              onClick={() => { if (!nick.trim()) setNick(order.nickname); setNickSet(true); }}>
              Войти в чат
            </button>
          </div>
        </div>
      )}

      {/* Chat */}
      {nickSet && (
        <>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {order.messages.length === 0 && (
              <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                Напиши сообщение — скинодел ответит здесь
              </div>
            )}
            {order.messages.map(m => (
              <div key={m.id} className={`flex ${m.author === "client" ? "justify-end" : "justify-start"}`}>
                <div style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  background: m.author === "client" ? "rgba(0,207,255,0.1)" : "rgba(0,255,110,0.08)",
                  border: m.author === "client" ? "1px solid rgba(0,207,255,0.2)" : "1px solid rgba(0,255,110,0.2)",
                }}>
                  <div style={{ fontSize: 11, color: m.author === "client" ? "#00cfff" : "var(--neon)", marginBottom: 3 }}>
                    {m.authorName}
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 3, textAlign: "right" }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 flex gap-3 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}>
            <input
              className="input-neon flex-1"
              placeholder="Сообщение..."
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMsg(); }}
            />
            <button className="btn-neon" style={{ padding: "10px 18px" }} onClick={sendMsg}>
              <Icon name="Send" size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
