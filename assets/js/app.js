// Toggle nav drawer
const toggle = document.querySelector('.nav__toggle');
const drawer = document.querySelector('.nav__drawer');

if(toggle && drawer){
  toggle.addEventListener('click', () => {
    const open = drawer.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  drawer.querySelectorAll('a').forEach(a => 
    a.addEventListener('click', () => drawer.classList.remove('is-open'))
  );
}
