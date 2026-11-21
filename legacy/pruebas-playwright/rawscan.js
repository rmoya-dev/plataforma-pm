// Detecta LaTeX sin renderizar: texto visible con $...$ o comandos \dfrac, \ln, \approx... fuera de .katex
(function(){
  window.__RAW = window.__RAW || [];
  var re = /\$[^$\n]{1,80}\$|\\(dfrac|frac|ln|approx|cdot|left|right|text|times|Rightarrow|qquad|quad|sqrt|log)\b/;
  function scan(root){
    try{
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
      while((n = w.nextNode())){
        var pe = n.parentElement; if(!pe) continue;
        if(pe.closest('.katex,.katex-mathml,script,style,textarea,annotation,[data-raw-ok]')) continue;
        if(re.test(n.textContent)) window.__RAW.push((pe.className || pe.tagName) + ' :: ' + n.textContent.trim().slice(0, 110));
      }
    }catch(e){}
  }
  var mo = new MutationObserver(function(ms){ ms.forEach(function(m){ m.addedNodes.forEach(function(a){ if(a.nodeType === 1) scan(a); else if(a.nodeType === 3 && a.parentElement) scan(a.parentElement); }); }); });
  document.addEventListener('DOMContentLoaded', function(){ mo.observe(document.body, {childList: true, subtree: true}); });
})();
