const $ = (s) => document.querySelector(s),
        $$ = (s) => [...document.querySelectorAll(s)];
      const nav = $("#nav"),
        lk = $("#lk"),
        bg = $("#bg");
      addEventListener(
        "scroll",
        () => nav.classList.toggle("s", scrollY > 40),
        { passive: true },
      );
      bg.onclick = () => {
        const o = lk.classList.toggle("open");
        bg.setAttribute("aria-expanded", o);
      };
      $$(".links a").forEach(
        (a) =>
          (a.onclick = () => {
            lk.classList.remove("open");
            bg.setAttribute("aria-expanded", false);
          }),
      );

      /* loop */
      const names = [
          "Intake",
          "Screening",
          "Biological",
          "Filtration",
          "Disinfection",
          "Reuse",
        ],
        C = 250,
        R = 190,
        N = 6;
      const nodes = $("#nodes");
      names.forEach((n, i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180,
          x = C + R * Math.cos(a),
          y = C + R * Math.sin(a);
        const tx = C + (R + 44) * Math.cos(a),
          ty = C + (R + 44) * Math.sin(a) + 4;
        nodes.insertAdjacentHTML(
          "beforeend",
          `<g class="node"><circle cx="${x}" cy="${y}" r="13"/><text x="${tx}" y="${ty}" text-anchor="${Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end"}">${n}</text></g>`,
        );
      });
      const ns = $$(".node"),
        st = $$(".stage"),
        arc = $("#arc"),
        dot = $("#dot"),
        dot2 = $("#dot2"),
        ntu = $("#ntu"),
        loop = $("#process");
      const turb = [480, 360, 90, 4, 0.5, 0.2];
      let cur = -1;
      function upd() {
        const r = loop.getBoundingClientRect(),
          p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
        arc.style.strokeDashoffset = 1194 * (1 - p);
        const a = ((-90 + p * 360) * Math.PI) / 180,
          x = C + R * Math.cos(a),
          y = C + R * Math.sin(a);
        [dot, dot2].forEach((d) => {
          d.setAttribute("cx", x);
          d.setAttribute("cy", y);
        });
        const idx = Math.min(N - 1, Math.floor(p * N + 0.02));
        const f = p * N - idx,
          t0 = turb[idx],
          t1 = turb[Math.min(N - 1, idx + 1)];
        ntu.textContent = (
          t0 +
          (t1 - t0) * Math.min(1, Math.max(0, f))
        ).toFixed(t0 < 5 ? 1 : 0);
        if (idx !== cur) {
          cur = idx;
          st.forEach((s, i) => s.classList.toggle("on", i === idx));
          ns.forEach((n, i) => {
            n.classList.toggle("on", i === idx);
            n.classList.toggle("done", i < idx);
          });
        }
        const e = Math.max(0, Math.min(1, p));
        dot.setAttribute("opacity", 0.4 + 0.5 * e);
        document.documentElement.style.setProperty("--p", p);
      }
      addEventListener("scroll", upd, { passive: true });
      addEventListener("resize", upd);
      upd();

      /* counters */
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            const el = e.target,
              n = +el.dataset.n,
              s = el.dataset.s || "",
              t0 = performance.now();
            (function f(t) {
              const k = Math.min(1, (t - t0) / 1800),
                v = Math.round(n * (1 - Math.pow(1 - k, 4)));
              el.textContent = v + s;
              if (k < 1) requestAnimationFrame(f);
            })(t0);
          }),
        { threshold: 0.6 },
      );
      $$("[data-n]").forEach((e) => io.observe(e));

      /* calculator */
      const f = $("#f"),
        r = $("#r");
      function calc() {
        const fl = +f.value,
          rr = +r.value;
        $("#fo").textContent = fl.toLocaleString() + " kL";
        $("#ro").textContent = rr + "%";
        const ml = (fl * 365 * rr) / 100 / 1000;
        $("#ra").textContent = ml.toLocaleString(undefined, {
          maximumFractionDigits: 1,
        });
        $("#rp").textContent = Math.round(ml / 2.5).toLocaleString();
        $("#tk").style.width = rr + "%";
      }
      f.oninput = r.oninput = calc;
      calc();

      
      /* water scene */
      (() => {
        const g = $("#wv"),
          n = 11;

        for (let i = 0; i < n; i++) {
          const e = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "ellipse",
          );

          e.setAttribute("cx", 400);
          e.setAttribute("cy", 372);
          e.setAttribute("rx", 390);
          e.setAttribute("ry", 86);
          e.style.setProperty("--k", i);
          g.appendChild(e);
        }

        const sc = $("#scene"),
          h = $("#top");

        h.addEventListener("mousemove", (e) => {
          const x = (e.clientX / innerWidth - 0.5) * -18,
            y = (e.clientY / innerHeight - 0.5) * -10;

          sc.style.transform = `translate(${x}px,${y}px)`;
        });
      })();

      
      /* form */
      $("#fm").onsubmit = (e) => {
        e.preventDefault();
        $("#ok").textContent =
          "Thanks. An engineer will email you within one working day.";
        e.target.reset();
      };