const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.desktop-nav');
menuButton?.addEventListener('click',()=>{
  const isOpen=nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(isOpen));
  menuButton.setAttribute('aria-label',isOpen?'Close menu':'Open menu');
  menuButton.textContent=isOpen?'×':'☰';
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
  if(menuButton){menuButton.setAttribute('aria-label','Open menu');menuButton.textContent='☰';}
}));
