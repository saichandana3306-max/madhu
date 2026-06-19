import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

import memory1 from "@/assets/WhatsApp Image 2026-05-16 at 8.30.10 PM.jpeg";
import memory2 from "@/assets/WhatsApp Image 2026-05-16 at 8.30.11 PM.jpeg";
import memory3 from "@/assets/WhatsApp Image 2026-05-16 at 8.30.13 PM.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Bro — For Madhu" },
      { name: "description", content: "A premium birthday surprise for my brother Madhu, turning 21 on June 22." },
      { property: "og:title", content: "Happy Birthday, Bro" },
      { property: "og:description", content: "A surprise made with love." },
    ],
  }),
  component: BirthdayPage,
});

// Birthday: June 22 (uses current year)
const PASSWORD = "broo";
const BIRTHDAY_MONTH = 5; // 0-indexed June
const BIRTHDAY_DAY = 22;

function isBirthdayToday(now = new Date()) {
  return now.getMonth() === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
}

function nextBirthday(now = new Date()) {
  const year = now.getFullYear();
  let target = new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
  if (now.getTime() > target.getTime() && !isBirthdayToday(now)) {
    target = new Date(year + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
  }
  return target;
}

function BirthdayPage() {
  const [unlocked, setUnlocked] = useState(false);

  // Persist unlock for the day
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("bro-unlocked") === "yes") {
      setUnlocked(true);
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Starfield />
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <LockScreen key="lock" onUnlock={() => {
            localStorage.setItem("bro-unlocked", "yes");
            setUnlocked(true);
          }} />
        ) : (
          <Reveal key="reveal" />
        )}
      </AnimatePresence>
    </main>
  );
}

function Starfield() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 starfield twinkle opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.14_85/0.12),transparent_60%)]" />
    </>
  );
}

