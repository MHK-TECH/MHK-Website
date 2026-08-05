!function(){
  var ARTICLES=[
    {
      title:'OpenAI Releases GPT-5 with Breakthrough Reasoning Capabilities',
      desc:'The latest model shows significant improvements in multi-step reasoning, math, and code generation. Available via API for developers.',
      source:'OpenAI Blog',
      date:'Aug 05, 2026',
      tag:'AI',
      url:'https://openai.com/blog'
    },
    {
      title:'Google DeepMind Achieves New Milestone in Protein Structure Prediction',
      desc:'AlphaFold 3 now predicts protein interactions with unprecedented accuracy, opening doors for drug discovery and molecular biology.',
      source:'DeepMind',
      date:'Aug 03, 2026',
      tag:'Science',
      url:'https://deepmind.google'
    },
    {
      title:'Meta Open-Sources Llama 4: 400B Parameters, Runs on Consumer Hardware',
      desc:'New quantization techniques allow the largest open-source model to run on a single RTX 4090. Community already building tools.',
      source:'Meta AI',
      date:'Aug 01, 2026',
      tag:'LLM',
      url:'https://ai.meta.com'
    },
    {
      title:'n8n Reaches 50K Active Installations, Launches AI Agent Nodes',
      desc:'The popular workflow automation platform adds native AI agent support with tool calling and memory management.',
      source:'n8n.io',
      date:'Jul 30, 2026',
      tag:'Automation',
      url:'https://n8n.io'
    },
    {
      title:'NVIDIA Announces Blackwell Ultra: 2x Performance for AI Training',
      desc:'Next-gen GPUs deliver 2x throughput for LLM training. Expected availability Q4 2026.',
      source:'NVIDIA',
      date:'Jul 28, 2026',
      tag:'Hardware',
      url:'https://nvidia.com'
    },
    {
      title:'Hugging Face Launches Free Tier for Model Hosting and Inference',
      desc:'Developers can now host and serve models at zero cost with rate-limited inference. Game changer for small teams.',
      source:'Hugging Face',
      date:'Jul 26, 2026',
      tag:'ML Ops',
      url:'https://huggingface.co'
    },
    {
      title:'Python 3.14 Beta Released with 30% Speed Improvement',
      desc:'Faster startup, better memory management, and new type hint features. Stable release expected October 2026.',
      source:'Python.org',
      date:'Jul 24, 2026',
      tag:'Programming',
      url:'https://python.org'
    },
    {
      title:'Research: New Attack Vector Found in RAG Systems',
      desc:'Security researchers demonstrate prompt injection attacks through retrieved documents. Solutions include input sanitization and trust scoring.',
      source:'arXiv',
      date:'Jul 22, 2026',
      tag:'Security',
      url:'https://arxiv.org'
    },
    {
      title:'Apache Spark 4.0 Introduces Native Python UDF Performance Boost',
      desc:'PySpark UDFs now run 5x faster with native integration. Data engineering pipelines see immediate speed improvements.',
      source:'Apache Blog',
      date:'Jul 20, 2026',
      tag:'Data',
      url:'https://spark.apache.org'
    },
    {
      title:'EU AI Act Enforcement Begins: What Developers Need to Know',
      desc:'New regulations require transparency labels, risk assessments, and human oversight for high-risk AI systems.',
      source:'EU Commission',
      date:'Jul 18, 2026',
      tag:'Policy',
      url:'https://digital-strategy.ec.europa.eu'
    },
    {
      title:'LangChain 0.3 Released: Simplified Agent Architecture',
      desc:'Major refactor reduces boilerplate code by 60%. New streaming support and tool-calling improvements.',
      source:'LangChain',
      date:'Jul 16, 2026',
      tag:'AI',
      url:'https://langchain.com'
    },
    {
      title:'Breakthrough: Quantum Error Correction Achieves 99.9% Accuracy',
      desc:'Google and IBM teams independently achieve fault-tolerant quantum computing thresholds. Practical quantum advantage draws closer.',
      source:'Nature',
      date:'Jul 14, 2026',
      tag:'Science',
      url:'https://nature.com'
    }
  ];

  var container=document.getElementById('newsFeed');
  if(!container)return;

  var shown=6;

  function render(){
    var html='';
    for(var i=0;i<Math.min(shown,ARTICLES.length);i++){
      var a=ARTICLES[i];
      html+='<a href="'+a.url+'" target="_blank" rel="noopener" class="news-card" style="text-decoration:none;color:inherit">';
      html+='<div class="source">'+a.source+'</div>';
      html+='<div class="title">'+a.title+'</div>';
      html+='<div class="desc">'+a.desc+'</div>';
      html+='<div class="meta"><span>'+a.date+'</span><span class="tag">'+a.tag+'</span></div>';
      html+='</a>';
    }
    container.innerHTML=html;

    if(shown<ARTICLES.length){
      document.getElementById('newsLoad').innerHTML='<button onclick="window._loadMore()">Load more</button>';
    }else{
      document.getElementById('newsLoad').innerHTML='';
    }
  }

  window._loadMore=function(){
    shown+=4;
    render();
  };

  render();
}();
