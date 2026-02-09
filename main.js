const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', (e) =>{
  navLinks.classList.toggle('open');
  
  if (navLinks.classList.contains('open')){
    menuBtnIcon.setAttribute('class', 'ri-close-line')
  }
  
  else{
   menuBtnIcon.setAttribute('class', 'ri-menu-line')
  }
});
