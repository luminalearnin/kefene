const products = [
  {id:'marino-cream',name:'Marino Knit Sweater',category:'Knitwear',color:'Whipped Creme',image:'assets/kefene-sweatshirt-03.jpeg',price:1999,mrp:2499,sizes:['S','M','L','XL'],fit:'Unisex fit',description:'A soft neutral layer for repeat-wear styling.',demo:false},
  {id:'marino-maroon',name:'Marino Knit Sweater',category:'Knitwear',color:'Maroon',image:'assets/kefene-sweatshirt-02.jpeg',price:1999,mrp:2499,sizes:['S','M','L','XL'],fit:'Unisex fit',description:'A rich colourway for a simple layered look.',demo:false},
  {id:'marino-classic',name:'Marino Knit Sweater',category:'Knitwear',color:'Classic Cream',image:'assets/kefene-sweatshirt-01.jpeg',price:1999,mrp:2499,sizes:['S','M','L','XL'],fit:'Unisex fit',description:'An easy everyday knit in a clean classic shade.',demo:false},
  {id:'tee-essential',name:'Essential Tee',category:'T-Shirts',color:'Ink Black',image:'assets/kefene-tee-black.jpg',price:1099,mrp:1099,sizes:['S','M','L','XL','XXL'],fit:'Easy fit · sample',description:'A clean short-sleeve staple from the KEFENE edit.',demo:true},
  {id:'tee-stripe',name:'Stripe Day Tee',category:'T-Shirts',color:'Ash Stripe',image:'assets/kefene-store-outfit.jpg',price:999,mrp:999,sizes:['S','M','L','XL','XXL'],fit:'Classic fit · sample',description:'A relaxed stripe for an uncomplicated everyday rotation.',demo:true},
  {id:'shirt-check',name:'Old-School Check Shirt',category:'Shirts',color:'Slate Grid',image:'assets/kefene-shirt-check.jpg',price:1699,mrp:1699,sizes:['M','L','XL','XXL'],fit:'Regular fit · sample',description:'Classic check pattern, styled for everyday wear.',demo:true},
  {id:'shirt-layered',name:'Layered Contrast Shirt',category:'Shirts',color:'Stone & Check',image:'assets/kefene-shirt-layered.jpg',price:1799,mrp:1799,sizes:['M','L','XL','XXL'],fit:'Easy fit · sample',description:'A layered look with a subtle contrast detail.',demo:true},
  {id:'denim-indigo',name:'Indigo Everyday Denim',category:'Denim',color:'Deep Indigo',image:'assets/kefene-store-outfit.jpg',price:2199,mrp:2199,sizes:['28','30','32','34','36'],fit:'Demo fit · verify',description:'An everyday denim concept from the broader KEFENE range.',demo:true},
  {id:'denim-wash',name:'Washed Denim',category:'Denim',color:'Mid Blue',image:'assets/kefene-store-outfit.jpg',price:2199,mrp:2199,sizes:['28','30','32','34','36'],fit:'Demo fit · verify',description:'A versatile blue wash for casual outfits.',demo:true},
  {id:'lower-everyday',name:'Everyday Lower',category:'Lowers',color:'Coal',image:'assets/kefene-store-outfit.jpg',price:1499,mrp:1499,sizes:['M','L','XL','XXL'],fit:'Easy fit · sample',description:'An easy lowerwear option for off-duty days.',demo:true},
  {id:'lower-track',name:'Track Lower',category:'Lowers',color:'Deep Navy',image:'assets/kefene-store-outfit.jpg',price:1599,mrp:1599,sizes:['M','L','XL','XXL'],fit:'Relaxed fit · sample',description:'A relaxed track-pant concept for everyday comfort.',demo:true},
  {id:'outerwear-arrival',name:'Just-Arrived Layer',category:'Outerwear',color:'Charcoal',image:'assets/kefene-outerwear-arrival.jpg',price:2499,mrp:2499,sizes:['M','L','XL','XXL'],fit:'Layering fit · sample',description:'A new-season outerwear look featured by KEFENE.',demo:true},
  {id:'outerwear-utility',name:'Layered Utility Jacket',category:'Outerwear',color:'Graphite',image:'assets/kefene-jacket-layered.jpg',price:2799,mrp:2799,sizes:['M','L','XL','XXL'],fit:'Easy fit · sample',description:'A dark layer with a clean, versatile silhouette.',demo:true},
  {id:'outerwear-detail',name:'Contrast Detail Jacket',category:'Outerwear',color:'Black',image:'assets/kefene-jacket-detail.jpg',price:2599,mrp:2599,sizes:['M','L','XL','XXL'],fit:'Layering fit · sample',description:'A statement outer layer from the current KEFENE edit.',demo:true}
];

