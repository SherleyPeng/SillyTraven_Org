$(async function() {
  var doc = window.parent.document;
  var lines = [];

  try {
    if (typeof waitGlobalInitialized === 'function') {
      await waitGlobalInitialized('Mvu');
    }
  } catch(e) {}

  // List keys from getVariables() (global scope)
  try {
    var gv = getVariables();
    var gkeys = Object.keys(gv);
    lines.push('getVariables() keys(' + gkeys.length + '):');
    var shown = 0;
    for (var i = 0; i < gkeys.length && shown < 20; i++) {
      var k = gkeys[i];
      var v = gv[k];
      var type = typeof v;
      var preview = '';
      if (type === 'string') preview = v.substring(0, 60);
      else if (type === 'object' && v !== null) {
        if (Array.isArray(v)) preview = 'Array[' + v.length + ']';
        else preview = 'Object{' + Object.keys(v).length + '} keys=' + Object.keys(v).slice(0,5).join(',');
      } else preview = String(v);
      lines.push('  ' + k + ': ' + type + ' = ' + preview);
      shown++;
    }
  } catch(e) { lines.push('getVariables ERR: ' + e.message); }

  // Try Mvu.getMvuData() and check nested keys
  try {
    var md = Mvu.getMvuData();
    var mdkeys = Object.keys(md);
    lines.push('Mvu.getMvuData() keys(' + mdkeys.length + '):');
    for (var j = 0; j < mdkeys.length; j++) {
      var mk = mdkeys[j];
      var mv = md[mk];
      if (typeof mv === 'object' && mv !== null && !Array.isArray(mv)) {
        var subkeys = Object.keys(mv);
        lines.push('  ' + mk + ': Object{' + subkeys.length + '} [' + subkeys.slice(0,8).join(',') + ']');
        if (mv.stat_data) lines.push('    -> HAS stat_data!');
      }
    }
  } catch(e) { lines.push('Mvu ERR: ' + e.message); }

  // Try to find stat_data anywhere
  function findSD(obj, path, depth) {
    if (depth > 5 || !obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      for (var i = 0; i < Math.min(obj.length, 3); i++) findSD(obj[i], path + '[' + i + ']', depth + 1);
      return;
    }
    var ks = Object.keys(obj);
    for (var k = 0; k < ks.length; k++) {
      var key = ks[k];
      if (key === 'stat_data') {
        lines.push('FOUND stat_data at: ' + path + '.' + key);
        return;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findSD(obj[key], path + '.' + key, depth + 1);
      }
    }
  }
  findSD(gv, 'getVariables', 1);

  var el = doc.createElement('div');
  el.style.cssText = 'position:fixed;top:10px;left:10px;z-index:99999;background:rgba(0,0,0,.9);color:#0f0;font:11px monospace;padding:10px;border-radius:4px;max-width:600px;white-space:pre-wrap;max-height:85vh;overflow-y:auto';
  el.textContent = lines.join('\n');
  doc.body.appendChild(el);
});
export {};
