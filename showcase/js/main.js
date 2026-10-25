/* circle cursor (delete this block to use the normal arrow) */
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  document.documentElement.classList.add("has-cursor");
  const c = document.querySelector(".cursor");
  let x = -99,
    y = -99,
    cx = -99,
    cy = -99,
    seen = false;
  addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    if (!seen) {
      seen = true;
      cx = x;
      cy = y;
      c.style.opacity = 1;
    }
    c.classList.toggle("hot", !!e.target.closest("a,button"));
  });
  document.addEventListener("mouseleave", () => {
    c.style.opacity = 0;
    seen = false;
  });
  (function f() {
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(f);
  })();
}

/* scroll reveal; work tiles pop up one by one */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      if (el.classList.contains("tile")) {
        const i = [...document.querySelectorAll(".tile")].indexOf(el);
        el.style.transitionDelay = (i % 3) * 0.18 + "s";
        el.classList.add("in");
        setTimeout(() => (el.style.transitionDelay = ""), 1400);
      } else el.classList.add("in");
    }),
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal,.tile").forEach((el) => io.observe(el));

/* "Hi" in different languages, then stops on Hi. Edit the list to change it. */
const hi = document.getElementById("hi");
if (hi && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const words = ["Hi", "Namaste", "Namaskaram", "Vanakkam", "Kasa kay", "Hi"];
  let i = 0;
  setTimeout(() => {
    const t = setInterval(() => {
      i++;
      hi.style.opacity = 0;
      hi.style.transform = "translateY(-14px)";
      setTimeout(() => {
        hi.textContent = words[i];
        hi.style.transition = "none";
        hi.style.transform = "translateY(14px)";
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            hi.style.transition = "";
            hi.style.opacity = 1;
            hi.style.transform = "none";
          }),
        );
      }, 200);
      if (i >= words.length - 1) clearInterval(t);
    }, 1100);
  }, 1400);
}

/* slice of life folder: photos fly outwards as you scroll */
const folder = document.querySelector(".folder");
if (folder) {
  const ph = [...folder.querySelectorAll(".f-ph")];
  const dx = [-0.4, -0.27, -0.14, -0.02, 0.12, 0.26, 0.4, 0.0],
    dy = [0.2, 0.5, 0.3, 0.64, 0.28, 0.52, 0.22, 0.38],
    rt = [-14, -8, -5, 4, 9, -6, 13, -3];
  const draw = () => {
    const r = folder.getBoundingClientRect(),
      vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.6)));
    const W = r.width,
      H = r.height;
    ph.forEach((el, i) => {
      el.style.transform = `translate(-50%,0) translate(${dx[i] * p * W}px,${-dy[i] * p * H}px) rotate(${rt[i] * (0.25 + 0.75 * p)}deg) scale(${0.88 + 0.12 * p})`;
    });
  };
  addEventListener("scroll", () => requestAnimationFrame(draw), { passive: true });
  addEventListener("resize", draw);
  draw();
}

/* entry page: curtain wipe, then go */
const go = document.querySelector("[data-go]");
if (go) {
  const curtain = document.querySelector(".curtain");
  let left = false;
  const leave = (e) => {
    if (left) return;
    left = true;
    e && e.preventDefault();
    curtain.classList.add("on");
    setTimeout(() => (location.href = go.href), 720);
  };
  go.addEventListener("click", leave);
  addEventListener("keydown", (e) => {
    if (e.key === "Enter") leave();
  });
}

/* ---------- slice of life widgets (edit the values below) ---------- */
const SLICE = {
  notice: [
    "chipped paint on old doors",
    "how people hold their chai",
    "shadows at 4 pm",
    "hand-painted shop signs",
    "small kindnesses from strangers",
  ],
  countdownLabel: "Next adventure",
  countdownDate: "2027-01-01T00:00:00+05:30",
  songLength: 178,
};
if (document.querySelector(".board")) {
  /* rotating "currently noticing" */
  const n = document.querySelector("#notice");
  let k = 0;
  const show = () => {
    n.classList.add("out");
    setTimeout(() => {
      k = (k + 1) % SLICE.notice.length;
      n.textContent = SLICE.notice[k];
      n.classList.remove("out");
    }, 260);
  };
  n.textContent = SLICE.notice[0];
  if (!matchMedia("(prefers-reduced-motion:reduce)").matches) setInterval(show, 2600);

  /* cassette player (visual only) */
  const pl = document.querySelector(".w-play"),
    pb = document.querySelector("#playBtn"),
    fill = pl.querySelector(".bar i"),
    tm = pl.querySelector(".cur");
  let sec = 0,
    timer = null;
  const f = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  pl.querySelector(".len").textContent = f(SLICE.songLength);
  pb.addEventListener("click", () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      pl.classList.remove("on");
      pb.textContent = "Play";
      return;
    }
    pl.classList.add("on");
    pb.textContent = "Pause";
    timer = setInterval(() => {
      sec = (sec + 1) % SLICE.songLength;
      fill.style.width = (sec / SLICE.songLength) * 100 + "%";
      tm.textContent = f(sec);
    }, 1000);
  });

  /* tick-able to-do */
  document.querySelectorAll(".todo button").forEach((b) =>
    b.addEventListener("click", () => {
      const li = b.parentNode;
      li.classList.toggle("done");
      b.querySelector(".box").textContent = li.classList.contains("done") ? "[x]" : "[ ]";
    }),
  );

  /* countdown + live IST clock */
  document.querySelector("#cdLabel").textContent = SLICE.countdownLabel;
  const d = document.querySelector("#cd"),
    clk = document.querySelector("#clock");
  const tick = () => {
    let ms = Math.max(0, new Date(SLICE.countdownDate) - new Date());
    const dd = Math.floor(ms / 864e5),
      hh = Math.floor(ms / 36e5) % 24,
      mm = Math.floor(ms / 6e4) % 60;
    d.innerHTML = `<div>${dd}<small>days</small></div><div>${String(hh).padStart(2, "0")}<small>hrs</small></div><div>${String(mm).padStart(2, "0")}<small>min</small></div>`;
    clk.textContent = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  tick();
  setInterval(tick, 1000);

  /* chai counter */
  const chai = document.querySelector(".chai");
  let cups = 0;
  chai.addEventListener("click", () => {
    cups++;
    chai.querySelector("b").textContent = cups;
    chai.classList.remove("pop");
    void chai.offsetWidth;
    chai.classList.add("pop");
  });

  /* photo stack: click to shuffle */
  const stack = document.querySelector(".stack"),
    pols = [...stack.children];
  let order = pols.map((_, i) => i);
  const lay = () => order.forEach((idx, pos) => (pols[idx].dataset.p = pos));
  lay();
  stack.addEventListener("click", () => {
    order.push(order.shift());
    lay();
  });
}

/* case study: highlight the section you are reading */
const cnav = document.querySelector(".case-nav");
if (cnav) {
  const links = [...cnav.querySelectorAll("a")];
  const mark = (id) => links.forEach((l) => l.classList.toggle("on", l.hash === "#" + id));
  const spy = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) mark(e.target.id);
      }),
    { rootMargin: "-30% 0px -60% 0px" },
  );
  links.forEach((l) => {
    const s = document.querySelector(l.hash);
    if (s) spy.observe(s);
    l.addEventListener("click", () => mark(l.hash.slice(1)));
  });
}