/* ------------------------------- LOCK SCREEN ------------------------------ */

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const today = true; // birthday is today 🎉
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.trim().toLowerCase() === PASSWORD) {
      onUnlock();
    } else {
      setErr("Hint: what do I always call you?");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-xl text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-3 inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-primary/80"
        >
          <span className="h-px w-8 bg-primary/50" />
          A Private Invitation
          <span className="h-px w-8 bg-primary/50" />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-display text-5xl sm:text-7xl leading-[1.05]"
        >
          For my <span className="font-serif-elegant text-gold-gradient">Broo</span>,
          <br /> with love.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-6 text-base sm:text-lg font-serif-elegant text-muted-foreground"
        >
          A small surprise — sealed until your day arrives.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-10"
        >
          {today ? (
            <p className="font-display text-2xl text-gold-gradient">
              ✦ Today is the day ✦
            </p>
          ) : (
            <Countdown />
          )}
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className={`mt-10 mx-auto flex max-w-md flex-col gap-3 ${shake ? "animate-pulse" : ""}`}
        >
          <div className="relative">
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(""); }}
              placeholder="Enter the secret word"
              className="w-full rounded-full border border-primary/30 bg-card/60 px-6 py-4 text-center font-serif-elegant text-lg text-foreground placeholder:text-muted-foreground/60 backdrop-blur focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <button
            type="submit"
            className="group relative overflow-hidden rounded-full bg-gold-gradient px-8 py-4 font-medium uppercase tracking-[0.25em] text-primary-foreground shadow-gold transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Open the gift</span>
            <span className="absolute inset-0 shimmer opacity-60" />
          </button>
          <p className="min-h-5 text-sm font-serif-elegant text-primary/70">{err}</p>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-12 text-xs uppercase tracking-[0.35em] text-muted-foreground/60"
        >
          ✦  Madhu  ·  Turning 21  ·  June 22  ✦
        </motion.div>
      </div>
    </motion.section>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = useMemo(() => nextBirthday(now), [now]);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const items = [
    { v: d, l: "Days" },
    { v: h, l: "Hours" },
    { v: m, l: "Minutes" },
    { v: s, l: "Seconds" },
  ];

  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-3">
      {items.map((it) => (
        <div key={it.l} className="rounded-2xl border border-primary/20 bg-card/40 p-4 backdrop-blur">
          <div className="font-display text-3xl sm:text-4xl text-gold-gradient tabular-nums">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{it.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- REVEAL --------------------------------- */

function Reveal() {
  useEffect(() => {
    const burst = () => {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.3 },
        colors: ["#f5e6a8", "#d4af37", "#fff8e1", "#b8860b"],
      });
    };
    burst();
    const t = setTimeout(burst, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative z-10"
    >
      <Hero />
      <CakeSection />
      <LetterSection />
      <Gallery />
      <Footer />
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-xs uppercase tracking-[0.5em] text-primary/80"
      >
        ✦  June  ·  Twenty Two  ·  Twenty Twenty Six  ✦
      </motion.div>

      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="mt-6 font-display text-6xl sm:text-8xl lg:text-[10rem] leading-[0.95]"
      >
        Happy
        <br />
        <span className="text-gold-gradient italic font-serif-elegant">Birthday,</span>
        <br />
        Broo.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-8 max-w-lg font-serif-elegant text-lg sm:text-xl text-muted-foreground"
      >
        Twenty-one looks beautiful on you, bro. Scroll on — I made every inch of this for you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="mt-16 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/70"
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-10 w-px bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ----------------------------------- CAKE ---------------------------------- */

function CakeSection() {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const allOut = candlesLit.every((c) => !c);
  const audioRef = useRef<HTMLDivElement>(null);

  function blowOut(i: number) {
    setCandlesLit((arr) => arr.map((v, idx) => (idx === i ? false : v)));
  }

  function blowAll() {
    setCandlesLit([false, false, false, false, false]);
  }

  useEffect(() => {
    if (allOut) {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: ["#f5e6a8", "#d4af37", "#fff8e1", "#b8860b", "#ffffff"],
      });
    }
  }, [allOut]);

  return (
    <section className="relative px-6 py-32" ref={audioRef}>
      <div className="mx-auto max-w-3xl text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-primary/70">Chapter One</div>
        <h2 className="mt-3 font-display text-4xl sm:text-6xl">
          Make a <span className="text-gold-gradient italic font-serif-elegant">wish</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-md font-serif-elegant text-muted-foreground">
          Tap each candle to blow it out. Don't tell me your wish — but make it a big one.
        </p>

        <div className="relative mx-auto mt-16 flex h-[420px] w-full max-w-lg items-end justify-center">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-x-0 bottom-32 mx-auto h-40 w-full max-w-md rounded-full bg-primary/20 blur-3xl" />

          {/* Cake */}
          <div className="relative w-full">
            {/* Candles */}
            <div className="absolute inset-x-0 bottom-[235px] mx-auto flex w-[78%] justify-between">
              {candlesLit.map((lit, i) => (
                <Candle key={i} lit={lit} onBlow={() => blowOut(i)} />
              ))}
            </div>

            {/* Top tier */}
            <div className="relative mx-auto h-24 w-[58%] rounded-t-md bg-gradient-to-b from-[oklch(0.96_0.04_85)] to-[oklch(0.82_0.08_80)] shadow-luxe">
              <div className="absolute inset-x-0 -top-3 mx-auto h-3 w-full bg-gold-gradient" />
              {/* drips */}
              <div className="absolute inset-x-0 top-6 flex justify-around">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-6 w-1.5 rounded-b-full bg-gold-gradient opacity-90" style={{ height: `${12 + ((i * 7) % 18)}px` }} />
                ))}
              </div>
            </div>

            {/* Middle tier */}
            <div className="relative mx-auto -mt-1 h-28 w-[78%] rounded-sm bg-gradient-to-b from-[oklch(0.32_0.04_290)] to-[oklch(0.2_0.03_290)] shadow-luxe">
              <div className="absolute inset-x-0 top-4 flex justify-around px-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-gold-gradient" />
                ))}
              </div>
              <div className="absolute inset-x-0 top-10 text-center font-display text-xl text-gold-gradient italic">
                Bro · 21
              </div>
            </div>

            {/* Bottom tier */}
            <div className="relative mx-auto -mt-1 h-36 w-full rounded-sm bg-gradient-to-b from-[oklch(0.96_0.04_85)] to-[oklch(0.72_0.1_75)] shadow-luxe">
              <div className="absolute inset-x-0 -top-2 mx-auto h-2 w-full bg-gold-gradient" />
              <div className="absolute inset-x-0 top-6 flex justify-around">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-2 w-2 rotate-45 bg-[oklch(0.55_0.13_45)]" />
                ))}
              </div>
            </div>

            {/* Plate */}
            <div className="mx-auto -mt-1 h-4 w-[108%] -translate-x-[4%] rounded-full bg-gradient-to-b from-[oklch(0.55_0.06_290)] to-[oklch(0.25_0.03_290)] shadow-luxe" />
          </div>
        </div>

        <AnimatePresence>
          {!allOut ? (
            <motion.button
              key="blow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={blowAll}
              className="mt-12 rounded-full gold-border bg-card/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-primary/90 backdrop-blur hover:bg-card/60 transition"
            >
              Take one big breath
            </motion.button>
          ) : (
            <motion.div
              key="wished"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 font-display text-2xl text-gold-gradient"
            >
              ✦ Wish granted ✦
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Candle({ lit, onBlow }: { lit: boolean; onBlow: () => void }) {
  return (
    <button
      onClick={onBlow}
      aria-label="Blow out candle"
      className="group relative flex h-24 w-3 flex-col items-center"
    >
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative -mb-1"
          >
            {/* Glow halo */}
            <div className="absolute inset-0 -m-3 rounded-full bg-[oklch(0.9_0.18_75/0.5)] blur-md" />
            {/* Flame */}
            <div className="flame relative h-5 w-3 rounded-full bg-gradient-to-t from-[oklch(0.85_0.18_60)] via-[oklch(0.92_0.18_85)] to-[oklch(1_0.05_95)]" />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Candle body */}
      <div className="h-20 w-2 rounded-sm bg-gradient-to-b from-[oklch(0.96_0.05_85)] to-[oklch(0.7_0.1_70)] shadow-md" />
    </button>
  );
}

/* ---------------------------------- LETTER --------------------------------- */

function LetterSection() {
  const lines = [
    "Dear Bro ❤️",
    "Thank you for always being there for me.",
    "You are not only my brother,",
    "you are my close friend too.",
    "No matter how much we fight,",
    "Happy Birthday 🎂✨",
  ];

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-primary/70">Chapter Two</div>
        <h2 className="mt-3 font-display text-4xl sm:text-6xl">
          A letter, <span className="text-gold-gradient italic font-serif-elegant">unsealed</span>.
        </h2>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-3xl gold-border bg-card/40 p-10 sm:p-14 backdrop-blur-md shadow-luxe"
      >
        {/* Wax seal */}
        <div className="absolute -right-6 -top-6 h-20 w-20 rotate-12 rounded-full bg-gold-gradient opacity-90 shadow-gold flex items-center justify-center font-display text-2xl text-primary-foreground">
          M
        </div>

        <div className="space-y-5 text-center font-serif-elegant text-lg sm:text-2xl leading-relaxed">
          {lines.map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={i === 0 || i === lines.length - 1 ? "text-gold-gradient font-display text-2xl sm:text-3xl" : ""}
            >
              {l}
            </motion.p>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-primary/70">
          <span className="h-px w-10 bg-primary/40" />
          With all my love
          <span className="h-px w-10 bg-primary/40" />
        </div>
      </motion.article>
    </section>
  );
}

/* ---------------------------------- GALLERY -------------------------------- */

const memories = [
  { src: memory1, caption: "The nights we never wanted to end." },
  { src: memory2, caption: "Every road, with you riding shotgun." },
  { src: memory3, caption: "Quiet noise is not good for us keep smiling ." },
   
];

function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-primary/70">Chapter Three</div>
          <h2 className="mt-3 font-display text-4xl sm:text-6xl">
            Our <span className="text-gold-gradient italic font-serif-elegant">moments</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-serif-elegant text-muted-foreground">
            A small gallery. Replace these with our real photos whenever you want — they're placeholders for now.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {memories.map((m, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl gold-border shadow-luxe"
            >
              <img
                src={m.src}
                alt={m.caption}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                <p className="font-serif-elegant text-base text-foreground">{m.caption}</p>
                <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-primary/80">
                  No. {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[88vh] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={memories[active].src} alt="" className="max-h-[80vh] rounded-2xl object-contain shadow-gold gold-border" />
              <p className="mt-4 text-center font-serif-elegant text-lg text-gold-gradient">{memories[active].caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 py-24 text-center">
      <div className="mx-auto max-w-xl">
        <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <p className="mt-8 font-serif-elegant text-xl text-gold-gradient">
          Made for you, bro.
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          ✦  Madhu  ·  21  ·  June 22  ✦
        </p>
      </div>
    </footer>
  );
}
