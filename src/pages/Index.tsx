import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { addOrder, getReviews, addReview, getClientsCount, getStaff, getGallery, getProducts, Review, Product } from "@/lib/store";

const STUDIO_NAME = "PIXELCRAFT";
const STUDIO_ABBR = "PC";
const skinImage = "https://cdn.poehali.dev/projects/e61d7d76-87d1-48b7-9f55-e6f70491382c/files/8bb3251d-0466-4689-9d3d-204d889f0d81.jpg";

const DEADLINES = ["1–2 дня", "3–5 дней", "Неделя", "Без срока"];

interface OrderForm {
  nickname: string; product: string; description: string;
  deadline: string; tg: string; ds: string; vk: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderDone, setOrderDone] = useState<string | null>(null);
  const [form, setForm] = useState<OrderForm>({ nickname: "", product: PRODUCTS[0], description: "", deadline: DEADLINES[0], tg: "", ds: "", vk: "" });

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewNick, setReviewNick] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Staff, gallery, products
  const [staff, setStaff] = useState(getStaff());
  const [gallery, setGallery] = useState(getGallery());
  const [clientsCount] = useState(getClientsCount());
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setReviews(getReviews().filter(r => r.approved));
    setStaff(getStaff());
    setGallery(getGallery());
    const prods = getProducts();
    setProducts(prods);
    if (prods.length > 0) {
      setForm(f => ({ ...f, product: `${prods[0].title} — ${prods[0].price}` }));
    }
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const sections = ["hero", "services", "about", "reviews"];
    const observers: IntersectionObserver[] = [];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(id); }, { threshold: 0.3 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = orderOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [orderOpen]);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = addOrder(form);
    setOrderDone(order.id);
    const firstProduct = products.length > 0 ? `${products[0].title} — ${products[0].price}` : "";
    setForm({ nickname: "", product: firstProduct, description: "", deadline: DEADLINES[0], tg: "", ds: "", vk: "" });
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    const fakeIp = "user_" + Math.random().toString(36).slice(2, 8);
    const result = addReview({ nickname: reviewNick, text: reviewText, rating: reviewRating }, fakeIp);
    if (!result) {
      setReviewError("Ты уже оставлял отзыв сегодня. Попробуй завтра.");
      return;
    }
    setReviewSent(true);
    setReviewNick(""); setReviewText(""); setReviewRating(5);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d0d 40%, #0a0f0a 100%)" }}>
      <div className="scanline" />
      {/* subtle grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,255,110,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,110,0.018) 1px, transparent 1px)",
        backgroundSize: "80px 80px"
      }} />

      {/* ORDER MODAL */}
      {orderOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(2,2,2,0.93)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setOrderOpen(false); }}>
          <div className="w-full max-w-lg" style={{ background: "#0d0d0d", border: "1px solid rgba(0,255,110,0.2)", boxShadow: "0 0 80px rgba(0,255,110,0.07)" }}>
            <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div className="section-label text-xs mb-1">// Оформление</div>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: "white" }}>Заказать скин</div>
              </div>
              <button onClick={() => setOrderOpen(false)} style={{ color: "rgba(255,255,255,0.35)" }}>
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="px-7 py-6 max-h-[76vh] overflow-y-auto">
              {orderDone ? (
                <div className="py-8 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 flex items-center justify-center" style={{ border: "2px solid var(--neon)" }}>
                    <Icon name="Check" size={28} color="var(--neon)" />
                  </div>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, color: "white", textTransform: "uppercase" }}>
                    Заявка принята!
                  </div>
                  <p className="text-white/45 text-sm max-w-xs">
                    Скинодел свяжется с тобой скоро. Следи за статусом заказа в чате:
                  </p>
                  <button className="btn-neon mt-2" onClick={() => { navigate(`/chat/${orderDone}`); setOrderOpen(false); setOrderDone(null); }}>
                    <Icon name="MessageSquare" size={15} />
                    Открыть чат заказа
                  </button>
                  <button className="btn-outline" style={{ padding: "9px 24px" }} onClick={() => { setOrderOpen(false); setOrderDone(null); }}>
                    Закрыть
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrder} className="space-y-5">
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Ник / Имя *</label>
                    <input className="input-neon" placeholder="Твой ник или имя" required value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Выбор товара *</label>
                    <div className="flex flex-col gap-2">
                      {products.map(p => {
                        const label = `${p.title} — ${p.price}`;
                        return (
                          <button type="button" key={p.id} className={`option-btn text-left ${form.product === label ? "active" : ""}`} onClick={() => setForm({ ...form, product: label })}>{label}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Описание *</label>
                    <textarea className="input-neon resize-none" style={{ minHeight: 90 }} placeholder="Опиши что хочешь: цвета, стиль, детали..." required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Сроки</label>
                    <div className="flex flex-wrap gap-2">
                      {DEADLINES.map(d => (
                        <button type="button" key={d} className={`option-btn ${form.deadline === d ? "active" : ""}`} onClick={() => setForm({ ...form, deadline: d })}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Контакты (хотя бы один)</div>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-center"><span style={{ fontSize: 16 }}>✈️</span><input className="input-neon" placeholder="Telegram: @username" value={form.tg} onChange={e => setForm({ ...form, tg: e.target.value })} /></div>
                      <div className="flex gap-3 items-center"><span style={{ fontSize: 16 }}>🎮</span><input className="input-neon" placeholder="Discord: @username" value={form.ds} onChange={e => setForm({ ...form, ds: e.target.value })} /></div>
                      <div className="flex gap-3 items-center"><span style={{ fontSize: 16 }}>💬</span><input className="input-neon" placeholder="ВКонтакте: @id" value={form.vk} onChange={e => setForm({ ...form, vk: e.target.value })} /></div>
                    </div>
                  </div>
                  <button type="submit" className="btn-neon w-full justify-center" style={{ padding: "14px" }}>
                    <Icon name="Send" size={16} />
                    Отправить заявку
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-12 py-4"
        style={{ background: "rgba(8,8,8,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: "var(--neon)" }}>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, fontWeight: 700, color: "#080808" }}>{STUDIO_ABBR}</span>
          </div>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, letterSpacing: "3px", color: "white", textTransform: "uppercase" }}>{STUDIO_NAME}</span>
        </button>
        <div className="hidden md:flex items-center gap-8">
          {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className={`nav-link ${activeSection === id ? "!text-[var(--neon)]" : ""}`}>{label}</button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="btn-outline text-xs" style={{ padding: "8px 16px" }} onClick={() => navigate("/login")}>
            <Icon name="Lock" size={13} />
            Панель
          </button>
          <button className="btn-neon text-sm" style={{ padding: "9px 22px" }} onClick={() => { setOrderDone(null); setOrderOpen(true); }}>
            Заказать скин
          </button>
        </div>
        <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7" style={{ background: "rgba(6,6,6,0.99)" }}>
          {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="nav-link" style={{ fontSize: 26, letterSpacing: "4px" }}>{label}</button>
          ))}
          <button className="btn-neon mt-4" onClick={() => { setMenuOpen(false); setOrderDone(null); setOrderOpen(true); }}>Заказать скин</button>
          <button className="nav-link text-sm" onClick={() => { setMenuOpen(false); navigate("/login"); }}>Панель</button>
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end pb-16 pt-28 px-5 md:px-12 lg:px-20 overflow-hidden">
        {/* Bg layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(0,255,110,0.04) 0%, transparent 70%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 20% 30%, rgba(0,80,30,0.06) 0%, transparent 60%)" }} />
        </div>

        {/* Floating image */}
        <div className="absolute right-0 lg:right-8 xl:right-16 top-1/2 -translate-y-1/2 z-10 hidden lg:block animate-float">
          <div className="relative" style={{ width: 420 }}>
            <img src={skinImage} alt="Скин" className="w-full object-cover"
              style={{ aspectRatio: "1/1", filter: "brightness(1.05) contrast(1.1) saturate(0.95)", border: "1px solid rgba(0,255,110,0.15)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,255,110,0.06) 0%, transparent 55%)" }} />
            <div className="absolute top-4 right-4 tag">DEMO</div>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="animate-fade-up delay-100 mb-5">
            <span className="section-label">// Студия кастомных скинов · с 2026</span>
          </div>
          <h1 className="hero-title text-white animate-fade-up delay-200 mb-6">
            <span className="glitch" data-text="ТВОЙ">ТВОЙ</span><br />
            <span style={{ color: "var(--neon)" }}>УНИКАЛЬНЫЙ</span><br />
            СКИН
          </h1>
          <p className="animate-fade-up delay-300 text-white/45 text-base md:text-lg mb-8 max-w-md leading-relaxed">
            Кастомные скины для любых игр. Доступные цены, быстро, с душой. Работаем с 2026 года.
          </p>
          <div className="animate-fade-up delay-400 flex flex-wrap gap-3">
            <button className="btn-neon" onClick={() => { setOrderDone(null); setOrderOpen(true); }}>
              <Icon name="ArrowRight" size={16} />Заказать скин
            </button>
            <button className="btn-outline" onClick={() => scrollTo("services")}>
              <Icon name="Grid" size={16} />Услуги
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-12 flex flex-wrap gap-8 md:gap-14">
          {[
            [String(clientsCount) + "+", "Клиентов"],
            ["100%", "Довольных"],
            ["2026", "Год основания"],
          ].map(([num, label]) => (
            <div key={num} className="animate-fade-in delay-500">
              <div className="stat-number">{num}</div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, letterSpacing: "2px", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-1 opacity-25">
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 9, letterSpacing: "3px", color: "white" }}>SCROLL</div>
            <Icon name="ChevronDown" size={14} color="white" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 md:py-24 px-5 md:px-12 lg:px-20">
        <div className="mb-12 md:mb-14">
          <div className="section-label mb-4">// 01 — Услуги</div>
          <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>
            ЧТО МЫ <span style={{ color: "var(--neon)" }}>ДЕЛАЕМ</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((s) => (
            <div key={s.id} className="skin-card p-6 md:p-8 flex flex-col">
              {s.tag ? <div className="tag mb-5">{s.tag}</div> : <div className="mb-5 h-[26px]" />}
              <div className="mb-5 w-11 h-11 flex items-center justify-center neon-border flex-shrink-0">
                <Icon name={s.icon} size={20} color="var(--neon)" />
              </div>
              <h3 style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed flex-1 mb-5">{s.desc}</p>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 24, fontWeight: 700, color: "var(--neon)" }}>{s.price}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button className="btn-neon" onClick={() => { setOrderDone(null); setOrderOpen(true); }}>
            <Icon name="ShoppingCart" size={17} />Оформить заказ
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-24 px-5 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="section-label mb-4">// 02 — О студии</div>
            <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05, marginBottom: 20 }}>
              МЫ СОЗДАЁМ <span style={{ color: "var(--neon)" }}>ИСКУССТВО</span> ДЛЯ ИГРОКОВ
            </h2>
            <p className="text-white/50 leading-relaxed mb-4 text-sm md:text-base">
              <span style={{ fontFamily: "Oswald, sans-serif" }}>{STUDIO_NAME}</span> — студия кастомных скинов, основанная в 2026 году. Мы понимаем, что скин — это не просто текстура, это твоя идентичность в игре.
            </p>
            <p className="text-white/50 leading-relaxed mb-8 text-sm md:text-base">
              Каждый заказ прорабатываем индивидуально: изучаем пожелания, создаём концепт и делаем то, что выделит тебя из толпы. Доступные цены — без потери качества.
            </p>

            {/* Staff list */}
            <div className="space-y-3">
              {staff.map(member => (
                <div key={member.id} className="neon-border p-4" style={{ background: "rgba(0,255,110,0.02)" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,255,110,0.08)", border: "1px solid rgba(0,255,110,0.2)" }}>
                      <Icon name="User" size={20} color="var(--neon)" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "white" }}>{member.nickname}</span>
                        {member.isOwner && <span style={{ fontSize: 14 }}>👑</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--neon)", marginTop: 2 }}>{member.role}</div>
                      <div className="flex gap-3 mt-1">
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{member.works} работ</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{member.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden" style={{ border: "1px solid rgba(0,255,110,0.1)" }}>
              <img src={skinImage} alt="О студии" className="w-full object-cover"
                style={{ aspectRatio: "4/3", filter: "brightness(0.75) contrast(1.1) saturate(0.8)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)" }} />
            </div>
            {/* Gallery preview */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {gallery.slice(0, 6).map(img => (
                  <img key={img.id} src={img.url} alt={img.name} className="w-full object-cover"
                    style={{ aspectRatio: "1/1", filter: "brightness(0.85)", border: "1px solid rgba(255,255,255,0.07)" }} />
                ))}
              </div>
            )}
            <div className="absolute -left-3 md:-left-5 top-6 neon-border p-3 md:p-4" style={{ background: "rgba(8,8,8,0.97)" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 24, fontWeight: 700, color: "var(--neon)", lineHeight: 1 }}>2026</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>основана</div>
            </div>
            <div className="absolute -right-3 md:-right-5 bottom-6 neon-border p-3 md:p-4" style={{ background: "rgba(8,8,8,0.97)" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 24, fontWeight: 700, color: "var(--neon)", lineHeight: 1 }}>{clientsCount}+</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>клиентов</div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 md:py-24 px-5 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mb-12 md:mb-14">
          <div className="section-label mb-4">// 03 — Отзывы</div>
          <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>
            ЧТО ГОВОРЯТ <span style={{ color: "var(--neon)" }}>КЛИЕНТЫ</span>
          </h2>
        </div>

        {/* Reviews grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 mb-10" style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
            Отзывов пока нет. Будь первым!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="quote-mark">"</div>
                <div className="flex mb-3 mt-1">
                  {Array.from({ length: r.rating }).map((_, i) => <Icon key={i} name="Star" size={13} color="var(--neon)" />)}
                </div>
                <p className="text-white/65 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{r.nickname}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{r.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review form */}
        <div className="max-w-xl mx-auto">
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: "3px", color: "var(--neon)", textTransform: "uppercase", marginBottom: 20 }}>
            // Оставить отзыв
          </div>
          {reviewSent ? (
            <div className="neon-border p-6 text-center" style={{ background: "rgba(0,255,110,0.04)" }}>
              <Icon name="CheckCircle" size={28} color="var(--neon)" />
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, color: "white", marginTop: 12 }}>Спасибо за отзыв!</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>Он будет опубликован после проверки.</div>
              <button className="btn-outline mt-6" style={{ padding: "8px 22px" }} onClick={() => setReviewSent(false)}>Написать ещё</button>
            </div>
          ) : (
            <form onSubmit={handleReview} className="space-y-4">
              <input className="input-neon" placeholder="Твой ник *" required value={reviewNick} onChange={e => setReviewNick(e.target.value)} />
              {/* Rating */}
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Оценка</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button type="button" key={n} onClick={() => setReviewRating(n)}>
                      <Icon name="Star" size={22} color={n <= reviewRating ? "var(--neon)" : "rgba(255,255,255,0.15)"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea className="input-neon resize-none" style={{ minHeight: 100 }} placeholder="Твой отзыв *" required value={reviewText} onChange={e => setReviewText(e.target.value)} />
              {reviewError && <div style={{ fontSize: 13, color: "#ff4444", padding: "10px 14px", background: "rgba(255,60,60,0.07)", border: "1px solid rgba(255,60,60,0.2)" }}>{reviewError}</div>}
              <button type="submit" className="btn-neon w-full justify-center" style={{ padding: "13px" }}>
                <Icon name="Send" size={15} />
                Отправить отзыв
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-5 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 flex items-center justify-center" style={{ background: "var(--neon)" }}>
                <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, fontWeight: 700, color: "#080808" }}>{STUDIO_ABBR}</span>
              </div>
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, letterSpacing: "3px", color: "white", textTransform: "uppercase" }}>{STUDIO_NAME}</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>Студия кастомных скинов · с 2026</div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link text-xs">{label}</button>
            ))}
          </div>

          <div className="flex flex-col gap-3 items-center md:items-end">
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, letterSpacing: "3px", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: 2 }}>Контакты</div>
            <a href="https://t.me/Xezze228" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--neon)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
              <span>✈️</span>@Xezze228
            </a>
            <a href="https://discord.com/users/xezze228" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--neon)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
              <span>🎮</span>@xezze228
            </a>
          </div>
        </div>

        <div className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>© 2026 {STUDIO_NAME}. Все права защищены.</div>
          <div className="flex gap-3">
            <button className="btn-outline text-xs" style={{ padding: "7px 16px" }} onClick={() => navigate("/login")}>
              <Icon name="Lock" size={12} />
              Панель
            </button>
            <button className="btn-neon text-xs" style={{ padding: "7px 18px" }} onClick={() => { setOrderDone(null); setOrderOpen(true); }}>
              Заказать скин
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}