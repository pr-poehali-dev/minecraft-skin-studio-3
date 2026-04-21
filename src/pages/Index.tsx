import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const skinImage = "https://cdn.poehali.dev/projects/e61d7d76-87d1-48b7-9f55-e6f70491382c/files/8bb3251d-0466-4689-9d3d-204d889f0d81.jpg";

const STUDIO_NAME = "PIXELCRAFT";
const STUDIO_ABBR = "PC";

const SERVICES = [
  {
    icon: "Sparkles",
    title: "Кастомный скин",
    desc: "Уникальный дизайн с нуля по твоему описанию. Любые цвета, паттерны и стиль — полная свобода творчества.",
    price: "100 ₽",
    tag: "Популярно",
  },
  {
    icon: "Wand2",
    title: "Простой скин",
    desc: "Базовый скин в одном стиле. Быстро, качественно, доступно. Идеально для старта.",
    price: "50 ₽",
    tag: null,
  },
  {
    icon: "RefreshCw",
    title: "Ребрендинг",
    desc: "Обновляем твой существующий скин — меняем цвета, добавляем детали, освежаем стиль.",
    price: "60 ₽",
    tag: null,
  },
  {
    icon: "Package",
    title: "Комплект скинов",
    desc: "3 и более скинов в едином стиле — выгодно для тех, кто хочет полный сет. Каждый скин уникален.",
    price: "от 150 ₽",
    tag: "Выгодно",
  },
];

const REVIEWS = [
  {
    name: "Артём К.",
    role: "Стример / CS2",
    text: "Заказывал кастомный скин — сделали именно то, что я описал. Зрители в восторге, буду брать комплект!",
    rating: 5,
  },
  {
    name: "Маша_PRO",
    role: "Valorant / Diamond",
    text: "Брала простой скин перед турниром. Пришло быстро, всё чисто и красиво. Цена вообще смешная за такое качество.",
    rating: 5,
  },
  {
    name: "NightWolf99",
    role: "Rust / Twitch",
    text: "Взял комплект из 4 скинов — получил единый стиль на весь инвентарь. Виктор — мастер своего дела!",
    rating: 5,
  },
  {
    name: "xShadow",
    role: "TF2 / коллекционер",
    text: "Делал ребрендинг старого скина. Преобразили до неузнаваемости. Быстро и недорого, всё чётко.",
    rating: 5,
  },
];

const PRODUCTS = ["Простой скин — 50 ₽", "Кастомный скин — 100 ₽", "Ребрендинг — 60 ₽", "Комплект скинов (3+) — от 150 ₽"];
const DEADLINES = ["1–2 дня", "3–5 дней", "Неделя", "Без срока"];

