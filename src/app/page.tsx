"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, useInView, AnimatePresence } from "framer-motion";

const PALETTE = {
  bg: "bg-black",
  text: "text-white",
  subtext: "text-neutral-400",
  border: "border-white/15",
};

const inputClass =
  "rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-white/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-white/10";

const primaryButton =
  "rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:bg-neutral-200 active:scale-[0.98]";

const secondaryButton =
  "rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]";

function SmartImg({
  sources,
  alt,
  className,
  priority = false,
}: {
  sources: string[];
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [failedAll, setFailedAll] = useState(false);
  const src = sources[idx];

  if (!src || failedAll) {
    return (
      <div
        className={
          "flex items-center justify-center bg-white/5 text-xs text-red-300 " +
          (className || "")
        }
      >
        Missing image
      </div>
    );
  }

  return (
    <div className={("relative overflow-hidden " + (className || "")).trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={
          (className || "").includes("object-contain")
            ? "object-contain"
            : "object-cover"
        }
        onError={() => {
          if (idx < sources.length - 1) setIdx(idx + 1);
          else setFailedAll(true);
        }}
      />
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.65, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const heroSlides: string[][] = [
  ["/soap-sunset.jpeg"],
  ["/polish-black.jpeg"],
  ["/gold-wheels.jpeg"],
  ["/Red-Light.jpeg"],
];

function HeroSlideshow({
  onSelectPackage,
}: {
  onSelectPackage: (pkg: string) => void;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[92vh] w-full isolate overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <SmartImg
            sources={heroSlides[i]}
            alt="Detailing showcase"
            className="absolute inset-0 h-full w-full object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(to_bottom,rgba(0,0,0,0.22),rgba(0,0,0,0.86))]" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-xl"
        >
          Mobile detailing in Minneapolis
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="max-w-4xl text-5xl font-black tracking-[-0.06em] leading-[0.9] md:text-7xl"
        >
          VEHICLE DETAILING
          <br /> IN MINNEAPOLIS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg"
        >
          Premium interior restoration, exterior detailing, ceramic protection, and fleet services delivered right to your driveway.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <a
            href="#booking"
            onClick={() => onSelectPackage("General Booking")}
            className={primaryButton}
          >
            Book Today
          </a>
          <a href="#services" className={secondaryButton}>
            Explore Services
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-xl">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={[
              "h-2 rounded-full transition-all",
              i === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70",
            ].join(" ")}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function PackagesSection({ onSelectPackage }: { onSelectPackage: (pkg: string) => void }) {
  type SizeKey = "2-door" | "4-door" | "suv" | "large";

  const baseTiers = [
    {
      title: "BRONZE",
      features: [
        "Exterior rinse",
        "Foam cannon",
        "Two-bucket hand wash",
        "Hand dry",
        "Tires dressed",
        "Trash removal",
        "Surface wipe down",
        "Quick vacuum",
        "Windows cleaned",
      ],
      price: 150,
    },
    {
      title: "SILVER",
      features: [
        "Exterior rinse",
        "Foam cannon",
        "Two-bucket hand wash",
        "Hand dry",
        "Tires dressed",
        "Trash removal",
        "Surface wipe down",
        "Vacuum",
        "Leather cleaned",
        "Cloth seats shampooed",
        "Windows cleaned",
      ],
      price: 200,
    },
    {
      title: "GOLD",
      features: [
        "Everything in Silver",
        "Steam cleaning",
        "Leather cleaned & conditioned",
        "Carpets shampooed",
        "Door jambs cleaned",
        "Deep interior refresh",
      ],
      price: 250,
    },
    {
      title: "PLATINUM",
      features: [
        "Everything in Gold",
        "Maintenance option",
        "Weekly or biweekly wash",
        "Priority scheduling",
        "Best for repeat clients",
      ],
      price: 250,
    },
  ];

  const sizeAdj: Record<SizeKey, number> = {
    "2-door": 0,
    "4-door": 20,
    suv: 40,
    large: 60,
  };

  const [size, setSize] = useState<SizeKey>("2-door");

  const sizes: { key: SizeKey; label: string }[] = [
    { key: "2-door", label: "2 Door" },
    { key: "4-door", label: "4 Door" },
    { key: "suv", label: "SUV" },
    { key: "large", label: "Large" },
  ];

  return (
    <section id="packages" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="mb-5 text-xs font-medium tracking-[0.28em] text-white/50">
          CUSTOM PRICING
        </div>
        <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
          Browse packages
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">
          Choose your vehicle size and select the level of detail that fits your needs.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-xl md:grid-cols-4">
        {sizes.map((s) => {
          const active = s.key === size;
          return (
            <button
              key={s.key}
              onClick={() => setSize(s.key)}
              className={[
                "rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[0.98]",
                active
                  ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.18)]"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {baseTiers.map((tier, idx) => {
          const adj = tier.title === "PLATINUM" ? tier.price : tier.price + sizeAdj[size];
          const label =
            tier.title === "PLATINUM"
              ? `${tier.title} - ${size.toUpperCase()} (Initial $${adj})`
              : `${tier.title} - ${size.toUpperCase()} ($${adj})`;

          return (
            <Reveal key={tier.title} delay={idx * 0.04}>
              <motion.div
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.045] shadow-2xl shadow-black/40 backdrop-blur-xl"
              >
                <div className="px-6 pb-3 pt-7 text-center">
                  <h3 className="text-lg font-bold tracking-[0.18em]">{tier.title}</h3>
                </div>

                <div className="mx-6 border-t border-white/10" />

                <ul className="flex-1 px-6 py-6 space-y-2 text-sm text-neutral-300">
                  {tier.features.map((f) => (
                    <li key={f} className="text-center">
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="px-6 pb-5 text-center">
                  <div className="text-2xl font-bold">
                    {tier.title === "PLATINUM" ? `$${adj} Initial` : `$${adj}`}
                  </div>
                  {tier.title === "PLATINUM" && (
                    <div className="mt-1 text-xs text-neutral-400">
                      then $60 weekly / $90 biweekly
                    </div>
                  )}
                </div>

                <a
                  href="#booking"
                  onClick={() => onSelectPackage(label)}
                  className="mx-4 mb-4 rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-neutral-200 active:scale-[0.98]"
                >
                  Book Now
                </a>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function PricingGuidesSection({ onSelectPackage }: { onSelectPackage: (pkg: string) => void }) {
  type TabKey = "interior" | "ceramic" | "fleet";
  const [tab, setTab] = useState<TabKey>("interior");

  const interior = {
    tiers: [
      { name: "BRONZE", price: 75, rows: ["Trash removal", "Surface wipe down", "Quick vacuum", "Windows cleaned"] },
      { name: "SILVER", price: 100, rows: ["Trash removal", "Surface wipe down", "Vacuum", "Leather cleaned", "Cloth seats shampooed", "Windows cleaned"] },
      { name: "GOLD", price: 150, rows: ["Trash removal", "Surface wipe down", "Vacuum", "Steam cleaning", "Leather conditioned", "Seats shampooed", "Carpets shampooed", "Door jambs cleaned"] },
    ],
  };

  const ceramic = {
    rows: [
      { label: "Sedan", price: 550 },
      { label: "SUV", price: 700 },
      { label: "Full Size SUV / Truck", price: 800 },
    ],
    includes: [
      "Gentle hand car wash",
      "Clay bar treatment",
      "Iron deposit cleanse",
      "Paint correction",
      "9 year ceramic coating",
    ],
  };

  const fleet = {
    subtitle: "DEALERSHIP & FLEET CONTRACTS",
    description:
      "Built for dealerships, commercial fleets, rideshare vehicles, work trucks, rental fleets, and delivery vehicles.",
    includes: [
      "Exterior wash + wheels",
      "Full interior vacuum",
      "Dashboard + console wipe down",
      "Windows inside & out",
      "Light stain removal",
      "Optional add-ons available",
    ],
    tiers: [
      { label: "5-10 Vehicles", note: "Starting at", price: 120 },
      { label: "11-25 Vehicles", note: "Starting at", price: 100 },
      { label: "26+ Vehicles", note: "Starting at", price: 80 },
    ],
  };

  return (
    <section id="price-guides" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="text-4xl font-black tracking-[-0.04em]">Pricing guides</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">
          View interior, ceramic coating, and commercial fleet pricing in one place.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-xl md:w-[760px]">
        {[
          { key: "interior" as TabKey, label: "Interior" },
          { key: "ceramic" as TabKey, label: "Ceramic" },
          { key: "fleet" as TabKey, label: "Fleet" },
        ].map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                "rounded-2xl px-4 py-3 text-xs font-bold transition md:text-sm",
                active ? "bg-white text-black" : "text-white/65 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/15 bg-white/[0.045] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-6">
        <AnimatePresence mode="wait">
          {tab === "interior" && (
            <motion.div
              key="interior"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {interior.tiers.map((t) => (
                <div key={t.name} className="overflow-hidden rounded-3xl border border-white/10 bg-black/35">
                  <div className="px-5 pt-5 text-center">
                    <h3 className="text-lg font-bold tracking-[0.18em]">{t.name}</h3>
                  </div>
                  <div className="mx-5 my-4 border-t border-white/10" />
                  <ul className="px-5 pb-4">
                    {t.rows.map((r) => (
                      <li key={r} className="border-b border-white/10 py-2 text-sm text-neutral-300 last:border-b-0">
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="px-5 pb-4 text-center text-2xl font-bold">${t.price}</div>
                  <a
                    href="#booking"
                    onClick={() => onSelectPackage(`Interior ${t.name} ($${t.price})`)}
                    className="block bg-white/10 px-5 py-3 text-center text-sm font-bold transition hover:bg-white hover:text-black"
                  >
                    Book Now
                  </a>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "ceramic" && (
            <motion.div
              key="ceramic"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                <h3 className="text-lg font-bold tracking-wide">Pricing</h3>
                <div className="my-4 border-t border-white/10" />
                {ceramic.rows.map((r) => (
                  <div key={r.label} className="flex justify-between border-b border-white/10 py-3 text-sm last:border-b-0">
                    <span className="text-neutral-300">{r.label}</span>
                    <span className="font-bold">${r.price}</span>
                  </div>
                ))}
                <a
                  href="#booking"
                  onClick={() => onSelectPackage("Ceramic Coating - Request")}
                  className="mt-5 block rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-neutral-200"
                >
                  Request Ceramic Quote
                </a>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                <h3 className="text-lg font-bold tracking-wide">Includes</h3>
                <div className="my-4 border-t border-white/10" />
                {ceramic.includes.map((i) => (
                  <div key={i} className="border-b border-white/10 py-3 text-sm text-neutral-300 last:border-b-0">
                    {i}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "fleet" && (
            <motion.div
              key="fleet"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                <h3 className="text-lg font-bold tracking-wide">{fleet.subtitle}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{fleet.description}</p>
                <div className="my-4 border-t border-white/10" />
                {fleet.includes.map((i) => (
                  <div key={i} className="border-b border-white/10 py-3 text-sm text-neutral-300 last:border-b-0">
                    {i}
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                <h3 className="text-lg font-bold tracking-wide">Fleet Pricing</h3>
                <div className="my-4 border-t border-white/10" />
                {fleet.tiers.map((t) => (
                  <div key={t.label} className="flex justify-between border-b border-white/10 py-3 text-sm last:border-b-0">
                    <span className="text-neutral-300">{t.label}</span>
                    <span className="font-bold">{t.note} ${t.price}</span>
                  </div>
                ))}
                <a
                  href="#booking"
                  onClick={() => onSelectPackage("Fleet / Dealership Contract")}
                  className="mt-5 block rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-neutral-200"
                >
                  Contact For Contract
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Home() {
  const [inq, setInq] = useState({ name: "", email: "", phone: "", vehicle: "", message: "", company: "" });
  const [inqBusy, setInqBusy] = useState(false);
  const [inqOK, setInqOK] = useState(false);
  const [inqErr, setInqErr] = useState<string | null>(null);

  const [bk, setBk] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    package: "Interior + Exterior",
    company: "",
  });
  const [bkBusy, setBkBusy] = useState(false);
  const [bkOK, setBkOK] = useState(false);
  const [bkErr, setBkErr] = useState<string | null>(null);

  const [year, setYear] = useState<string>("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => setYear(String(new Date().getFullYear())), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSelectPackage(pkg: string) {
    setBk((v) => ({ ...v, package: pkg }));
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (inq.company) return;
    if (!validEmail(inq.email)) return setInqErr("Please enter a valid email.");

    setInqBusy(true);
    setInqErr(null);

    const payload = {
      name: inq.name,
      email: inq.email,
      phone: inq.phone,
      vehicle: inq.vehicle,
      message: inq.message,
    };

    const { error } = await supabase.from("customer_inquiries").insert([payload]);

    setInqBusy(false);
    if (error) return setInqErr(error.message);

    setInqOK(true);
    setInq({ name: "", email: "", phone: "", vehicle: "", message: "", company: "" });
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (bk.company) return;
    if (!validEmail(bk.email)) return setBkErr("Please enter a valid email.");

    setBkBusy(true);
    setBkErr(null);

    const payload = {
      name: bk.name,
      email: bk.email,
      phone: bk.phone,
      vehicle: bk.vehicle,
      package: bk.package,
    };

    const { error } = await supabase.from("bookings").insert([payload]);

    setBkBusy(false);
    if (error) return setBkErr(error.message);

    setBkOK(true);
    setBk({ name: "", email: "", phone: "", vehicle: "", package: "Interior + Exterior", company: "" });
  }

  const gallery = [
    ["/before-after-mats.jpeg"],
    ["/before-after-seat.jpeg"],
    ["/before-after-trunk.jpeg"],
    ["/before-after-door.jpeg"],
    ["/Mold-removal.jpeg"],
    ["/interior.jpeg"],
  ];

  return (
    <main className={`${PALETTE.bg} ${PALETTE.text} overflow-hidden`}>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" prefetch={false} className="flex items-center gap-3">
            <SmartImg
              sources={["/logo-ac.png", "/logo-ac.jpeg"]}
              alt="AC Detailing & Cleaning"
              className="h-9 w-[140px] object-contain"
            />
            <span className="hidden font-semibold tracking-tight sm:block">AC Detailing</span>
          </Link>

          <nav className="hidden gap-7 text-sm text-white/70 md:flex">
            {[
              ["Services", "#services"],
              ["Packages", "#packages"],
              ["Pricing", "#price-guides"],
              ["Results", "#results"],
              ["Gallery", "#gallery"],
              ["Reviews", "#reviews"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="transition hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <a href="#booking" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl transition hover:bg-white hover:text-black">
            Book Now
          </a>
        </div>
      </header>

      <HeroSlideshow onSelectPackage={handleSelectPackage} />

      <section id="services" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.04em]">Services</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">
            Clean interiors, glossy exteriors, protection packages, and contract detailing for businesses.
          </p>
        </Reveal>

        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {[
            { t: "Express Wash", d: "Foam wash, wheels, windows, and quick interior tidy." },
            { t: "Interior + Exterior", d: "Deep interior clean with shampoo, steam, and exterior finish." },
            { t: "Platinum Detail", d: "Decon, polish, trim dress, tires, and full interior restoration." },
          ].map((s, idx) => (
            <Reveal key={s.t} delay={idx * 0.05}>
              <motion.div
                whileHover={{ y: -8, scale: 1.015 }}
                className={`rounded-[2rem] border bg-white/[0.04] p-7 backdrop-blur-xl transition ${PALETTE.border}`}
              >
                <h3 className="text-lg font-bold">{s.t}</h3>
                <p className={`mt-3 text-sm leading-6 ${PALETTE.subtext}`}>{s.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <PackagesSection onSelectPackage={handleSelectPackage} />

      <PricingGuidesSection onSelectPackage={handleSelectPackage} />

      <section id="results" className="bg-neutral-950 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-center text-4xl font-black tracking-[-0.04em]"
        {/* CUSTOMER RESULTS */}
<section id="results" className="py-24 bg-neutral-950">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-extrabold tracking-tight text-center mb-16">
      Customer Results
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { srcs: ["/before-after-seat.jpeg"], caption: "Interior Seat Restoration" },
        { srcs: ["/before-after-mats.jpeg"], caption: "Floor Mat Deep Clean" },
        { srcs: ["/before-after-door.jpeg"], caption: "Door Panel Refresh" },
        { srcs: ["/before-after-trunk.jpeg"], caption: "Full Trunk Cleanout" },
        { srcs: ["/interior.jpeg"], caption: "Interior Refresh" },
        { srcs: ["/Mold-removal.jpeg"], caption: "Mold Removal" },
      ].map((card) => (
        <div
          key={card.caption}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black"
        >
          {/* Image */}
          <SmartImg
            sources={card.srcs}
            alt={card.caption}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition" />

          {/* Text */}
          <div className="absolute bottom-0 w-full p-4">
            <p className="text-sm text-white/90 font-medium">
              {card.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      <section id="gallery" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.04em]">Gallery</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((srcs, idx) => (
            <Reveal key={srcs[0]} delay={idx * 0.04}>
              <motion.button
                whileHover={{ y: -6, scale: 1.015 }}
                onClick={() => setLightbox(srcs[0])}
                className="block w-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04]"
              >
                <SmartImg sources={srcs} alt="Gallery image" className="h-44 w-full object-cover md:h-60" />
              </motion.button>
            </Reveal>
          ))}
        </div>

        <AnimatePresence>
          {lightbox && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className="relative h-[82vh] w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                <SmartImg sources={[lightbox]} alt="Expanded view" className="h-full w-full rounded-[2rem] object-contain" />
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white hover:text-black"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="reviews" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.04em]">Reviews</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { q: "Interior looked brand new. Professional and punctual.", n: "Michael Z." },
            { q: "Carpet looked brand new and glass was crystal clear. Highly recommend.", n: "Eileen C." },
            { q: "Black paint has depth again, polish made a huge difference.", n: "Anthony L." },
            { q: "They came right to my driveway and made my SUV spotless inside and out.", n: "Sandy C." },
            { q: "Attention to detail was top-notch. The wax made my car look better than the dealership finish.", n: "Theodore L." },
            { q: "Great communication and results. Will definitely schedule regular cleanings.", n: "Karen C." },
          ].map((t, idx) => (
            <Reveal key={t.n} delay={idx * 0.04}>
              <motion.figure
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <blockquote className="text-sm leading-6 text-white/85">“{t.q}”</blockquote>
                <figcaption className="mt-4 text-xs text-neutral-400">- {t.n}</figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.04em]">Get a free quote</h2>
        </Reveal>

        <form onSubmit={submitInquiry} className="mt-8 grid grid-cols-1 gap-3 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl md:grid-cols-2">
          <input className="hidden" tabIndex={-1} autoComplete="off" value={inq.company} onChange={(e) => setInq((v) => ({ ...v, company: e.target.value }))} />
          <input className={inputClass} placeholder="Name" required value={inq.name} onChange={(e) => setInq((v) => ({ ...v, name: e.target.value }))} />
          <input className={inputClass} type="email" placeholder="Email" required value={inq.email} onChange={(e) => setInq((v) => ({ ...v, email: e.target.value }))} />
          <input className={inputClass} placeholder="Phone" value={inq.phone} onChange={(e) => setInq((v) => ({ ...v, phone: e.target.value }))} />
          <input className={inputClass} placeholder="Vehicle (Make/Model/Year)" value={inq.vehicle} onChange={(e) => setInq((v) => ({ ...v, vehicle: e.target.value }))} />
          <textarea className={`${inputClass} md:col-span-2`} rows={5} placeholder="Tell us what you need" required value={inq.message} onChange={(e) => setInq((v) => ({ ...v, message: e.target.value }))} />

          <div className="md:col-span-2 flex items-center gap-4">
            <button disabled={inqBusy} className={primaryButton}>
              {inqBusy ? "Sending..." : "Send"}
            </button>
            {inqOK && <span className="text-sm text-emerald-400">Thanks, we will be in touch shortly.</span>}
            {inqErr && <span className="text-sm text-red-400">{inqErr}</span>}
          </div>
        </form>
      </section>

      <section id="booking" className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.04em]">Schedule your detail</h2>
        </Reveal>

        <form onSubmit={submitBooking} className="mt-8 grid grid-cols-1 gap-3 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl md:grid-cols-2">
          <input className="hidden" tabIndex={-1} autoComplete="off" value={bk.company} onChange={(e) => setBk((v) => ({ ...v, company: e.target.value }))} />
          <input className={inputClass} placeholder="Full Name" required value={bk.name} onChange={(e) => setBk((v) => ({ ...v, name: e.target.value }))} />
          <input className={inputClass} type="email" placeholder="Email" required value={bk.email} onChange={(e) => setBk((v) => ({ ...v, email: e.target.value }))} />
          <input className={inputClass} placeholder="Phone (SMS)" value={bk.phone} onChange={(e) => setBk((v) => ({ ...v, phone: e.target.value }))} />
          <input className={inputClass} placeholder="Vehicle (Make/Model/Year)" value={bk.vehicle} onChange={(e) => setBk((v) => ({ ...v, vehicle: e.target.value }))} />
          <input className={inputClass} placeholder="Selected Package" value={bk.package} onChange={(e) => setBk((v) => ({ ...v, package: e.target.value }))} />

          <div className="md:col-span-2 flex items-center gap-4">
            <button disabled={bkBusy} className={primaryButton}>
              {bkBusy ? "Sending..." : "Request Appointment"}
            </button>
            {bkOK && <span className="text-sm text-emerald-400">We will confirm by email/text.</span>}
            {bkErr && <span className="text-sm text-red-400">{bkErr}</span>}
          </div>
        </form>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-neutral-400 md:flex-row">
          <div>© {year || ""} AC Detailing & Cleaning</div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#packages" className="hover:text-white">Packages</a>
            <a href="#price-guides" className="hover:text-white">Pricing</a>
            <a href="#results" className="hover:text-white">Results</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <a href="#booking" className="hover:text-white">Book</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
