!function(){
  // ── CONFIG ──
  var API_ENDPOINT='/api/chat';
  var MODEL='openrouter/free';

  // ── SYSTEM PROMPT: Full knowledge about MHK ──
  var SYSTEM=`You are the AI Assistant for M-HUZAIFA KHILJI's website. You help visitors learn about his work, services, and expertise. Be friendly, concise, and guide visitors toward hiring him or learning more.

ABOUT M-HUZAIFA KHILJI:
- Full name: Muhammad Huzaifa Khilji
- Based in Lahore, Pakistan
- Data Scientist, AI Engineer, and Automation Specialist
- Background in Data Science and Machine Learning, AI Engineering, SEO, WordPress, AI Automation
- Available for freelance projects worldwide (remote)
- Email: mhktechnologies1.0@gmail.com
- LinkedIn: linkedin.com/in/muhammad-huzaifa-khilji-955320159
- Availability: 3-5 hours daily, Mon-Fri 9am-5pm (UTC+5), responds within 24hrs

SERVICES & PRICING:
1. Data Science ($90-135/hr): Dashboards (Power BI, Plotly Dash, Streamlit), analytics, predictive modeling, data pipelines
2. AI Engineering ($120-200/hr): LLM fine-tuning (LoRA, QLoRA), RAG pipelines, AI chatbots, custom models, model deployment
3. AI Automation ($120-200/hr): n8n workflows, document processing, intelligent routing, business tool integration
4. Fixed Projects: Custom quote, clear milestones, on-time delivery

PAYMENT METHODS:
- Visa (debit/credit card)
- MasterCard (debit/credit card)
- Payoneer (international transfers)
Invoices provided for every project.

TECH STACK:
- Languages: Python, JavaScript, TypeScript, SQL, Bash
- AI/ML: PyTorch, TensorFlow, Hugging Face, LangChain, scikit-learn
- Backend: Django, FastAPI, Node.js
- Frontend: React, Next.js, Tailwind CSS
- Data: PostgreSQL, MongoDB, Redis, Oracle
- Automation: n8n, Airflow, Docker, Spark
- Cloud: AWS, GCP

BLOG POSTS:
1. Why Website Speed Matters More Than You Think
2. A Practical Guide to Fine-Tuning LLMs
3. Building a RAG Pipeline That Actually Works
4. Data Engineering Pipelines
5. Dashboard Design
6. Oracle Migration Guide
7. Building AI Workflows with n8n

WORK APPROACH:
- Simple first (if a spreadsheet works, suggest it)
- Measure everything (no guessing)
- Fail loudly (monitoring built in)
- Ship, then iterate

RULES:
- Always respond as M-HUZAIFA's assistant, never as a general AI
- Guide visitors to services, blog, or contact page
- Be helpful but concise
- If asked about pricing, mention the hourly rates and suggest emailing for a quote
- If asked about something unrelated, politely redirect to MHK's services
- Use markdown formatting sparingly for readability`;

  // ── API CALL ──
  var chatHistory=[];
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
    services:['Here\'s what M-HUZAIFA does:\n\n• Data Science — dashboards, analytics, predictive modeling ($90-135/hr)\n• AI Engineering — LLM fine-tuning, RAG pipelines, chatbots ($120-200/hr)\n• AI Automation — n8n workflows, document processing ($120-200/hr)\n• Fixed Projects — custom quote\n\nEmail mhktechnologies1.0@gmail.com for a quote.'],
    skills:['Tech stack: Python, JavaScript, TypeScript, SQL, PyTorch, TensorFlow, Hugging Face, LangChain, Django, FastAPI, React, Next.js, n8n, Docker, Airflow, PostgreSQL, MongoDB, Oracle.'],
    contact:['📧 mhktechnologies1.0@gmail.com\n📍 Lahore, Pakistan\n🔗 linkedin.com/in/muhammad-huzaifa-khilji-955320159\n\nResponds within 24 hours.'],
    default:['I can tell you about M-HUZAIFA\'s services, skills, blog, or how to contact him. What would you like to know?']
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
          <div class="name">AI Assistant</div>
          <div class="status">Online</div>
        </div>
        <div class="label">Powered by OpenRouter AI</div>
      </div>
      <div class="chat-messages" id="hMsgs"></div>
      <div class="chat-input">
        <input type="text" id="hIn" placeholder="Ask about my work, skills, services..." autocomplete="off">
        <button id="hSend"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div class="chat-footer">
        <div class="powered">M-HUZAIFA KHILJI · AI Assistant</div>
        <div>Try: "services" · "skills" · "contact"</div>
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
    hAddBot('Hi! I\'m M-HUZAIFA\'s AI assistant. Ask me about his work, skills, services, or anything data science related.');

    // Quick buttons
    var btnWrap=document.createElement('div');
    btnWrap.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;opacity:0;transition:opacity .3s';
    setTimeout(function(){btnWrap.style.opacity='1'},800);

    var btns=[
      {t:'What services do you offer?',q:'What services do you offer?'},
      {t:'What\'s your tech stack?',q:'What is your tech stack?'},
      {t:'How can I contact you?',q:'How can I contact you?'},
      {t:'Show me your work',q:'Show me your blog posts'},
      {t:'What is AI?',q:'What is AI?'},
      {t:'How much does it cost?',q:'How much do your services cost?'}
    ];

    btns.forEach(function(b){
      var el=document.createElement('button');
      el.textContent=b.t;
      el.style.cssText='background:none;border:1px solid #ddd;border-radius:6px;padding:6px 12px;font-family:inherit;font-size:.75rem;color:#666;cursor:pointer;transition:all .2s;white-space:nowrap';
      el.onmouseenter=function(){el.style.borderColor='var(--cyber)';el.style.color='var(--cyber)'};
      el.onmouseleave=function(){el.style.borderColor='#ddd';el.style.color='#666'};
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
          <div class="name">AI Assistant</div>
          <div class="status">Online</div>
        </div>
      </div>
      <div class="chat-messages" id="fMsgs"></div>
      <div class="chat-input">
        <input type="text" id="fIn" placeholder="Ask me anything..." autocomplete="off">
        <button id="fSend"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
      <div class="chat-footer">M-HUZAIFA KHILJI · AI Assistant</div>`;

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
          typeWrite(d,'Hi! Ask me about M-HUZAIFA\'s work, skills, or services.',18);
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
  }
}();
