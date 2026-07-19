$(function() {
  setTimeout(function() {
    var doc = window.parent.document;
    var selectors = ['.mes', '.message', '.chat-message', '.msg', '[class*="mes"]', '[class*="msg"]', '[class*="Message"]', '[data-role]', '.assistant'];
    var result = [];
    for (var i = 0; i < selectors.length; i++) {
      try {
        var els = doc.querySelectorAll(selectors[i]);
        if (els.length) {
          var classes = [];
          for (var j = 0; j < Math.min(els.length, 3); j++) {
            classes.push(els[j].className || '(none)');
          }
          result.push(selectors[i] + ': ' + els.length + ' -> [' + classes.join('] [') + ']');
        }
      } catch(e) { result.push(selectors[i] + ': ERR ' + e.message); }
    }
    var el = doc.createElement('div');
    el.style.cssText = 'position:fixed;top:10px;left:10px;z-index:99999;background:rgba(0,0,0,.9);color:#0f0;font:11px monospace;padding:10px;border-radius:4px;max-width:500px;white-space:pre-wrap';
    el.textContent = 'DOM DIAG:\n' + result.join('\n');
    doc.body.appendChild(el);
  }, 2000);
});
export {};