interface OrderForm {
  nickname: string;
  product: string;
  description: string;
  deadline: string;
  tg: string;
  ds: string;
  vk: string;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [form, setForm] = useState<OrderForm>({
    nickname: "", product: PRODUCTS[0], description: "", deadline: DEADLINES[0],
    tg: "", ds: "", vk: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openOrder = () => { setOrderOpen(true); setSubmitted(false); };
  const closeOrder = () => setOrderOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const sections = ["hero", "services", "about", "reviews"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (orderOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [orderOpen]);

  return (
    <div className="min-h-screen bg-background grid-bg relative">
      <div className="scanline" />

      {/* ORDER MODAL */}
      {orderOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(4,4,4,0.92)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeOrder(); }}>
          <div className="w-full max-w-lg relative" style={{ background: "#0d0d0d", border: "1px solid rgba(0,255,110,0.25)", boxShadow: "0 0 60px rgba(0,255,110,0.1)" }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div className="section-label text-xs mb-1">// Оформление заказа</div>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: "white" }}>
                  Заказать скин
                </div>
              </div>
              <button onClick={closeOrder} className="text-white/40 hover:text-white transition-colors p-1">
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-7 py-6 max-h-[75vh] overflow-y-auto">
              {submitted ? (
                <div className="py-10 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 flex items-center justify-center" style={{ border: "2px solid var(--neon)" }}>
                    <Icon name="Check" size={28} color="var(--neon)" />
                  </div>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 24, fontWeight: 700, color: "white", textTransform: "uppercase" }}>
                    Заявка отправлена!
                  </div>
                  <p className="text-white/50 text-sm">Виктор свяжется с тобой в течение нескольких часов через указанный контакт.</p>
                  <button className="btn-neon mt-4 text-sm" style={{ padding: "10px 28px" }} onClick={closeOrder}>
                    Закрыть
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Ник */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "1px" }}>
                      Ник / Имя *
                    </label>
                    <input
                      className="input-neon"
                      placeholder="Твой игровой ник или имя"
                      required
                      value={form.nickname}
                      onChange={e => setForm({ ...form, nickname: e.target.value })}
                    />
                  </div>

                  {/* Товар */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "1px" }}>
                      Выбор товара *
                    </label>
                    <div className="flex flex-col gap-2">
                      {PRODUCTS.map((p) => (
                        <button
                          type="button"
                          key={p}
                          className={`option-btn text-left ${form.product === p ? "active" : ""}`}
                          onClick={() => setForm({ ...form, product: p })}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Описание */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "1px" }}>
                      Описание *
                    </label>
                    <textarea
                      className="input-neon resize-none"
                      style={{ minHeight: 90 }}
                      placeholder="Опиши, что именно ты хочешь: цвета, стиль, детали..."
                      required
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  {/* Сроки */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "1px" }}>
                      Желаемые сроки
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DEADLINES.map((d) => (
                        <button
                          type="button"
                          key={d}
                          className={`option-btn ${form.deadline === d ? "active" : ""}`}
                          onClick={() => setForm({ ...form, deadline: d })}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Контакты */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "1px", marginBottom: 12 }}>
                      Контакты (заполни хотя бы один)
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex-shrink-0 text-center" style={{ fontSize: 16 }}>✈️</div>
                        <input
                          className="input-neon"
                          placeholder="Telegram: @username"
                          value={form.tg}
                          onChange={e => setForm({ ...form, tg: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex-shrink-0 text-center" style={{ fontSize: 16 }}>🎮</div>
                        <input
                          className="input-neon"
                          placeholder="Discord: @username"
                          value={form.ds}
                          onChange={e => setForm({ ...form, ds: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex-shrink-0 text-center" style={{ fontSize: 16 }}>💬</div>
                        <input
                          className="input-neon"
                          placeholder="ВКонтакте: ссылка или @id"
                          value={form.vk}
                          onChange={e => setForm({ ...form, vk: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-neon w-full justify-center text-base"
                    style={{ padding: "14px", marginTop: 4 }}
                  >
                    <Icon name="Send" size={17} />
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
        style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.97), transparent)", backdropFilter: "blur(10px)" }}>
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: "var(--neon)" }}>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, fontWeight: 700, color: "#080808" }}>{STUDIO_ABBR}</span>
          </div>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, letterSpacing: "3px", color: "white", textTransform: "uppercase" }}>
            {STUDIO_NAME}
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className={`nav-link ${activeSection === id ? "!text-[var(--neon)]" : ""}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button className="btn-neon text-sm" style={{ padding: "9px 22px" }} onClick={openOrder}>
            Заказать скин
          </button>
        </div>

        <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(6,6,6,0.99)" }}>
          {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="nav-link" style={{ fontSize: 28, letterSpacing: "4px" }}>
              {label}
            </button>
          ))}
          <button className="btn-neon mt-4" onClick={() => { setMenuOpen(false); openOrder(); }}>
            Заказать скин
          </button>
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end pb-16 pt-28 px-5 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={skinImage} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 35%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.85))" }} />
        </div>

        {/* Desktop floating image */}
        <div className="absolute right-0 lg:right-10 xl:right-20 top-1/2 -translate-y-1/2 z-10 hidden lg:block animate-float">
          <div className="relative" style={{ width: 400 }}>
            <img src={skinImage} alt="Скин" className="w-full object-cover"
              style={{ aspectRatio: "1/1", filter: "brightness(1.1) contrast(1.1)", border: "1px solid rgba(0,255,110,0.2)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,255,110,0.08) 0%, transparent 60%)" }} />
            <div className="absolute top-4 right-4 tag">DEMO</div>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="animate-fade-up delay-100 mb-5">
            <span className="section-label">// Студия кастомных скинов</span>
          </div>
          <h1 className="hero-title text-white animate-fade-up delay-200 mb-6">
            <span className="glitch" data-text="ТВОЙ">ТВОЙ</span>
            <br />
            <span style={{ color: "var(--neon)" }}>УНИКАЛЬНЫЙ</span>
            <br />
            СКИН
          </h1>
          <p className="animate-fade-up delay-300 text-white/45 text-base md:text-lg mb-8 max-w-md leading-relaxed">
            Создаём кастомные скины для игр. Доступные цены, быстро, с душой. Работаем с 2026 года.
          </p>
          <div className="animate-fade-up delay-400 flex flex-wrap gap-3">
            <button className="btn-neon" onClick={openOrder}>
              <Icon name="ArrowRight" size={16} />
              Заказать скин
            </button>
            <button className="btn-outline" onClick={() => scrollTo("services")}>
              <Icon name="Grid" size={16} />
              Наши услуги
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-12 flex flex-wrap gap-8 md:gap-14">
          {[["100+","Заказов"],["100%","Довольных"],["2026","Год основания"]].map(([num, label]) => (
            <div key={num} className="animate-fade-in delay-500">
              <div className="stat-number">{num}</div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, letterSpacing: "2px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 animate-fade-in delay-700">
          <div className="flex flex-col items-center gap-1 opacity-30">
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 9, letterSpacing: "3px", color: "white" }}>SCROLL</div>
            <Icon name="ChevronDown" size={15} color="white" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 md:py-24 px-5 md:px-12 lg:px-20">
        <div className="mb-12 md:mb-16">
          <div className="section-label mb-4">// 01 — Услуги и цены</div>
          <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>
            ЧТО МЫ <span style={{ color: "var(--neon)" }}>ДЕЛАЕМ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => (
            <div key={i} className="skin-card p-6 md:p-8 flex flex-col">
              {s.tag ? (
                <div className="tag mb-5">{s.tag}</div>
              ) : (
                <div className="mb-5 h-[26px]" />
              )}
              <div className="mb-5 w-11 h-11 flex items-center justify-center neon-border flex-shrink-0">
                <Icon name={s.icon} size={20} color="var(--neon)" />
              </div>
              <h3 style={{ fontFamily: "Oswald, sans-serif", fontSize: 19, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
                {s.title}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed flex-1 mb-6">{s.desc}</p>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 26, fontWeight: 700, color: "var(--neon)" }}>
                {s.price}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="btn-neon text-base" onClick={openOrder}>
            <Icon name="ShoppingCart" size={17} />
            Оформить заказ
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-24 px-5 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="section-label mb-4">// 02 — О студии</div>
            <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05, marginBottom: 20 }}>
              МЫ СОЗДАЁМ <span style={{ color: "var(--neon)" }}>ИСКУССТВО</span> ДЛЯ ИГРОКОВ
            </h2>
            <p className="text-white/50 leading-relaxed mb-4 text-sm md:text-base">
              <span style={{ fontFamily: "Oswald, sans-serif" }}>{STUDIO_NAME}</span> — студия кастомных скинов, основанная в 2026 году. Мы понимаем, что скин — это не просто текстура, это твоя идентичность в игре.
            </p>
            <p className="text-white/50 leading-relaxed mb-8 text-sm md:text-base">
              Каждый заказ мы прорабатываем индивидуально: изучаем пожелания, предлагаем концепт и создаём то, что выделит тебя из толпы. Доступные цены — без потери качества.
            </p>

            {/* Specialist */}
            <div className="neon-border p-5" style={{ background: "rgba(0,255,110,0.03)" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,255,110,0.12)", border: "1px solid rgba(0,255,110,0.3)" }}>
                  <Icon name="User" size={24} color="var(--neon)" />
                </div>
                <div>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "white" }}>
                    Виктор
                  </div>
                  <div style={{ fontSize: 13, color: "var(--neon)", marginTop: 2 }}>Главный Скинодел</div>
                  <div className="flex gap-3 mt-3">
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      <span style={{ color: "white", fontWeight: 600 }}>100</span> работ
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      Делает скины <span style={{ color: "white", fontWeight: 600 }}>уже год</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden" style={{ border: "1px solid rgba(0,255,110,0.12)" }}>
              <img src={skinImage} alt="О студии" className="w-full object-cover"
                style={{ aspectRatio: "4/3", filter: "brightness(0.8) contrast(1.1) saturate(0.85)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)" }} />
            </div>
            <div className="absolute -left-3 md:-left-5 top-6 neon-border p-3 md:p-4" style={{ background: "rgba(10,10,10,0.97)" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 26, fontWeight: 700, color: "var(--neon)", lineHeight: 1 }}>2026</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>основана</div>
            </div>
            <div className="absolute -right-3 md:-right-5 bottom-6 neon-border p-3 md:p-4" style={{ background: "rgba(10,10,10,0.97)" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 26, fontWeight: 700, color: "var(--neon)", lineHeight: 1 }}>100+</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>работ</div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 md:py-24 px-5 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mb-12 md:mb-16">
          <div className="section-label mb-4">// 03 — Отзывы</div>
          <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>
            ЧТО ГОВОРЯТ <span style={{ color: "var(--neon)" }}>КЛИЕНТЫ</span>
          </h2>
        </div>

        {/* Rating summary */}
        <div className="mb-10 flex flex-wrap gap-6 items-center">
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 72, fontWeight: 700, lineHeight: 1, color: "white" }}>5.0</div>
          <div>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="Star" size={22} color="var(--neon)" />
              ))}
            </div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: "2px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
              {REVIEWS.length} отзыва · 100% рекомендуют
            </div>
          </div>
          {/* Mini bars */}
          <div className="ml-auto hidden md:flex flex-col gap-1">
            {[5,4,3,2,1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", width: 8 }}>{star}</span>
                <div style={{ width: 100, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                  <div style={{ width: star === 5 ? "100%" : "0%", height: "100%", background: "var(--neon)", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              <div className="quote-mark">"</div>
              <div className="flex mb-3 mt-1">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Icon key={j} name="Star" size={13} color="var(--neon)" />
                ))}
              </div>
              <p className="text-white/65 leading-relaxed mb-6 text-sm">{r.text}</p>
              <div>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{r.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="btn-neon" onClick={openOrder}>
            <Icon name="ArrowRight" size={16} />
            Заказать скин
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-5 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: "var(--neon)" }}>
                <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, fontWeight: 700, color: "#080808" }}>{STUDIO_ABBR}</span>
              </div>
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, letterSpacing: "3px", color: "white", textTransform: "uppercase" }}>
                {STUDIO_NAME}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Студия кастомных скинов · с 2026</div>
          </div>

          {/* Nav */}
          <div className="flex flex-wrap gap-6 justify-center">
            {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link text-xs">{label}</button>
            ))}
          </div>

          {/* Contacts */}
          <div className="flex flex-col gap-3 items-center md:items-end">
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, letterSpacing: "3px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 4 }}>
              Связаться
            </div>
            <a href="https://t.me/Xezze228" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 group"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--neon)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
              <span style={{ fontSize: 16 }}>✈️</span>
              @Xezze228
            </a>
            <a href="https://discord.com/users/xezze228" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--neon)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
              <span style={{ fontSize: 16 }}>🎮</span>
              @xezze228
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>© 2026 {STUDIO_NAME}. Все права защищены.</div>
          <button className="btn-neon text-xs" style={{ padding: "8px 20px" }} onClick={openOrder}>
            Заказать скин
          </button>
        </div>
      </footer>
    </div>
  );
}
