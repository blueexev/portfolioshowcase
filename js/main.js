/* =====================================================================
   VAISHNAVI VENKATESH PORTFOLIO — one script for every page.
   Every feature checks that its elements exist, so it is safe everywhere.
   ===================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- page transitions: ink curtain slides over, next page uncovers ---------- */
  var curtain = document.createElement("div");
  curtain.className = "curtain";
  document.body.appendChild(curtain);
  try { sessionStorage.removeItem("vv-t"); } catch (e) {}
  if (root.classList.contains("arriving")) setTimeout(function () { root.classList.remove("arriving"); }, 900);

  var leaving = false;
  function goTo(url) {
    if (leaving) return;
    leaving = true;
    if (reduced) { location.href = url; return; }
    try { sessionStorage.setItem("vv-t", "1"); } catch (e) {}
    curtain.classList.add("on");
    setTimeout(function () { location.href = url; }, 620);
  }
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) { curtain.classList.remove("on"); leaving = false; }
  });
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    var h = a.getAttribute("href");
    if (!h || h.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(h)) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.protocol !== location.protocol || u.host !== location.host) return;
    if (u.pathname === location.pathname && u.hash) return;
    e.preventDefault();
    goTo(a.href);
  });
  if ($("[data-go]")) {
    addEventListener("keydown", function (e) {
      if (e.key === "Enter") goTo($("[data-go]").href);
    });
  }

  /* ---------- circle cursor ---------- */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    var c = $(".cursor");
    if (!c) { c = document.createElement("div"); c.className = "cursor"; document.body.appendChild(c); }
    root.classList.add("has-cursor");
    var x = -99, y = -99, cx = -99, cy = -99, seen = false;
    addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      if (!seen) { seen = true; cx = x; cy = y; c.style.opacity = 1; }
      c.classList.toggle("hot", !!e.target.closest("a,button"));
    });
    document.addEventListener("mouseleave", function () { c.style.opacity = 0; seen = false; });
    (function f() {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      c.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(f);
    })();
  }

  /* ---------- scroll reveal ---------- */
  if ("IntersectionObserver" in window && !reduced) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        rio.unobserve(e.target);
        if (e.target.classList.contains("proj")) updateProj();
      });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    $$(".csec, .meta > div, .work > h2, .pn, .reveal").forEach(function (el) {
      el.classList.add("reveal");
      rio.observe(el);
    });
    $$(".proj").forEach(function (el) { rio.observe(el); });
  } else {
    $$(".proj").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- home: the tile in the middle of the screen is solid ---------- */
  var tiles = $$("#work .tile");
  function updateTiles() {
    var mid = innerHeight / 2, best = null, bd = Infinity;
    tiles.forEach(function (t) {
      var r = t.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bd) { bd = d; best = t; }
    });
    tiles.forEach(function (t) {
      var r = t.getBoundingClientRect();
      t.classList.toggle("is-active", t === best);
      t.classList.toggle("is-near", t !== best && r.bottom > 0 && r.top < innerHeight);
    });
  }
  /* old work page: .proj showcase */
  var projs = $$(".proj");
  function updateProj() {
    if (!projs.length) return;
    var mid = innerHeight / 2, best = null, bd = Infinity;
    projs.forEach(function (p) {
      var r = p.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bd) { bd = d; best = p; }
    });
    projs.forEach(function (p) { p.classList.toggle("active", p === best && p.classList.contains("in")); });
  }
  function onScroll() { requestAnimationFrame(function () { if (tiles.length) updateTiles(); updateProj(); }); }
  if (tiles.length || projs.length) {
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- home: "Hi" in different languages ---------- */
  var hi = document.getElementById("hi");
  if (hi && !reduced) {
    var words = ["Hi", "Namaste", "Namaskaram", "Vanakkam", "Kasa kay", "Hi"], i = 0;
    setTimeout(function () {
      var t = setInterval(function () {
        i++;
        hi.style.opacity = 0; hi.style.transform = "translateY(-14px)";
        setTimeout(function () {
          hi.textContent = words[i];
          hi.style.transition = "none"; hi.style.transform = "translateY(14px)";
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              hi.style.transition = ""; hi.style.opacity = 1; hi.style.transform = "none";
            });
          });
        }, 200);
        if (i >= words.length - 1) clearInterval(t);
      }, 1100);
    }, 1400);
  }

  /* ---------- case study: highlight the section you are reading ---------- */
  var cnav = $(".case-nav");
  if (cnav && "IntersectionObserver" in window) {
    var links = $$("a", cnav);
    var mark = function (id) { links.forEach(function (l) { l.classList.toggle("on", l.hash === "#" + id); }); };
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    links.forEach(function (l) {
      var s = l.hash && $(l.hash);
      if (s) spy.observe(s);
      l.addEventListener("click", function () { mark(l.hash.slice(1)); });
    });
  }

  /* ---------- carousels: arrows, keyboard, swipe; missing pictures are skipped ---------- */
  $$(".carousel").forEach(function (cr) {
    var count = $(".count", cr), n = 0;
    var slides = function () { return $$(".slide", cr); };
    function render() {
      var s = slides();
      cr.classList.toggle("is-empty", s.length === 0);
      cr.classList.toggle("is-single", s.length <= 1);
      if (n >= s.length) n = 0;
      s.forEach(function (el, k) { el.classList.toggle("is-on", k === n); });
      if (count) count.textContent = s.length ? n + 1 + " / " + s.length : "";
    }
    function go(step) {
      var len = slides().length;
      if (!len) return;
      n = (n + step + len) % len;
      render();
    }
    var pv = $(".prev", cr), nx = $(".next", cr);
    if (pv) pv.addEventListener("click", function () { go(-1); });
    if (nx) nx.addEventListener("click", function () { go(1); });
    cr.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
    var x0 = null;
    cr.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    cr.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      x0 = null;
    });
    slides().forEach(function (s) {
      var img = $("img", s);
      if (!img) return;
      var drop = function () { s.remove(); render(); };
      img.addEventListener("error", drop);
      if (img.complete && img.naturalWidth === 0) drop();
    });
    render();
  });

  /* ---------- slice of life: folder (photos fly out on scroll) ---------- */
  var folder = $(".folder");
  if (folder) {
    var ph = $$(".f-ph", folder);
    var dx = [-0.4, -0.27, -0.14, -0.02, 0.12, 0.26, 0.4, 0.0],
        dy = [0.2, 0.5, 0.3, 0.64, 0.28, 0.52, 0.22, 0.38],
        rt = [-14, -8, -5, 4, 9, -6, 13, -3];
    var draw = function () {
      var r = folder.getBoundingClientRect(), vh = innerHeight;
      var p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.6)));
      ph.forEach(function (el, k) {
        el.style.transform = "translate(-50%,0) translate(" + dx[k] * p * r.width + "px," + -dy[k] * p * r.height +
          "px) rotate(" + rt[k] * (0.25 + 0.75 * p) + "deg) scale(" + (0.88 + 0.12 * p) + ")";
      });
    };
    addEventListener("scroll", function () { requestAnimationFrame(draw); }, { passive: true });
    addEventListener("resize", draw);
    draw();
  }

  /* ---------- slice of life: widgets (edit the values below) ---------- */
  var SLICE = {
    notice: ["chipped paint on old doors", "how people hold their chai", "shadows at 4 pm", "hand-painted shop signs", "small kindnesses from strangers"],
    countdownLabel: "Next adventure",
    countdownDate: "2027-01-01T00:00:00+05:30",
    songLength: 178
  };
  if ($(".board")) {
    var nt = $("#notice"), k = 0;
    if (nt) {
      nt.textContent = SLICE.notice[0];
      if (!reduced) setInterval(function () {
        nt.classList.add("out");
        setTimeout(function () { k = (k + 1) % SLICE.notice.length; nt.textContent = SLICE.notice[k]; nt.classList.remove("out"); }, 260);
      }, 2600);
    }
    var pl = $(".w-play"), pb = $("#playBtn");
    if (pl && pb) {
      var fill = $(".bar i", pl), tm = $(".cur", pl), sec = 0, timer = null;
      var fm = function (s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
      $(".len", pl).textContent = fm(SLICE.songLength);
      pb.addEventListener("click", function () {
        if (timer) { clearInterval(timer); timer = null; pl.classList.remove("on"); pb.textContent = "Play"; return; }
        pl.classList.add("on"); pb.textContent = "Pause";
        timer = setInterval(function () {
          sec = (sec + 1) % SLICE.songLength;
          fill.style.width = (sec / SLICE.songLength) * 100 + "%";
          tm.textContent = fm(sec);
        }, 1000);
      });
    }
    $$(".todo button").forEach(function (b) {
      b.addEventListener("click", function () {
        var li = b.parentNode;
        li.classList.toggle("done");
        $(".box", b).textContent = li.classList.contains("done") ? "[x]" : "[ ]";
      });
    });
    var cl = $("#cdLabel"), d = $("#cd"), clk = $("#clock");
    if (cl && d && clk) {
      cl.textContent = SLICE.countdownLabel;
      var tick = function () {
        var ms = Math.max(0, new Date(SLICE.countdownDate) - new Date());
        var dd = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, mm = Math.floor(ms / 6e4) % 60;
        d.innerHTML = "<div>" + dd + "<small>days</small></div><div>" + String(hh).padStart(2, "0") + "<small>hrs</small></div><div>" + String(mm).padStart(2, "0") + "<small>min</small></div>";
        clk.textContent = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
      };
      tick(); setInterval(tick, 1000);
    }
    var chai = $(".chai"), cups = 0;
    if (chai) chai.addEventListener("click", function () {
      cups++; $("b", chai).textContent = cups;
      chai.classList.remove("pop"); void chai.offsetWidth; chai.classList.add("pop");
    });
    var stack = $(".stack");
    if (stack) {
      var pols = Array.prototype.slice.call(stack.children), order = pols.map(function (_, j) { return j; });
      var lay = function () { order.forEach(function (idx, pos) { pols[idx].dataset.p = pos; }); };
      lay();
      stack.addEventListener("click", function () { order.push(order.shift()); lay(); });
    }
  }
})();