$(function() {
  try {
    var doc = window.parent.document;
    var div = doc.createElement('div');
    div.id = 'sb-diag';
    div.textContent = '状态栏脚本已运行 ✓';
    div.style.cssText = 'background:#7c8cf8;color:#fff;padding:8px 16px;position:fixed;top:10px;right:10px;z-index:99999;border-radius:6px;font-size:14px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,.3)';
    doc.body.appendChild(div);
  } catch(e) {
    var d2 = window.parent.document.createElement('div');
    d2.textContent = 'ERR: ' + e.message;
    d2.style.cssText = 'background:red;color:#fff;padding:10px;position:fixed;top:10px;right:10px;z-index:99999;';
    window.parent.document.body.appendChild(d2);
  }
});
export {};
