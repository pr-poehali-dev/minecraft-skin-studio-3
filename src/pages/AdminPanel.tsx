import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import {
  getOrders, updateOrderStatus, deleteOrder, addMessageToOrder,
  getStaff, addStaff, removeStaff, saveStaff,
  getReviews, approveReview, deleteReview,
  getGallery, addGalleryImage, deleteGalleryImage,
  getCurrentUser, logoutUser,
  Order, Staff, Review, GalleryImage,
} from "@/lib/store";

type Tab = "orders" | "archive" | "staff" | "reviews" | "gallery" | "team_chat";

const STATUS_LABELS: Record<Order["status"], string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Выполнен",
  cancelled: "Отклонён",
};
const STATUS_COLORS: Record<Order["status"], string> = {
  new: "#00ff6e",
  in_progress: "#00cfff",
  done: "rgba(255,255,255,0.4)",
  cancelled: "#ff4444",
};

interface TeamMsg {
  id: string;
  author: string;
  text: string;
  time: string;
}

function getTeamChat(): TeamMsg[] {
  try { return JSON.parse(localStorage.getItem("pc_team_chat") || "[]"); } catch { return []; }
}
function saveTeamChat(msgs: TeamMsg[]) {
  localStorage.setItem("pc_team_chat", JSON.stringify(msgs));
}

