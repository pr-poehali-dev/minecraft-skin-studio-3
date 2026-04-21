import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const skinImage = "https://cdn.poehali.dev/projects/e61d7d76-87d1-48b7-9f55-e6f70491382c/files/8bb3251d-0466-4689-9d3d-204d889f0d81.jpg";

const SERVICES = [
  {
    icon: "Layers",
    title: "Скин под ключ",
    desc: "Создаём уникальный дизайн с нуля по вашему брифу. Полная кастомизация цветов, паттернов и текстур.",
    price: "от 2 900 ₽",
    tag: "Популярно",
  },
  {
    icon: "Palette",
    title: "Ребрендинг",
    desc: "Обновляем существующий скин — корректируем цвета, добавляем элементы, меняем стиль.",
    price: "от 1 500 ₽",
    tag: null,
  },
  {
    icon: "Zap",
    title: "Экспресс-скин",
    desc: "Быстрое создание скина за 24 часа. Идеально для тех, кому нужен результат уже сегодня.",
    price: "от 3 500 ₽",
    tag: "24ч",
  },
  {
    icon: "Star",
    title: "VIP-пакет",
    desc: "Безлимитные правки, персональный менеджер, приоритетная очередь и файлы исходников.",
    price: "от 7 900 ₽",
    tag: "Лучший",
  },
];

const REVIEWS = [
  {
    name: "Артём К.",
    role: "Стример / 120k подписчиков",
    text: "Сделали скин за 2 дня — качество шикарное. Зрители сразу заметили обновление, куча комплиментов. Буду возвращаться.",
    rating: 5,
  },
  {
    name: "Маша_PRO",
    role: "CS2 / Diamond",
    text: "Заказывала экспресс-вариант перед турниром. Пришло вовремя, всё идеально. Отдельно хочу отметить внимание к деталям.",
    rating: 5,
  },
  {
    name: "NightWolf99",
    role: "Valorant / Immortal",
    text: "Давно искал студию с таким подходом. Показали концепт, доработали по правкам — результат превзошёл ожидания.",
    rating: 5,
  },
];

const TYPES = ["Оружие", "Персонаж", "Нож", "Перчатки", "Снаряжение"];
const STYLES = ["Киберпанк", "Минимализм", "Граффити", "Природа", "Абстракция", "Тёмный"];
const BUDGETS = ["до 2 000 ₽", "2–5 000 ₽", "5–10 000 ₽", "10 000+ ₽"];

