!function(){
  // ── Visitor Tracking System ──

  // Generate unique session ID
  function getOrCreateSession(){
    var sid=localStorage.getItem('mhk_session_id');
    if(!sid){
      sid='sess_'+Date.now()+'_'+Math.random().toString(36).substr(2,9);
      localStorage.setItem('mhk_session_id',sid);
    }
    return sid;
  }

  // Generate visitor ID (persistent)
  function getOrCreateVisitor(){
    var vid=localStorage.getItem('mhk_visitor_id');
    if(!vid){
      vid='vis_'+Date.now()+'_'+Math.random().toString(36).substr(2,9);
      localStorage.setItem('mhk_visitor_id',vid);
    }
    return vid;
  }

  // Get/set page view count
  function trackPageView(){
    var views=parseInt(localStorage.getItem('mhk_page_views')||'0');
    views++;
    localStorage.setItem('mhk_page_views',views);
    return views;
  }

  // Track visit timestamp
  function trackVisitTime(){
    var now=new Date().toISOString();
    localStorage.setItem('mhk_last_visit',now);
    var first=localStorage.getItem('mhk_first_visit');
    if(!first) localStorage.setItem('mhk_first_visit',now);
  }

  // Initialize tracking data
  var visitorId=getOrCreateVisitor();
  var sessionId=getOrCreateSession();
  var pageViews=trackPageView();
  trackVisitTime();

  // Store tracking data for server
  window.mhkAnalytics={
    visitorId:visitorId,
    sessionId:sessionId,
    pageViews:pageViews,
    referrer:document.referrer||'direct',
    userAgent:navigator.userAgent,
    language:navigator.language,
    screenWidth:screen.width,
    screenHeight:screen.height,
    timestamp:new Date().toISOString()
  };

  // ── Cookie Consent ──
  if(localStorage.getItem('cookiesAccepted')==='true'){
    var consent=localStorage.getItem('cookieConsent');
    if(consent==='all'||consent==='analytics'||(consent&&consent.indexOf('analytics')!==-1)){
      initAnalytics();
    }
    return;
  }

  var bar=document.createElement('div');
  bar.className='cookie-bar';
  bar.innerHTML=`
    <div class="text">This site uses cookies to improve your experience, analyze traffic, and personalize content. By continuing, you agree to our use of cookies. <a href="https://www.cookiesandyou.com" target="_blank" rel="noopener">Learn more</a></div>
    <div class="btns">
      <button class="cookie-accept" id="cookieAccept">Accept All</button>
      <button class="cookie-decline" id="cookieDecline">Decline</button>
      <button class="cookie-settings" id="cookieSettings">Settings</button>
    </div>`;

  document.body.appendChild(bar);
  setTimeout(function(){bar.classList.add('show')},1000);

  document.getElementById('cookieAccept').onclick=function(){
    localStorage.setItem('cookiesAccepted','true');
    localStorage.setItem('cookieConsent','all');
    bar.classList.remove('show');
    setTimeout(function(){bar.remove()},400);
    initAnalytics();
  };

  document.getElementById('cookieDecline').onclick=function(){
    localStorage.setItem('cookiesAccepted','true');
    localStorage.setItem('cookieConsent','declined');
    bar.classList.remove('show');
    setTimeout(function(){bar.remove()},400);
  };

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

    document.getElementById('cookieBack').onclick=function(){location.reload()};

    document.getElementById('cookieSaveSettings').onclick=function(){
      var analytics=document.getElementById('cookieAnalytics').checked;
      var marketing=document.getElementById('cookieMarketing').checked;
      localStorage.setItem('cookiesAccepted','true');
      localStorage.setItem('cookieConsent',JSON.stringify({analytics:analytics,marketing:marketing}));
      settings.classList.remove('show');
      setTimeout(function(){settings.remove()},400);
      if(analytics) initAnalytics();
      if(marketing) initMarketing();
    };
  };

  function initAnalytics(){
    console.log('[MHK Analytics] Initialized',window.mhkAnalytics);

    // Track outbound affiliate link clicks
    document.querySelectorAll('a[target="_blank"]').forEach(function(a){
      a.addEventListener('click',function(){
        var href=this.href;
        if(typeof gtag==='function'){
          gtag('event','affiliate_click',{
            link_url:href,
            link_text:this.textContent.trim(),
            page:document.title
          });
        }
      });
    });

    // Track scroll depth
    var maxScroll=0;
    window.addEventListener('scroll',function(){
      var scroll=Math.round((window.scrollY/(document.body.scrollHeight-window.innerHeight))*100);
      if(scroll>maxScroll){
        maxScroll=scroll;
        if(maxScroll%25===0&&maxScroll>0){
          if(typeof gtag==='function'){
            gtag('event','scroll_depth',{depth:maxScroll+'%',page:document.title});
          }
        }
      }
    });

    // Track time on page
    var startTime=Date.now();
    window.addEventListener('beforeunload',function(){
      var timeSpent=Math.round((Date.now()-startTime)/1000);
      if(typeof gtag==='function'){
        gtag('event','page_exit',{
          time_seconds:timeSpent,
          page:document.title,
          scroll_depth:maxScroll+'%'
        });
      }
    });
  }

  function initMarketing(){
    console.log('[MHK Marketing] Cookies enabled');
    // Google AdSense and remarketing will initialize here
  }
}();
