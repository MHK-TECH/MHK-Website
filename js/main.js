!function(){
  var dot=document.createElement('div'),ring=document.createElement('div'),mx=0,my=0,rx=0,ry=0;
  dot.className='cursor-dot';ring.className='cursor-ring';
  document.body.appendChild(dot);document.body.appendChild(ring);

  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    dot.style.left=mx-3+'px';dot.style.top=my-3+'px';
    ring.style.left=mx-16+'px';ring.style.top=my-16+'px';
  });

  !function loop(){
    rx+=(mx-rx)*.15;ry+=(my-ry)*.15;
    ring.style.left=rx-16+'px';ring.style.top=ry-16+'px';
    requestAnimationFrame(loop);
  }();

  document.addEventListener('click',function(e){
    var r=document.createElement('div');
    r.className='ripple';
    r.style.left=e.clientX-8+'px';r.style.top=e.clientY-8+'px';
    document.body.appendChild(r);
    setTimeout(function(){r.remove()},500);
  });

  var throttle=0;
  document.addEventListener('mousemove',function(e){
    throttle++;
    if(throttle%3!==0)return;
    var t=document.createElement('div');
    t.className='trail';
    t.style.left=e.clientX-1.5+'px';t.style.top=e.clientY-1.5+'px';
    document.body.appendChild(t);
    setTimeout(function(){t.remove()},600);
  });

  document.querySelectorAll('a,.card,.skills span,.post-list li').forEach(function(el){
    el.addEventListener('mouseenter',function(){ring.classList.add('hover')});
    el.addEventListener('mouseleave',function(){ring.classList.remove('hover')});
  });

  document.querySelectorAll('.card').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var rect=card.getBoundingClientRect();
      var x=(e.clientX-rect.left)/rect.width-.5;
      var y=(e.clientY-rect.top)/rect.height-.5;
      card.style.transform='translateY(-2px) rotateX('+(-y*6)+'deg) rotateY('+(x*6)+'deg)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='translateY(0) rotateX(0) rotateY(0)';
    });
  });
}();