export default function AdminPanel() {
  const currentUser = getCurrentUser();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [teamChat, setTeamChat] = useState<TeamMsg[]>([]);

  // Active order chat
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const teamChatEndRef = useRef<HTMLDivElement>(null);

  // Staff form
  const [newStaffNick, setNewStaffNick] = useState("");
  const [newStaffPass, setNewStaffPass] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffWorks, setNewStaffWorks] = useState("");
  const [newStaffExp, setNewStaffExp] = useState("");

  // Gallery
  const [imgUrl, setImgUrl] = useState("");
  const [imgName, setImgName] = useState("");

  // Team chat
  const [teamMsg, setTeamMsg] = useState("");

  // Editing staff
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editWorks, setEditWorks] = useState("");
  const [editExp, setEditExp] = useState("");

  const reload = () => {
    setOrders(getOrders());
    setStaff(getStaff());
    setReviews(getReviews());
    setGallery(getGallery());
    setTeamChat(getTeamChat());
  };

  useEffect(() => { reload(); }, [tab]);
  useEffect(() => {
    if (chatOrderId) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatOrderId, orders]);
  useEffect(() => {
    if (tab === "team_chat") teamChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [teamChat, tab]);

  const activeOrders = orders.filter(o => o.status !== "done" && o.status !== "cancelled");
  const archiveOrders = orders.filter(o => o.status === "done" || o.status === "cancelled");
  const chatOrder = orders.find(o => o.id === chatOrderId);

  function sendOrderMsg() {
    if (!chatMsg.trim() || !chatOrderId || !currentUser) return;
    addMessageToOrder(chatOrderId, { author: "admin", authorName: currentUser.nickname, text: chatMsg.trim() });
    setChatMsg("");
    setOrders(getOrders());
  }

  function sendTeamMsg() {
    if (!teamMsg.trim() || !currentUser) return;
    const msgs = getTeamChat();
    msgs.push({ id: Date.now().toString(), author: currentUser.nickname, text: teamMsg.trim(), time: new Date().toLocaleString("ru-RU") });
    saveTeamChat(msgs);
    setTeamMsg("");
    setTeamChat(getTeamChat());
  }

  function handleGalleryFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      addGalleryImage({ url, name: file.name });
      setGallery(getGallery());
    };
    reader.readAsDataURL(file);
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "orders", label: "Заказы", icon: "ClipboardList" },
    { id: "archive", label: "Архив", icon: "Archive" },
    { id: "team_chat", label: "Чат состава", icon: "MessageSquare" },
    { id: "staff", label: "Сотрудники", icon: "Users" },
    { id: "reviews", label: "Отзывы", icon: "Star" },
    { id: "gallery", label: "Галерея", icon: "Image" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#080808", fontFamily: "'Golos Text', sans-serif" }}>
      {/* Sidebar + content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-56 flex-shrink-0" style={{ background: "#0d0d0d", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, letterSpacing: "3px", color: "var(--neon)", textTransform: "uppercase" }}>
              PIXELCRAFT
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Панель управления</div>
          </div>
          <div className="flex flex-col gap-1 p-3 flex-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setChatOrderId(null); }}
                className="flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                style={{
                  background: tab === t.id ? "rgba(0,255,110,0.08)" : "transparent",
                  borderLeft: tab === t.id ? "2px solid var(--neon)" : "2px solid transparent",
                  color: tab === t.id ? "var(--neon)" : "rgba(255,255,255,0.5)",
                  fontSize: 13,
                }}>
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
              {currentUser?.nickname} {currentUser?.isOwner && <span style={{ color: "var(--neon)" }}>👑</span>}
            </div>
            <button className="btn-outline text-xs w-full justify-center" style={{ padding: "7px 12px" }}
              onClick={() => { logoutUser(); window.location.href = "/"; }}>
              <Icon name="LogOut" size={13} />
              Выйти
            </button>
          </div>
        </div>

        {/* Mobile top nav */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex gap-1 overflow-x-auto px-2 py-2"
          style={{ background: "#0d0d0d", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setChatOrderId(null); }}
              className="flex-shrink-0 px-3 py-1.5 text-xs transition-all"
              style={{
                background: tab === t.id ? "rgba(0,255,110,0.12)" : "transparent",
                color: tab === t.id ? "var(--neon)" : "rgba(255,255,255,0.4)",
                border: tab === t.id ? "1px solid rgba(0,255,110,0.3)" : "1px solid transparent",
                fontFamily: "Oswald, sans-serif",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}>
              {t.label}
            </button>
          ))}
          <button className="flex-shrink-0 ml-auto px-3 py-1.5 text-xs"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onClick={() => { logoutUser(); window.location.href = "/"; }}>
            <Icon name="LogOut" size={14} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto md:pt-0 pt-12">

          {/* ORDERS */}
          {(tab === "orders" || tab === "archive") && !chatOrderId && (
            <div className="p-5 md:p-8">
              <div className="mb-6">
                <div className="section-label mb-1">{tab === "orders" ? "// Активные заказы" : "// Архив"}</div>
                <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", color: "white" }}>
                  {tab === "orders" ? "Заказы" : "Архив заказов"}
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {(tab === "orders" ? activeOrders : archiveOrders).length === 0 && (
                  <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
                    Пусто
                  </div>
                )}
                {(tab === "orders" ? activeOrders : archiveOrders).map(order => (
                  <div key={order.id} className="skin-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 700, color: "white", textTransform: "uppercase" }}>
                            {order.nickname}
                          </span>
                          <span className="tag" style={{ fontSize: 10, color: STATUS_COLORS[order.status], borderColor: STATUS_COLORS[order.status] }}>
                            {STATUS_LABELS[order.status]}
                          </span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{order.createdAt}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "var(--neon)", marginBottom: 4 }}>{order.product}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }} className="line-clamp-2">{order.description}</div>
                        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {order.tg && <span>✈️ {order.tg}</span>}
                          {order.ds && <span>🎮 {order.ds}</span>}
                          {order.vk && <span>💬 {order.vk}</span>}
                          <span>⏱ {order.deadline}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tab === "orders" && (
                          <>
                            <select
                              value={order.status}
                              onChange={e => { updateOrderStatus(order.id, e.target.value as Order["status"]); setOrders(getOrders()); }}
                              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "6px 10px", fontSize: 12, fontFamily: "Golos Text, sans-serif" }}>
                              <option value="new">Новый</option>
                              <option value="in_progress">В работе</option>
                              <option value="done">Выполнен</option>
                              <option value="cancelled">Отклонить</option>
                            </select>
                            <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }}
                              onClick={() => setChatOrderId(order.id)}>
                              <Icon name="MessageSquare" size={13} />
                              Чат
                            </button>
                          </>
                        )}
                        <button style={{ padding: "6px 12px", background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.3)", color: "#ff4444", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
                          onClick={() => { deleteOrder(order.id); setOrders(getOrders()); }}>
                          <Icon name="Trash2" size={13} />
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDER CHAT */}
          {chatOrderId && chatOrder && (
            <div className="flex flex-col h-full md:h-screen">
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}>
                <button onClick={() => setChatOrderId(null)} style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Icon name="ArrowLeft" size={20} />
                </button>
                <div>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 700, color: "white", textTransform: "uppercase" }}>
                    {chatOrder.nickname}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{chatOrder.product}</div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                {chatOrder.messages.length === 0 && (
                  <div className="text-center py-10" style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                    Нет сообщений. Начните диалог с заказчиком.
                  </div>
                )}
                {chatOrder.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.author === "admin" ? "justify-end" : "justify-start"}`}>
                    <div style={{
                      maxWidth: "75%",
                      padding: "10px 14px",
                      background: msg.author === "admin" ? "rgba(0,255,110,0.12)" : "rgba(255,255,255,0.05)",
                      border: msg.author === "admin" ? "1px solid rgba(0,255,110,0.25)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 2,
                    }}>
                      <div style={{ fontSize: 11, color: msg.author === "admin" ? "var(--neon)" : "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                        {msg.authorName}
                      </div>
                      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{msg.text}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 flex gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}>
                <input
                  className="input-neon flex-1"
                  placeholder="Сообщение..."
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendOrderMsg(); }}
                />
                <button className="btn-neon" style={{ padding: "10px 18px" }} onClick={sendOrderMsg}>
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TEAM CHAT */}
          {tab === "team_chat" && (
            <div className="flex flex-col" style={{ height: "calc(100vh - 48px)" }}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="section-label mb-1">// Внутренний</div>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: "white" }}>Чат состава</div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                {teamChat.length === 0 && (
                  <div className="text-center py-10" style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                    Начните общение с командой
                  </div>
                )}
                {teamChat.map(msg => (
                  <div key={msg.id} className={`flex ${msg.author === currentUser?.nickname ? "justify-end" : "justify-start"}`}>
                    <div style={{
                      maxWidth: "75%",
                      padding: "10px 14px",
                      background: msg.author === currentUser?.nickname ? "rgba(0,255,110,0.1)" : "rgba(255,255,255,0.04)",
                      border: msg.author === currentUser?.nickname ? "1px solid rgba(0,255,110,0.2)" : "1px solid rgba(255,255,255,0.07)",
                    }}>
                      <div style={{ fontSize: 11, color: "var(--neon)", marginBottom: 3 }}>{msg.author}</div>
                      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{msg.text}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 3, textAlign: "right" }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={teamChatEndRef} />
              </div>
              <div className="p-4 flex gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}>
                <input
                  className="input-neon flex-1"
                  placeholder="Сообщение команде..."
                  value={teamMsg}
                  onChange={e => setTeamMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendTeamMsg(); }}
                />
                <button className="btn-neon" style={{ padding: "10px 18px" }} onClick={sendTeamMsg}>
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STAFF */}
          {tab === "staff" && (
            <div className="p-5 md:p-8">
              <div className="mb-6">
                <div className="section-label mb-1">// Команда</div>
                <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", color: "white" }}>Сотрудники</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {staff.map(member => (
                  <div key={member.id} className="skin-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 17, fontWeight: 700, color: "white", textTransform: "uppercase" }}>
                            {member.nickname}
                          </span>
                          {member.isOwner && <span style={{ color: "var(--neon)", fontSize: 14 }}>👑</span>}
                        </div>
                        {editStaffId === member.id ? (
                          <div className="mt-3 space-y-2">
                            <input className="input-neon" style={{ padding: "8px 12px", fontSize: 13 }} placeholder="Роль" value={editRole} onChange={e => setEditRole(e.target.value)} />
                            <input className="input-neon" style={{ padding: "8px 12px", fontSize: 13 }} placeholder="Работ" value={editWorks} onChange={e => setEditWorks(e.target.value)} />
                            <input className="input-neon" style={{ padding: "8px 12px", fontSize: 13 }} placeholder="Опыт" value={editExp} onChange={e => setEditExp(e.target.value)} />
                            <div className="flex gap-2">
                              <button className="btn-neon" style={{ padding: "6px 14px", fontSize: 12 }}
                                onClick={() => {
                                  const s = getStaff();
                                  const idx = s.findIndex(x => x.id === member.id);
                                  if (idx !== -1) {
                                    s[idx].role = editRole || s[idx].role;
                                    s[idx].works = parseInt(editWorks) || s[idx].works;
                                    s[idx].experience = editExp || s[idx].experience;
                                    saveStaff(s); setStaff(getStaff()); setEditStaffId(null);
                                  }
                                }}>
                                Сохранить
                              </button>
                              <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => setEditStaffId(null)}>Отмена</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: 13, color: "var(--neon)", marginBottom: 6 }}>{member.role}</div>
                            <div className="flex gap-4 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                              <span>{member.works} работ</span>
                              <span>{member.experience}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {!member.isOwner && !editStaffId && (
                        <div className="flex gap-2">
                          <button style={{ padding: "5px 10px", background: "rgba(0,207,255,0.07)", border: "1px solid rgba(0,207,255,0.2)", color: "#00cfff", fontSize: 12 }}
                            onClick={() => { setEditStaffId(member.id); setEditRole(member.role); setEditWorks(String(member.works)); setEditExp(member.experience); }}>
                            <Icon name="Edit2" size={13} />
                          </button>
                          {currentUser?.isOwner && (
                            <button style={{ padding: "5px 10px", background: "rgba(255,60,60,0.07)", border: "1px solid rgba(255,60,60,0.25)", color: "#ff4444", fontSize: 12 }}
                              onClick={() => { removeStaff(member.id); setStaff(getStaff()); }}>
                              <Icon name="Trash2" size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {currentUser?.isOwner && (
                <div className="neon-border p-6" style={{ background: "rgba(0,255,110,0.03)" }}>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, letterSpacing: "2px", color: "var(--neon)", textTransform: "uppercase", marginBottom: 16 }}>
                    + Добавить сотрудника
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <input className="input-neon" placeholder="Ник *" value={newStaffNick} onChange={e => setNewStaffNick(e.target.value)} />
                    <input className="input-neon" placeholder="Пароль *" type="password" value={newStaffPass} onChange={e => setNewStaffPass(e.target.value)} />
                    <input className="input-neon" placeholder="Роль (напр. Скинодел)" value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)} />
                    <input className="input-neon" placeholder="Кол-во работ" value={newStaffWorks} onChange={e => setNewStaffWorks(e.target.value)} />
                    <input className="input-neon sm:col-span-2" placeholder="Опыт (напр. 6 месяцев)" value={newStaffExp} onChange={e => setNewStaffExp(e.target.value)} />
                  </div>
                  <button className="btn-neon" style={{ padding: "10px 28px" }}
                    onClick={() => {
                      if (!newStaffNick || !newStaffPass) return;
                      addStaff({ nickname: newStaffNick, password: newStaffPass, role: newStaffRole || "Скинодел", works: parseInt(newStaffWorks) || 0, experience: newStaffExp || "—" });
                      setNewStaffNick(""); setNewStaffPass(""); setNewStaffRole(""); setNewStaffWorks(""); setNewStaffExp("");
                      setStaff(getStaff());
                    }}>
                    <Icon name="UserPlus" size={15} />
                    Добавить
                  </button>
                </div>
              )}
            </div>
          )}

          {/* REVIEWS */}
          {tab === "reviews" && (
            <div className="p-5 md:p-8">
              <div className="mb-6">
                <div className="section-label mb-1">// Модерация</div>
                <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", color: "white" }}>Отзывы</h2>
              </div>
              {reviews.length === 0 && (
                <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>Нет отзывов</div>
              )}
              <div className="flex flex-col gap-3">
                {reviews.map(r => (
                  <div key={r.id} className="skin-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, color: "white" }}>{r.nickname}</span>
                          <span className="tag" style={{ fontSize: 9, color: r.approved ? "var(--neon)" : "#ff9900", borderColor: r.approved ? "rgba(0,255,110,0.3)" : "rgba(255,153,0,0.3)" }}>
                            {r.approved ? "Опубликован" : "На модерации"}
                          </span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{r.createdAt}</span>
                        </div>
                        <div className="flex mb-2">
                          {Array.from({ length: r.rating }).map((_, i) => <Icon key={i} name="Star" size={12} color="var(--neon)" />)}
                        </div>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{r.text}</p>
                      </div>
                      <div className="flex gap-2">
                        {!r.approved && (
                          <button style={{ padding: "6px 12px", background: "rgba(0,255,110,0.08)", border: "1px solid rgba(0,255,110,0.25)", color: "var(--neon)", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}
                            onClick={() => { approveReview(r.id); setReviews(getReviews()); }}>
                            <Icon name="Check" size={13} />
                          </button>
                        )}
                        <button style={{ padding: "6px 12px", background: "rgba(255,60,60,0.07)", border: "1px solid rgba(255,60,60,0.2)", color: "#ff4444", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}
                          onClick={() => { deleteReview(r.id); setReviews(getReviews()); }}>
                          <Icon name="Trash2" size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY */}
          {tab === "gallery" && (
            <div className="p-5 md:p-8">
              <div className="mb-6">
                <div className="section-label mb-1">// Медиа</div>
                <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", color: "white" }}>Галерея</h2>
              </div>

              {/* Upload */}
              <div className="neon-border p-6 mb-8" style={{ background: "rgba(0,255,110,0.03)" }}>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: "2px", color: "var(--neon)", textTransform: "uppercase", marginBottom: 14 }}>
                  Загрузить фото
                </div>
                <label className="btn-outline flex items-center gap-2 w-fit cursor-pointer" style={{ padding: "10px 20px" }}>
                  <Icon name="Upload" size={15} />
                  Выбрать файл
                  <input type="file" accept="image/*" className="hidden" onChange={handleGalleryFile} />
                </label>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 10 }}>PNG, JPG, GIF — до 5MB</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {gallery.map(img => (
                  <div key={img.id} className="relative group skin-card overflow-hidden">
                    <img src={img.url} alt={img.name} className="w-full object-cover" style={{ aspectRatio: "1/1" }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.6)" }}>
                      <button style={{ padding: "8px", background: "rgba(255,60,60,0.2)", border: "1px solid rgba(255,60,60,0.4)", color: "#ff4444" }}
                        onClick={() => { deleteGalleryImage(img.id); setGallery(getGallery()); }}>
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                    <div className="p-2" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {img.name}
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-full text-center py-16" style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                    Нет изображений
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
