!function(){
  // Check if already accepted
  if(localStorage.getItem('cookiesAccepted')==='true')return;

  var bar=document.createElement('div');
  bar.className='cookie-bar';
  bar.innerHTML=`
    <div class="text">This site uses cookies to improve your experience and analyze traffic. By continuing, you agree to our use of cookies. <a href="https://www.cookiesandyou.com" target="_blank" rel="noopener">Learn more</a></div>
    <div class="btns">
      <button class="cookie-accept" id="cookieAccept">Accept All</button>
      <button class="cookie-decline" id="cookieDecline">Decline</button>
      <button class="cookie-settings" id="cookieSettings">Settings</button>
    </div>`;

  document.body.appendChild(bar);

  // Show after short delay
  setTimeout(function(){bar.classList.add('show')},1000);

  // Accept
  document.getElementById('cookieAccept').onclick=function(){
    localStorage.setItem('cookiesAccepted','true');
    localStorage.setItem('cookieConsent','all');
    bar.classList.remove('show');
    setTimeout(function(){bar.remove()},400);
    initAnalytics();
  };

  // Decline
  document.getElementById('cookieDecline').onclick=function(){
    localStorage.setItem('cookiesAccepted','true');
    localStorage.setItem('cookieConsent','declined');
    bar.classList.remove('show');
    setTimeout(function(){bar.remove()},400);
  };

  // Settings
  document.getElementById('cookieSettings').onclick=function(){
    var settings=document.createElement('div');
    settings.className='cookie-bar';
    settings.style.cssText='flex-direction:column;align-items:stretch;gap:12px;padding:20px 24px';
    settings.innerHTML=`
      <div style="color:#ccc;font-size:.9rem;font-weight:700">Cookie Settings</div>
      <label style="display:flex;align-items:center;gap:10px;color:#aaa;font-size:.82rem;cursor:pointer">
        <input type="checkbox" checked disabled style="accent-color:var(--cyber)"> Essential cookies (required)
      </label>
      <label style="display:flex;align-items:center;gap:10px;color:#aaa;font-size:.82rem;cursor:pointer">
        <input type="checkbox" id="cookieAnalytics" checked style="accent-color:var(--cyber)"> Analytics cookies (help us understand how visitors use the site)
      </label>
      <label style="display:flex;align-items:center;gap:10px;color:#aaa;font-size:.82rem;cursor:pointer">
        <input type="checkbox" id="cookieMarketing" style="accent-color:var(--cyber)"> Marketing cookies (used to deliver relevant ads)
      </label>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="cookie-accept" id="cookieSaveSettings" style="flex:1">Save Settings</button>
        <button class="cookie-decline" id="cookieBack" style="flex:1">Back</button>
      </div>`;

    bar.replaceWith(settings);

    document.getElementById('cookieBack').onclick=function(){
      location.reload();
    };

    document.getElementById('cookieSaveSettings').onclick=function(){
      var analytics=document.getElementById('cookieAnalytics').checked;
      var marketing=document.getElementById('cookieMarketing').checked;
      localStorage.setItem('cookiesAccepted','true');
      localStorage.setItem('cookieConsent',JSON.stringify({analytics:analytics,marketing:marketing}));
      settings.classList.remove('show');
      setTimeout(function(){settings.remove()},400);
      if(analytics)initAnalytics();
    };
  };

  // Simple analytics (respects consent)
  function initAnalytics(){
    // Track page view
    if(typeof gtag==='function'){
      gtag('event','page_view',{page_title:document.title,page_location:window.location.href});
    }
    // Console log for demo
    console.log('Analytics initialized for:',document.title);
  }
}();