export default function Index() {
  const [activeType, setActiveType] = useState(0);
  const [activeStyle, setActiveStyle] = useState(0);
  const [activeBudget, setActiveBudget] = useState(1);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); }
    setMenuOpen(false);
  };

  useEffect(() => {
    const sections = ["hero", "services", "about", "reviews", "order"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg relative">
      <div className="scanline" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)", backdropFilter: "blur(8px)" }}>
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center" style={{ background: "var(--neon)" }}>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, fontWeight: 700, color: "#080808" }}>SF</span>
          </div>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, letterSpacing: "3px", color: "white", textTransform: "uppercase" }}>
            SKINFORGE
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className={`nav-link ${activeSection === id ? "!text-[var(--neon)]" : ""}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button className="btn-neon text-sm" style={{ padding: "10px 24px" }} onClick={() => scrollTo("order")}>
            Оформить заказ
          </button>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(8,8,8,0.98)" }}>
          {[["hero","Главная"],["services","Услуги"],["about","О нас"],["reviews","Отзывы"],["order","Заказать"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="nav-link text-2xl">
              {label}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end pb-20 pt-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Bg image */}
        <div className="absolute inset-0 z-0">
          <img src={skinImage} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 30%, rgba(10,10,10,0.5) 70%, rgba(10,10,10,0.8))" }} />
        </div>

        {/* Floating image */}
        <div className="absolute right-0 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-10 hidden md:block animate-float">
          <div className="relative" style={{ width: 420 }}>
            <img src={skinImage} alt="Скин" className="w-full object-cover rounded-none"
              style={{ aspectRatio: "1/1", filter: "brightness(1.1) contrast(1.1)", border: "1px solid rgba(0,255,110,0.2)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,255,110,0.08) 0%, transparent 60%)" }} />
            <div className="absolute top-4 right-4 tag">DEMO</div>
            <div className="animate-pulse-neon absolute inset-0 pointer-events-none"
              style={{ border: "1px solid rgba(0,255,110,0.1)" }} />
          </div>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="animate-fade-up delay-100 mb-6">
            <span className="section-label">// Студия кастомных скинов</span>
          </div>

          <h1 className="hero-title text-white animate-fade-up delay-200 mb-6">
            <span className="glitch" data-text="ТВОЙ">ТВОЙ</span>
            <br />
            <span style={{ color: "var(--neon)" }}>УНИКАЛЬНЫЙ</span>
            <br />
            СКИН
          </h1>

          <p className="animate-fade-up delay-300 text-white/50 text-lg mb-10 max-w-md leading-relaxed">
            Создаём кастомные скины для любых платформ — от игрового снаряжения до стримерских оверлеев. Сотни довольных клиентов.
          </p>

          <div className="animate-fade-up delay-400 flex flex-wrap gap-4">
            <button className="btn-neon" onClick={() => scrollTo("order")}>
              <Icon name="ArrowRight" size={16} />
              Заказать скин
            </button>
            <button className="btn-outline" onClick={() => scrollTo("services")}>
              <Icon name="Grid" size={16} />
              Наши услуги
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-16 flex flex-wrap gap-8 md:gap-16">
          {[["500+","Заказов выполнено"],["98%","Довольных клиентов"],["24ч","Минимальный срок"]].map(([num, label]) => (
            <div key={num} className="animate-fade-in delay-500">
              <div className="stat-number">{num}</div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, letterSpacing: "2px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in delay-700">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 10, letterSpacing: "3px", color: "white" }}>SCROLL</div>
            <Icon name="ChevronDown" size={16} color="white" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 md:px-12 lg:px-20">
        <div className="mb-16">
          <div className="section-label mb-4">// 01 — Услуги</div>
          <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>
            ЧТО МЫ <span style={{ color: "var(--neon)" }}>ДЕЛАЕМ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => (
            <div key={i} className="skin-card p-8">
              {s.tag && (
                <div className="tag mb-6 text-xs">{s.tag}</div>
              )}
              {!s.tag && <div className="mb-6 h-[26px]" />}
              <div className="mb-6 w-12 h-12 flex items-center justify-center neon-border">
                <Icon name={s.icon} size={20} color="var(--neon)" />
              </div>
              <h3 style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                {s.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">{s.desc}</p>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, color: "var(--neon)" }}>
                {s.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-4">// 02 — О студии</div>
            <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05, marginBottom: 24 }}>
              МЫ СОЗДАЁМ <span style={{ color: "var(--neon)" }}>ИСКУССТВО</span> ДЛЯ ИГРОКОВ
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              SKINFORGE — команда дизайнеров, увлечённых игровой эстетикой. Мы понимаем, что скин — это не просто текстура, это часть твоей идентичности в игре.
            </p>
            <p className="text-white/50 leading-relaxed mb-10">
              Каждый проект мы прорабатываем индивидуально: изучаем твой стиль, учитываем пожелания и создаём нечто, что будет выделять тебя из толпы.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[["5","Лет опыта"],["50+","Уникальных стилей"],["3","Дизайнера в команде"]].map(([n, l]) => (
                <div key={n} style={{ borderLeft: "2px solid var(--neon)", paddingLeft: 16 }}>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden" style={{ border: "1px solid rgba(0,255,110,0.15)" }}>
              <img src={skinImage} alt="О студии" className="w-full object-cover" style={{ aspectRatio: "4/3", filter: "brightness(0.85) contrast(1.1) saturate(0.9)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)" }} />
            </div>

            {/* Badges */}
            <div className="absolute -left-4 top-8 neon-border p-4" style={{ background: "rgba(10,10,10,0.95)" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, color: "var(--neon)", lineHeight: 1 }}>500+</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>заказов</div>
            </div>

            <div className="absolute -right-4 bottom-8 neon-border p-4" style={{ background: "rgba(10,10,10,0.95)" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 28, fontWeight: 700, color: "var(--neon)", lineHeight: 1 }}>98%</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>довольны</div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mb-16">
          <div className="section-label mb-4">// 03 — Отзывы</div>
          <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>
            ЧТО ГОВОРЯТ <span style={{ color: "var(--neon)" }}>КЛИЕНТЫ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              <div className="quote-mark">"</div>
              <div className="flex mb-4 mt-2">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Icon key={j} name="Star" size={14} color="var(--neon)" />
                ))}
              </div>
              <p className="text-white/70 leading-relaxed mb-8 text-sm">{r.text}</p>
              <div>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER */}
      <section id="order" className="py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="section-label mb-4">// 04 — Заказ</div>
            <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05, marginBottom: 16 }}>
              КАСТОМИЗИРУЙ <span style={{ color: "var(--neon)" }}>СВОЙ</span> СКИН
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Выбери параметры, и мы подберём оптимальный вариант. Ответим в течение часа и согласуем детали.
            </p>
          </div>

          <div className="space-y-8">
            {/* Type */}
            <div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: "3px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
                Тип предмета
              </div>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t, i) => (
                  <button key={i} className={`option-btn ${activeType === i ? "active" : ""}`} onClick={() => setActiveType(i)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: "3px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
                Стиль дизайна
              </div>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s, i) => (
                  <button key={i} className={`option-btn ${activeStyle === i ? "active" : ""}`} onClick={() => setActiveStyle(i)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: "3px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
                Бюджет
              </div>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b, i) => (
                  <button key={i} className={`option-btn ${activeBudget === i ? "active" : ""}`} onClick={() => setActiveBudget(i)}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="neon-border p-5" style={{ background: "rgba(0,255,110,0.04)" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, letterSpacing: "3px", color: "var(--neon)", textTransform: "uppercase", marginBottom: 12 }}>
                Ваш выбор
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="tag text-xs">{TYPES[activeType]}</span>
                <span className="tag text-xs">{STYLES[activeStyle]}</span>
                <span className="tag text-xs">{BUDGETS[activeBudget]}</span>
              </div>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Имя</div>
                <input className="input-neon" placeholder="Как вас зовут?" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Telegram / VK</div>
                <input className="input-neon" placeholder="@username" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
            </div>

            <button className="btn-neon w-full justify-center text-base py-4">
              <Icon name="Send" size={18} />
              Отправить заявку
            </button>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
              Ответим в течение 1 часа в рабочее время
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 md:px-12 lg:px-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "var(--neon)" }}>
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 11, fontWeight: 700, color: "#080808" }}>SF</span>
            </div>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, letterSpacing: "3px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
              SKINFORGE
            </span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            © 2024 SKINFORGE. Все права защищены.
          </div>
          <div className="flex gap-6">
            {["Telegram", "VK", "Discord"].map((s) => (
              <span key={s} className="nav-link text-xs" style={{ cursor: "pointer" }}>{s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}