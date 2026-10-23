// Product detail view (click a product card) + catalog cleanup. Loaded after script.js.
(() => {
  const WA = '918770475200';
  // 1) Keep ONLY listings with clean product photos (the Marino sweaters).
  //    All reel/video screenshots (play-button images) are removed from the catalog.
  products.splice(0, products.length, ...products.filter(p => p.id.startsWith('marino')));

  // 2) Gallery: add MORE REAL photos per product, e.g. 'marino-cream': ['assets/marino-cream-back.jpg']
  const gallery = {};
  products.forEach(p => { p.images = [p.image, ...(gallery[p.id] || [])]; });
  filter = 'all';
  renderFilters();
  renderProducts();

  // 3) Product detail modal
  const wrap = document.createElement('div');
  wrap.className = 'pd-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  document.body.appendChild(wrap);
  let cur = null, size = null, idx = 0;

  function open(p) {
    cur = p; size = selectedSizes[p.id] || defaultSize(p); idx = 0;
    draw();
    wrap.classList.add('open');
    wrap.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
  function close() {
    wrap.classList.remove('open');
    wrap.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
  function draw() {
    const p = cur;
    const disc = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
    const thumbs = p.images.length > 1
      ? `<div class="pd-thumbs">${p.images.map((s, i) => `<button type="button" class="${i === idx ? 'on' : ''}" data-i="${i}" aria-label="Photo ${i + 1}"><img src="${s}" alt=""></button>`).join('')}</div>` : '';
    wrap.innerHTML = `<section class="pd" role="dialog" aria-modal="true" aria-label="${p.name}">
      <button type="button" class="pd-x" data-x aria-label="Close">×</button>
      <div class="pd-media"><div class="pd-main"><img src="${p.images[idx]}" alt="${p.name} in ${p.color}"></div>${thumbs}</div>
      <div class="pd-body">
        <div class="product-category">${p.category}</div>
        <h2>${p.name}</h2>
        <p class="pd-sub">Colour: ${p.color} · ${p.fit.replace(' · sample', '').replace(' · verify', '')}</p>
        <div class="price-row"><span class="price">${money(p.price)}</span>${disc ? `<span class="mrp">${money(p.mrp)}</span><span class="discount">${disc}% off</span>` : ''}</div>
        ${p.demo ? '<p class="pd-note">Sample price. Confirm the exact price and stock on WhatsApp.</p>' : ''}
        <div class="pd-label">Select size: <strong>${size}</strong></div>
        <div class="pd-sizes">${p.sizes.map(s => `<button type="button" class="${s === size ? 'on' : ''}" data-s="${s}">${s}</button>`).join('')}</div>
        <div class="pd-actions">
          <button type="button" data-act="add">Add to bag</button>
          <button type="button" class="pd-buy" data-act="buy">Buy now</button>
          <button type="button" class="pd-wa" data-act="wa">Order on WhatsApp</button>
        </div>
        <div class="pd-info"><strong>About this piece</strong><br>${p.description}<br><br>
          Pan-India delivery · Visit the store behind C21 Mall, Indore (daily 2–10PM).</div>
      </div></section>`;
  }

  wrap.addEventListener('click', e => {
    if (e.target === wrap || e.target.closest('[data-x]')) return close();
    const t = e.target.closest('[data-i]');
    if (t) { idx = +t.dataset.i; return draw(); }
    const s = e.target.closest('[data-s]');
    if (s) { size = s.dataset.s; selectedSizes[cur.id] = size; return draw(); }
    const a = e.target.closest('[data-act]')?.dataset.act;
    if (a === 'add') {
      addToBag(cur, size);
      const b = e.target.closest('[data-act]'); b.textContent = 'Added ✓';
      setTimeout(() => { if (b.isConnected) b.textContent = 'Add to bag'; }, 900);
    } else if (a === 'buy') {
      close(); showCheckout([{ id: cur.id, size, qty: 1 }]);
    } else if (a === 'wa') {
      const msg = `Hi Kefene! I'm interested in the ${cur.name} (${cur.color}), size ${size}. Is it available?`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    } else if (e.target.closest('.pd-main')) {
      e.target.closest('.pd-main').classList.toggle('zoom');
    }
  });
  wrap.addEventListener('mousemove', e => {
    const m = e.target.closest('.pd-main'); if (!m) return;
    const r = m.getBoundingClientRect();
    m.querySelector('img').style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Card click (photo/name/text) opens detail; size/add/buy buttons keep working.
  grid.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    const card = e.target.closest('.product-card'); if (!card) return;
    const p = products.find(x => x.id === card.dataset.product);
    if (p) open(p);
  });
})();
