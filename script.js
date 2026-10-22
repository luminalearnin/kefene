const products = [
  {id:'marino-cream',name:'Marino Knit Sweater',color:'Whipped Creme',image:'assets/kefene-sweatshirt-03.jpeg',price:1999,mrp:2499,tags:['knitwear','light']},
  {id:'marino-maroon',name:'Marino Knit Sweater',color:'Maroon',image:'assets/kefene-sweatshirt-02.jpeg',price:1999,mrp:2499,tags:['knitwear','dark']},
  {id:'marino-classic',name:'Marino Knit Sweater',color:'Classic Cream',image:'assets/kefene-sweatshirt-01.jpeg',price:1999,mrp:2499,tags:['knitwear','light']}
];
const sizes=['S','M','L','XL'];
const money=n=>'₹'+Number(n).toLocaleString('en-IN');
const getStored=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let cart=getStored('kefene-demo-bag',[]);
let selectedSizes={};
let filter='all';
let query='';
let checkoutLines=[];
const grid=document.getElementById('product-grid');
const empty=document.getElementById('empty-results');
const bagCount=document.getElementById('bag-count');
const scrim=document.getElementById('scrim');
const drawer=document.getElementById('cart-drawer');
const accountModal=document.getElementById('account-modal');
const checkoutModal=document.getElementById('checkout-modal');

function renderProducts(){
  let items=products.filter(p=>{
    const matchesFilter=filter==='all'||p.tags.includes(filter);
    const text=(p.name+' '+p.color).toLowerCase();
    return matchesFilter&&text.includes(query.trim().toLowerCase());
  });
  document.getElementById('result-count').textContent=`${items.length} ${items.length===1?'piece':'pieces'}`;
  document.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  empty.hidden=items.length>0;
  grid.innerHTML=items.map(p=>{
    const chosen=selectedSizes[p.id]||'M';
    const discount=Math.round((1-p.price/p.mrp)*100);
    return `<article class="product-card" data-product="${p.id}">
      <div class="product-photo"><img src="${p.image}" alt="${p.name} in ${p.color}" loading="lazy"><span class="sale-pill">${discount}% OFF</span></div>
      <div class="product-info"><h3 class="product-name">${p.name}</h3><p class="product-subtitle">${p.color} · Unisex fit</p>
        
        <div class="price-row"><span class="price">${money(p.price)}</span><span class="mrp">${money(p.mrp)}</span><span class="discount">${discount}% off</span></div>
        <div class="size-row"><span class="size-label">SIZE</span>${sizes.map(s=>`<button class="size-button ${s===chosen?'selected':''}" type="button" data-size="${s}" aria-pressed="${s===chosen}">${s}</button>`).join('')}</div>
        <div class="card-actions"><button class="add-button" type="button" data-action="add">Add to bag</button><button class="buy-button" type="button" data-action="buy">Buy now</button></div>
      </div></article>`;
  }).join('');
}
function persist(){localStorage.setItem('kefene-demo-bag',JSON.stringify(cart));renderCart();}
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
  const size=selectedSizes[p.id]||'M';
  if(action==='add'){addToBag(p,size);const b=card.querySelector('.add-button');b.textContent='Added ✓';setTimeout(()=>{if(b.isConnected)b.textContent='Add to bag'},900)}
  if(action==='buy')showCheckout([{id:p.id,size,qty:1}]);
});
document.querySelectorAll('.filter-chip').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;renderProducts()}));
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
renderProducts();renderCart();
