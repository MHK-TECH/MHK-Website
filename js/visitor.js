!function(){
  // Simple visitor counter using localStorage
  var key='siteStats';
  var stats=JSON.parse(localStorage.getItem(key)||'{"visitors":0,"sessions":0,"today":0,"lastVisit":""}');
  var today=new Date().toDateString();

  // Count unique visitor (once per browser)
  if(localStorage.getItem('visited')!=='true'){
    stats.visitors++;
    localStorage.setItem('visited','true');
  }

  // Count session
  if(!sessionStorage.getItem('sessionCounted')){
    stats.sessions++;
    sessionStorage.setItem('sessionCounted','true');
  }

  // Count today
  if(stats.lastVisit!==today){
    stats.today=1;
    stats.lastVisit=today;
  }else{
    stats.today++;
  }

  localStorage.setItem(key,JSON.stringify(stats));

  // Build bar
  var bar=document.createElement('div');
  bar.className='visitor-bar';
  bar.innerHTML=`
    <div class="left">
      <div class="stat"><span class="dot"></span> <span>${stats.visitors.toLocaleString()} visitors</span></div>
      <span class="sep">·</span>
      <div class="stat"><span class="dot yellow"></span> <span>${stats.sessions.toLocaleString()} sessions</span></div>
      <span class="sep">·</span>
      <div class="stat"><span class="dot purple"></span> <span>${stats.today.toLocaleString()} today</span></div>
    </div>
    <div class="right">
      <a href="services.html">Hire me</a>
      <span class="sep">·</span>
      <a href="blog.html">Blog</a>
      <span class="sep">·</span>
      <a href="tools.html">Tools</a>
    </div>`;

  // Insert before cookie bar if exists, else at bottom
  var cookieBar=document.querySelector('.cookie-bar');
  if(cookieBar){
    bar.style.bottom=cookieBar.offsetHeight+'px';
    cookieBar.parentNode.insertBefore(bar,cookieBar);
  }else{
    document.body.appendChild(bar);
  }
}();
