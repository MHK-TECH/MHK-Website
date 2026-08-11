// components.js — Shared header/footer for all pages
(function(){
  var pages=[
    {href:'index.html',label:'Home'},
    {href:'about.html',label:'About'},
    {href:'services.html',label:'Services'},
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

  // Theme management
  function getTheme(){
    return localStorage.getItem('theme')||'dark';
  }

  function setTheme(theme){
    localStorage.setItem('theme',theme);
    document.documentElement.setAttribute('data-theme',theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme){
    var btn=document.getElementById('themeToggle');
    if(btn) btn.innerHTML=theme==='dark'?'&#9728;':'&#9790;';
  }

  // Apply theme immediately
  document.documentElement.setAttribute('data-theme',getTheme());

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
  navHTML+='<span>M-HUZAIFA-KHILJI</span>';
  navHTML+='</a>';
  navHTML+='<button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false">';
  navHTML+='<span></span><span></span><span></span>';
  navHTML+='</button>';
  navHTML+='<nav class="header-nav" id="headerNav" role="navigation" aria-label="Main navigation">';
  navHTML+='<ul>';

  if(isBlogPost()){
    navHTML+='<li><a href="'+base+'blog.html" class="nav-back">&larr; Blog</a></li>';
  }else{
    for(var i=0;i<pages.length;i++){
      var p=pages[i];
      var cls=current===p.href?'active':'';
      navHTML+='<li><a href="'+base+p.href+'" class="'+cls+'">'+p.label+'</a></li>';
    }
  }

  navHTML+='<li><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">'+(getTheme()==='dark'?'&#9728;':'&#9790;')+'</button></li>';
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

  // Theme toggle
  var themeBtn=document.getElementById('themeToggle');
  if(themeBtn){
    themeBtn.addEventListener('click',function(){
      var current=getTheme();
      var next=current==='dark'?'light':'dark';
      setTheme(next);
    });
  }

  // Footer
  var footer=document.createElement('footer');
  footer.className='site-footer';
  footer.setAttribute('role','contentinfo');

  var footerHTML='<div class="footer-inner">';
  footerHTML+='<div class="footer-brand">';
  footerHTML+='<div class="footer-logo">';
  footerHTML+='<img src="'+base+'logo.jpg" alt="MHK" width="32" height="32">';
  footerHTML+='<span>M-HUZAIFA-KHILJI</span>';
  footerHTML+='</div>';
  footerHTML+='<p class="footer-tagline">Building AI systems, data pipelines, and smart automations that solve real problems.</p>';
  footerHTML+='<div class="footer-social">';
  footerHTML+='<a href="https://www.linkedin.com/in/muhammad-huzaifa-khilji-955320159/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>';
  footerHTML+='<a href="mailto:mhktechnologies1.0@gmail.com" aria-label="Email"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>';
  footerHTML+='</div>';
  footerHTML+='</div>';
  footerHTML+='<div class="footer-links">';
  footerHTML+='<h4>Navigation</h4>';
  footerHTML+='<ul>';
  for(var j=0;j<pages.length;j++){
    footerHTML+='<li><a href="'+base+pages[j].href+'">'+pages[j].label+'</a></li>';
  }
  footerHTML+='</ul></div>';
  footerHTML+='<div class="footer-services">';
  footerHTML+='<h4>Services</h4>';
  footerHTML+='<ul>';
  footerHTML+='<li><a href="'+base+'services.html">Data Science</a></li>';
  footerHTML+='<li><a href="'+base+'services.html">AI Engineering</a></li>';
  footerHTML+='<li><a href="'+base+'services.html">AI Automation</a></li>';
  footerHTML+='<li><a href="'+base+'contact.html">Get a Quote</a></li>';
  footerHTML+='</ul></div>';
  footerHTML+='<div class="footer-contact">';
  footerHTML+='<h4>Connect</h4>';
  footerHTML+='<ul>';
  footerHTML+='<li><a href="mailto:mhktechnologies1.0@gmail.com">mhktechnologies1.0@gmail.com</a></li>';
  footerHTML+='<li>Lahore, Pakistan</li>';
  footerHTML+='<li style="margin-top:8px"><a href="https://www.linkedin.com/company/110610235/" target="_blank" rel="noopener">HMLOGICS on LinkedIn</a></li>';
  footerHTML+='<li style="font-size:.75rem;color:var(--text-dim);margin-top:8px">Open to new opportunities</li>';
  footerHTML+='</ul></div>';
  footerHTML+='</div>';
  footerHTML+='<div class="footer-bottom">';
  footerHTML+='<span>&copy; 2026 M-HUZAIFA-KHILJI</span>';
  footerHTML+='<span class="footer-bottom-links">';
  footerHTML+='<a href="'+base+'contact.html">Contact</a>';
  footerHTML+='<a href="https://www.linkedin.com/in/muhammad-huzaifa-khilji-955320159/" target="_blank" rel="noopener">LinkedIn</a>';
  footerHTML+='</span>';
  footerHTML+='</div>';
  footer.innerHTML=footerHTML;
  document.body.appendChild(footer);
})();