const money=n=>'₹'+Number(n).toLocaleString('en-IN');
const getStored=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let cart=getStored('kefene-demo-bag',[]);
let selectedSizes={};
let filter='all';
let query='';
let checkoutLines=[];
const grid=document.getElementById('product-grid');
const empty=document.getElementById('empty-results');
const filterBar=document.getElementById('category-filters');
const bagCount=document.getElementById('bag-count');
const scrim=document.getElementById('scrim');
const drawer=document.getElementById('cart-drawer');
const accountModal=document.getElementById('account-modal');
const checkoutModal=document.getElementById('checkout-modal');

function defaultSize(p){return p.sizes.includes('M')?'M':p.sizes[Math.floor(p.sizes.length/2)]}
function renderFilters(){
  const counts=products.reduce((map,p)=>{map[p.category]=(map[p.category]||0)+1;return map},{ });
  const chips=[['all','All pieces',products.length],...Object.keys(counts).map(c=>[c,c,counts[c]])];
  filterBar.innerHTML=chips.map(([key,label,count])=>`<button class="filter-chip ${filter===key?'active':''}" type="button" data-filter="${key}">${label} <span>${count}</span></button>`).join('');
}
function renderProducts(){
  const items=products.filter(p=>{
    const matchesFilter=filter==='all'||p.category===filter;
    const text=[p.name,p.category,p.color,p.fit,p.description].join(' ').toLowerCase();
    return matchesFilter&&text.includes(query.trim().toLowerCase());
  });
  document.getElementById('result-count').textContent=`${items.length} ${items.length===1?'piece':'pieces'}`;
  empty.hidden=items.length>0;
  grid.innerHTML=items.map(p=>{
    const chosen=selectedSizes[p.id]||defaultSize(p);
    const discount=p.mrp>p.price?Math.round((1-p.price/p.mrp)*100):0;
    const badge=p.demo?'DEMO STYLE':`${discount}% OFF`;
    return `<article class="product-card" data-product="${p.id}">
      <div class="product-photo"><img src="${p.image}" alt="${p.name} in ${p.color}" loading="lazy"><span class="sale-pill ${p.demo?'sample':''}">${badge}</span></div>
      <div class="product-info"><div class="product-category">${p.category}</div><h3 class="product-name">${p.name}</h3><p class="product-subtitle">${p.color} · ${p.fit.replace(' · sample','').replace(' · verify','')}</p>
        <p class="product-description">${p.description}</p>
        <div class="price-row"><span class="price">${money(p.price)}</span>${discount?`<span class="mrp">${money(p.mrp)}</span><span class="discount">${discount}% off</span>`:''}</div>
        <div class="size-row"><span class="size-label">SIZE</span>${p.sizes.map(s=>`<button class="size-button ${s===chosen?'selected':''}" type="button" data-size="${s}" aria-pressed="${s===chosen}">${s}</button>`).join('')}</div>
        <div class="card-actions"><button class="add-button" type="button" data-action="add">Add to bag</button><button class="buy-button" type="button" data-action="buy">Buy now</button></div>
      </div></article>`;
  }).join('');
}
function persist(){localStorage.setItem('kefene-demo-bag',JSON.stringify(cart));renderCart()}
function renderCart(){
  const count=cart.reduce((n,x)=>n+x.qty,0);
  bagCount.textContent=count;
  document.getElementById('drawer-count').textContent=`(${count})`;
  const list=document.getElementById('cart-items');
  document.getElementById('cart-empty').hidden=count>0;
  document.getElementById('cart-footer').hidden=count===0;
  list.innerHTML=cart.map(line=>{const p=products.find(x=>x.id===line.id);if(!p)return '';return `<div class="cart-line" data-cart-id="${p.id}" data-size="${line.size}"><img src="${p.image}" alt=""><div><div class="cart-line-title">${p.name}</div><div class="cart-line-meta">${p.color} · Size ${line.size}</div><div class="quantity-control"><button type="button" data-qty="-1" aria-label="Decrease quantity">−</button><span>${line.qty}</span><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div><span class="cart-line-price">${money(p.price*line.qty)}</span></div>`}).join('');
  const total=cart.reduce((n,line)=>n+(products.find(p=>p.id===line.id)?.price||0)*line.qty,0);
  document.getElementById('subtotal-value').textContent=money(total);
}
function addToBag(p,size){
  const line=cart.find(x=>x.id===p.id&&x.size===size);
  if(line)line.qty++;else cart.push({id:p.id,size,qty:1});
  persist();
  const b=document.getElementById('bag-open');b.classList.add('bag-pulse');setTimeout(()=>b.classList.remove('bag-pulse'),450);
}
function syncScrim(){const isOpen=drawer.classList.contains('open');scrim.classList.toggle('visible',isOpen);drawer.setAttribute('aria-hidden',String(!isOpen));document.body.classList.toggle('no-scroll',isOpen)}
function openDrawer(){closeModals();drawer.classList.add('open');syncScrim()}
function closeDrawer(){drawer.classList.remove('open');syncScrim()}
function openModal(el){closeDrawer();el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');setTimeout(()=>el.querySelector('input')?.focus(),100)}
function closeModals(){[accountModal,checkoutModal].forEach(m=>{m.classList.remove('open');m.setAttribute('aria-hidden','true')});if(!drawer.classList.contains('open'))document.body.classList.remove('no-scroll')}
function closeAll(){closeDrawer();closeModals()}
function showCheckout(lines){checkoutLines=lines;const total=lines.reduce((sum,line)=>sum+(products.find(p=>p.id===line.id)?.price||0)*line.qty,0);document.getElementById('checkout-summary').innerHTML=lines.map(line=>{const p=products.find(x=>x.id===line.id);return p?`<div class="summary-row"><span>${p.name} · ${p.color} · ${line.size} × ${line.qty}</span><span>${money(p.price*line.qty)}</span></div>`:''}).join('');document.getElementById('checkout-total').textContent=money(total);document.getElementById('checkout-message').textContent='';const button=document.getElementById('place-demo-order');button.disabled=false;button.innerHTML='Complete demo order <span>→</span>';openModal(checkoutModal)}

grid.addEventListener('click',e=>{
  const card=e.target.closest('.product-card');if(!card)return;
  const p=products.find(x=>x.id===card.dataset.product);if(!p)return;
  if(e.target.closest('.size-button')){const b=e.target.closest('.size-button');selectedSizes[p.id]=b.dataset.size;card.querySelectorAll('.size-button').forEach(x=>{const on=x===b;x.classList.toggle('selected',on);x.setAttribute('aria-pressed',String(on))});return}
  const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;
  const size=selectedSizes[p.id]||defaultSize(p);
  if(action==='add'){addToBag(p,size);const b=card.querySelector('.add-button');b.textContent='Added ✓';setTimeout(()=>{if(b.isConnected)b.textContent='Add to bag'},900)}
  if(action==='buy')showCheckout([{id:p.id,size,qty:1}]);
});
filterBar.addEventListener('click',e=>{const b=e.target.closest('.filter-chip');if(!b)return;filter=b.dataset.filter;renderFilters();renderProducts()});
document.getElementById('search-input').addEventListener('input',e=>{query=e.target.value;renderProducts()});
document.getElementById('search-form').addEventListener('submit',e=>{e.preventDefault();document.getElementById('shop').scrollIntoView({behavior:'smooth'})});
document.getElementById('bag-open').addEventListener('click',openDrawer);
document.getElementById('account-open').addEventListener('click',()=>{document.getElementById('signin-message').textContent='';openModal(accountModal)});
scrim.addEventListener('click',closeAll);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeAll));
drawer.addEventListener('click',e=>{const btn=e.target.closest('[data-qty]');if(!btn)return;const lineEl=btn.closest('.cart-line');const line=cart.find(x=>x.id===lineEl.dataset.cartId&&x.size===lineEl.dataset.size);if(!line)return;line.qty+=Number(btn.dataset.qty);if(line.qty<=0)cart=cart.filter(x=>x!==line);persist()});
document.getElementById('checkout-button').addEventListener('click',()=>showCheckout(cart.map(x=>({...x}))));
document.getElementById('signin-form').addEventListener('submit',e=>{e.preventDefault();document.getElementById('signin-message').textContent='This preview does not create accounts or save email addresses.';e.target.reset()});
document.getElementById('place-demo-order').addEventListener('click',e=>{e.currentTarget.disabled=true;e.currentTarget.textContent='Demo order complete ✓';document.getElementById('checkout-message').textContent='Thanks! Your demo order was previewed. Nothing was submitted and no payment was collected.'});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
renderFilters();renderProducts();renderCart();
