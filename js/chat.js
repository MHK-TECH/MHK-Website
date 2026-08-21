!function(){
  // ── CONFIG ──
  var API_ENDPOINT='/api/chat';
  var MODEL='openrouter/free';

  // ── SYSTEM PROMPT: MHK AI ──
  var SYSTEM=`You are MHK AI — the official assistant for M-HUZAIFA KHILJI (MHK), Data Scientist & AI Engineer based in Lahore, Pakistan.

SCOPE (strict): Only help with MHK's profile, services, pricing, and how to contact him. If asked anything else, politely say you only assist with MHK's services and contact, then invite them to share their project need.

REPLY RULES (strict):
- Normal answers: MAX 2 lines. Never write long paragraphs or essays.
- Always answer in short BULLET POINTS.
- No intro filler ("Great question!", "Sure!"). Start with the answer.
- When the visitor describes a problem or requirement (a pain point), acknowledge in 1-2 bullets and say you've noted it for MHK — they can send it via the "Copy notes" button.

MHK INFO:
- Services & pricing:
  • Data Science — $90-135/hr
  • AI Engineering / LLM fine-tuning — $120-200/hr
  • AI Automation / n8n — $120-200/hr
  • SEO & AI Content — $80-150/hr
  • WordPress — $60-120/hr
  • n8n Workflows — $100-180/hr
- Contact: huzaifa@mhktech.dev (replies within 24h)
- Location: Lahore, Pakistan`;

  // ── API CALL ──
  var chatHistory=[];
  function painSummary(){
    var pts=chatHistory.filter(function(m){return m.role==='user'}).map(function(m){return '• '+m.content});
    if(!pts.length) return 'No requirements discussed yet — chat with MHK AI to note your project needs.';
    return 'My project requirements for MHK:\n\n'+pts.join('\n')+'\n\n— Sent via mhktech.dev (MHK AI)';
  }
  function copyPain(btn){
    var txt=painSummary();
    try{ navigator.clipboard.writeText(txt); }catch(e){}
    if(btn){var old=btn.textContent;btn.textContent='✓ Copied!';setTimeout(function(){btn.textContent=old},1800);}
  }
  function askAI(userMsg, onDone, onError){
    chatHistory.push({role:'user',content:userMsg});
    if(chatHistory.length>10) chatHistory=chatHistory.slice(-10);

    fetch(API_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:MODEL,
        messages:[
          {role:'system',content:SYSTEM},
          ...chatHistory
        ]
      })
    })
    .then(function(r){return r.json()})
    .then(function(data){
      if(data.choices&&data.choices[0]&&data.choices[0].message){
        var reply=data.choices[0].message.content;
        chatHistory.push({role:'assistant',content:reply});
        onDone(reply);
      }else{
        onError('Sorry, I had trouble responding. Try again!');
      }
    })
    .catch(function(){onError('Connection error. Please try again.')});
  }

  // ── FALLBACK KEYWORD MATCHING ──
  var KB={
    greeting:['Hey! Welcome to M-HUZAIFA KHILJI\'s site. I can tell you about his work, skills, services, or anything AI/data science. What interests you?'],
    services:['Here\'s what M-HUZAIFA does:\n\n• Data Science — dashboards, analytics, predictive modeling ($90-135/hr)\n• AI Engineering — LLM fine-tuning, RAG pipelines, chatbots ($120-200/hr)\n• AI Automation — n8n workflows, document processing ($120-200/hr)\n• Fixed Projects — custom quote\n\nEmail huzaifa@mhktech.dev for a quote.'],
    skills:['Tech stack: Python, JavaScript, TypeScript, SQL, PyTorch, TensorFlow, Hugging Face, LangChain, Django, FastAPI, React, Next.js, n8n, Docker, Airflow, PostgreSQL, MongoDB, Oracle.'],
    contact:['📧 huzaifa@mhktech.dev\n📍 Lahore, Pakistan\n🔗 linkedin.com/in/muhammad-huzaifa-khilji-955320159\n\nResponds within 24 hours.'],
    default:['I\'m MHK AI — I only help with M-HUZAIFA\'s services, pricing, and contact. Tell me your project need and I\'ll note it for him.']
  };
  var MAP=[
    {k:['hello','hi','hey','sup','yo','good morning'],r:'greeting'},
    {k:['service','offer','what do','help with','provide','build'],r:'services'},
    {k:['skill','stack','tech','language','tool','know','use'],r:'skills'},
    {k:['contact','email','reach','hire','talk','connect'],r:'contact'},
    {k:['price','cost','rate','charge','budget','quote','how much'],r:'services'}
  ];
  function fallback(input){
    var lower=input.toLowerCase().trim();
    for(var i=0;i<MAP.length;i++){
      for(var j=0;j<MAP[i].k.length;j++){
        if(lower.indexOf(MAP[i].k[j])!==-1) return KB[MAP[i].r][0];
      }
    }
    return KB.default[0];
  }

  // ── TYPEWRITER ──
  function escapeHTML(str){
    var div=document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function typeWrite(el,text,speed,cb){
    var i=0;
    el.innerHTML='';
    !function type(){
      if(i<text.length){
        if(text[i]==='\n'){
          el.appendChild(document.createElement('br'));
        }else{
          el.appendChild(document.createTextNode(text[i]));
        }
        i++;
        var delay=speed;
        if(text[i-1]===' ')delay=speed*0.5;
        else if('.!?,;:'.indexOf(text[i-1])!==-1)delay=speed*3;
        setTimeout(type,delay);
      }else if(cb){cb();}
    }();
  }

  // ── HERO CHAT (homepage) ──
  var hero=document.getElementById('heroChat');
  if(hero){
    hero.innerHTML=`
      <div class="chat-head">
        <div class="avatar"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none"/><circle cx="12" cy="10" r="4" fill="none"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none"/></svg></div>
        <div class="info">
          <div class="name">MHK AI</div>
          <div class="status">Online</div>
        </div>
      </div>
      <div class="chat-messages" id="hMsgs"></div>
      <div class="chat-input">
        <input type="text" id="hIn" placeholder="Ask about MHK's services, pricing, contact..." autocomplete="off">
        <button id="hSend"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div class="chat-footer">
        <button id="hCopy" class="chat-act">📋 Copy my notes</button>
      </div>`;

    var hMsgs=document.getElementById('hMsgs');
    var hIn=document.getElementById('hIn');
    var hSend=document.getElementById('hSend');
    var hBusy=false;

    function hAddBot(text){
      var d=document.createElement('div');
      d.className='msg bot';
      hMsgs.appendChild(d);
      hMsgs.scrollTop=hMsgs.scrollHeight;
      hBusy=true;
      typeWrite(d,text,18,function(){hBusy=false});
    }

    function hAddUser(text){
      var d=document.createElement('div');
      d.className='msg user';
      d.textContent=text;
      hMsgs.appendChild(d);
      hMsgs.scrollTop=hMsgs.scrollHeight;
    }

    function hShowTyping(){
      var d=document.createElement('div');
      d.className='msg bot';
      d.id='hTyping';
      d.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';
      hMsgs.appendChild(d);
      hMsgs.scrollTop=hMsgs.scrollHeight;
    }
    function hRemoveTyping(){
      var el=document.getElementById('hTyping');
      if(el)el.remove();
    }

    // Welcome
    hAddBot('Hi, I\'m MHK AI. Ask about MHK\'s services, pricing, or how to reach him. I answer in short points — and I\'ll note your project needs so you can send them over.');

    // Quick buttons
    var btnWrap=document.createElement('div');
    btnWrap.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;opacity:0;transition:opacity .3s';
    setTimeout(function(){btnWrap.style.opacity='1'},800);

    var btns=[
      {t:'Services & pricing',q:'What services and pricing do you offer?'},
      {t:'How to contact you',q:'How can I contact MHK?'},
      {t:'SEO & AI Content',q:'Tell me about your SEO & AI content service'},
      {t:'AI Automation',q:'What AI automation do you build with n8n?'}
    ];

    btns.forEach(function(b){
      var el=document.createElement('button');
      el.textContent=b.t;
      el.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:8px 14px;font-family:inherit;font-size:.82rem;color:var(--text-muted);cursor:pointer;transition:all .2s;white-space:nowrap';
      el.onmouseenter=function(){el.style.borderColor='var(--accent)';el.style.color='var(--accent)'};
      el.onmouseleave=function(){el.style.borderColor='var(--border)';el.style.color='var(--text-muted)'};
      el.onclick=function(){
        btnWrap.remove();
        hSendMsg(b.q);
      };
      btnWrap.appendChild(el);
    });
    hMsgs.appendChild(btnWrap);

    function hSendMsg(text){
      if(hBusy)return;
      hAddUser(text);
      var bw=hMsgs.querySelector('div[style*="flex-wrap"]');
      if(bw)bw.remove();

      if(API_ENDPOINT===''){
        setTimeout(function(){hAddBot(fallback(text))},400);
        return;
      }
      hShowTyping();
      askAI(text,
        function(reply){hRemoveTyping();hAddBot(reply)},
        function(err){hRemoveTyping();hAddBot(fallback(text))}
      );
    }

    hSend.onclick=function(){var t=hIn.value.trim();if(!t||hBusy)return;hIn.value='';hSendMsg(t)};
    hIn.onkeydown=function(e){if(e.key==='Enter'){var t=hIn.value.trim();if(!t||hBusy)return;hIn.value='';hSendMsg(t)}};
    var hCopy=document.getElementById('hCopy');
    if(hCopy)hCopy.onclick=function(){copyPain(hCopy)};
  }

  // ── FLOATING CHAT (other pages) ──
  if(!hero){
    var toggle=document.createElement('div');
    toggle.className='chat-toggle';
    toggle.style.display='flex';
    toggle.innerHTML='<svg class="msg-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><svg class="close-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    var box=document.createElement('div');
    box.className='chat-box';
    box.innerHTML=`
      <div class="chat-head">
        <div class="avatar"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none"/><circle cx="12" cy="10" r="4" fill="none"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none"/></svg></div>
        <div class="info">
          <div class="name">MHK AI</div>
          <div class="status">Online</div>
        </div>
      </div>
      <div class="chat-messages" id="fMsgs"></div>
      <div class="chat-input">
        <input type="text" id="fIn" placeholder="Ask about MHK's services, contact..." autocomplete="off">
        <button id="fSend"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div class="chat-footer">
        <button id="fCopy" class="chat-act">📋 Copy my notes</button>
      </div>`;

    document.body.appendChild(toggle);
    document.body.appendChild(box);

    var fMsgs=document.getElementById('fMsgs');
    var fIn=document.getElementById('fIn');
    var fSend=document.getElementById('fSend');
    var fBusy=false;

    toggle.onclick=function(){
      box.classList.toggle('open');
      toggle.classList.toggle('active');
      if(box.classList.contains('open')){
        fIn.focus();
        if(fMsgs.children.length===0){
          var d=document.createElement('div');d.className='msg bot';
          fMsgs.appendChild(d);
          typeWrite(d,'Hi, I\'m MHK AI. Ask about MHK\'s services, pricing, or how to reach him.',18);
        }
      }
    };

    function fAddBot(text){
      var d=document.createElement('div');d.className='msg bot';
      fMsgs.appendChild(d);fMsgs.scrollTop=fMsgs.scrollHeight;
      fBusy=true;
      typeWrite(d,text,18,function(){fBusy=false});
    }

    function fAddUser(text){
      var d=document.createElement('div');d.className='msg user';d.textContent=text;
      fMsgs.appendChild(d);fMsgs.scrollTop=fMsgs.scrollHeight;
    }

    function fShowTyping(){
      var d=document.createElement('div');d.className='msg bot';d.id='fTyping';
      d.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';
      fMsgs.appendChild(d);fMsgs.scrollTop=fMsgs.scrollHeight;
    }
    function fRemoveTyping(){var el=document.getElementById('fTyping');if(el)el.remove();}

    function fSendMsg(text){
      if(fBusy)return;
      fAddUser(text);
      if(API_ENDPOINT===''){
        setTimeout(function(){fAddBot(fallback(text))},400);
        return;
      }
      fShowTyping();
      askAI(text,
        function(reply){fRemoveTyping();fAddBot(reply)},
        function(err){fRemoveTyping();fAddBot(fallback(text))}
      );
    }

    fSend.onclick=function(){var t=fIn.value.trim();if(!t||fBusy)return;fIn.value='';fSendMsg(t)};
    fIn.onkeydown=function(e){if(e.key==='Enter'){var t=fIn.value.trim();if(!t||fBusy)return;fIn.value='';fSendMsg(t)}};
    var fCopy=document.getElementById('fCopy');
    if(fCopy)fCopy.onclick=function(){copyPain(fCopy)};
  }
}();
