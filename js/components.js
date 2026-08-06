// components.js — Shared header/footer for all pages
(function(){
  var pages=[
    {href:'index.html',label:'Home'},
    {href:'about.html',label:'About'},
    {href:'services.html',label:'Services'},
    {href:'research.html',label:'Research'},
    {href:'blog.html',label:'Blog'},
    {href:'tools.html',label:'Tools'},
    {href:'contact.html',label:'Contact'}
  ];

  function getBase(){
    var p=window.location.pathname;
    if(p.indexOf('/posts/')!==-1) return '../';
    return '';
  }

  function getCurrentPage(){
    var path=window.location.pathname.split('/').pop()||'index.html';
    if(path==='') path='index.html';
    return path;
  }

  function isBlogPost(){
    return window.location.pathname.indexOf('/posts/')!==-1;
  }

  // Skip navigation link
  var skip=document.createElement('a');
  skip.href='#main';
  skip.className='skip-link';
  skip.textContent='Skip to content';
  document.body.insertBefore(skip,document.body.firstChild);

  // Header
  var base=getBase();
  var current=getCurrentPage();
  var header=document.createElement('header');
  header.className='site-header';
  header.setAttribute('role','banner');

  var navHTML='<div class="header-inner">';
  navHTML+='<a href="'+base+'index.html" class="header-brand">';
  navHTML+='<img src="'+base+'logo.jpg" alt="MHK" width="36" height="36">';
  navHTML+='<span>M-HUZAIFA KHILJI</span>';
  navHTML+='</a>';
  navHTML+='<button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false">';
  navHTML+='<span></span><span></span><span></span>';
  navHTML+='</button>';
  navHTML+='<nav class="header-nav" id="headerNav" role="navigation" aria-label="Main navigation">';
  navHTML+='<ul>';

  if(isBlogPost()){
    navHTML+='<li><a href="'+base+'blog.html" class="nav-back">← Blog</a></li>';
  }else{
    for(var i=0;i<pages.length;i++){
      var p=pages[i];
      var cls=current===p.href?'active':'';
      navHTML+='<li><a href="'+base+p.href+'" class="'+cls+'">'+p.label+'</a></li>';
    }
  }

  navHTML+='</ul></nav></div>';
  header.innerHTML=navHTML;
  document.body.insertBefore(header,document.body.children[1]||null);

  // Mobile menu toggle
  var toggle=document.getElementById('menuToggle');
  var nav=document.getElementById('headerNav');
  if(toggle&&nav){
    toggle.addEventListener('click',function(){
      var expanded=this.getAttribute('aria-expanded')==='true';
      this.setAttribute('aria-expanded',!expanded);
      nav.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
    // Close on link click
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        toggle.setAttribute('aria-expanded','false');
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Footer
  var footer=document.createElement('footer');
  footer.className='site-footer';
  footer.setAttribute('role','contentinfo');

  var footerHTML='<div class="footer-inner">';
  footerHTML+='<div class="footer-brand">';
  footerHTML+='<img src="'+base+'logo.jpg" alt="MHK" width="28" height="28">';
  footerHTML+='<span>M-HUZAIFA KHILJI</span>';
  footerHTML+='<p class="footer-tagline">Data Science · AI Engineering · Automation</p>';
  footerHTML+='</div>';
  footerHTML+='<div class="footer-links">';
  footerHTML+='<h4>Pages</h4>';
  footerHTML+='<ul>';
  for(var j=0;j<pages.length;j++){
    footerHTML+='<li><a href="'+base+pages[j].href+'">'+pages[j].label+'</a></li>';
  }
  footerHTML+='</ul></div>';
  footerHTML+='<div class="footer-contact">';
  footerHTML+='<h4>Contact</h4>';
  footerHTML+='<ul>';
  footerHTML+='<li><a href="mailto:huzaifa@datascience.dev">huzaifa@datascience.dev</a></li>';
  footerHTML+='<li>Lahore, Pakistan</li>';
  footerHTML+='<li><a href="https://www.linkedin.com/in/muhammad-huzaifa-khilji-955320159/" target="_blank" rel="noopener">LinkedIn</a></li>';
  footerHTML+='<li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>';
  footerHTML+='</ul></div>';
  footerHTML+='</div>';
  footerHTML+='<div class="footer-bottom">';
  footerHTML+='<span>© 2026 M-HUZAIFA KHILJI. All rights reserved.</span>';
  footerHTML+='</div>';
  footer.innerHTML=footerHTML;
  document.body.appendChild(footer);
})();
