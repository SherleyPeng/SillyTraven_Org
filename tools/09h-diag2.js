$(async function() {
  var doc = window.parent.document;
  var lines = [];

  // 1. Check globals
  lines.push('Mvu: ' + (typeof window.Mvu !== 'undefined' ? 'YES' : 'NO'));
  lines.push('getVariables: ' + (typeof window.getVariables === 'function' ? 'YES' : 'NO'));
  lines.push('waitGlobalInitialized: ' + (typeof window.waitGlobalInitialized === 'function' ? 'YES' : 'NO'));

  // 2. Try waitGlobalInitialized
  try {
    if (typeof waitGlobalInitialized === 'function') {
      await waitGlobalInitialized('Mvu');
      lines.push('Mvu after init: ' + (typeof window.Mvu !== 'undefined' ? 'YES' : 'NO'));
    }
  } catch(e) { lines.push('waitGlobalInit ERR: ' + e.message); }

  // 3. Check .mes elements and their children
  var msgs = doc.querySelectorAll('.mes');
  lines.push('.mes count: ' + msgs.length);
  for (var i = 0; i < Math.min(msgs.length, 3); i++) {
    var m = msgs[i];
    var hasRobot = m.querySelector('.fa-robot');
    var hasUser = m.querySelector('.fa-user');
    var kids = [];
    var children = m.querySelectorAll('*');
    for (var j = 0; j < Math.min(children.length, 5); j++) {
      kids.push(children[j].tagName + (children[j].className ? '.' + children[j].className.split(' ')[0] : ''));
    }
    lines.push('  msg['+i+'] robot=' + (hasRobot?'Y':'N') + ' user=' + (hasUser?'Y':'N') + ' kids=[' + kids.join(' ') + ']');
  }

  // 4. Where are .fa-robot elements?
  var robots = doc.querySelectorAll('.fa-robot');
  lines.push('.fa-robot total: ' + robots.length);
  for (var k = 0; k < Math.min(robots.length, 3); k++) {
    var r = robots[k];
    var inMes = r.closest('.mes');
    lines.push('  robot['+k+'] inMes=' + (inMes?'Y':'N') + ' parent=' + (r.parentElement?r.parentElement.tagName+'.'+r.parentElement.className:'?'));
  }

  // 5. Try reading data after init
  try {
    if (typeof Mvu !== 'undefined' && Mvu.getMvuData) {
      var d = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
      lines.push('Mvu.getMvuData: ' + (d ? 'GOT ' + JSON.stringify(d).substring(0, 80) : 'NULL'));
    }
  } catch(e) { lines.push('getMvuData ERR: ' + e.message); }

  try {
    if (typeof getVariables === 'function') {
      var v = getVariables({ type: 'message', message_id: 'latest' });
      lines.push('getVariables: ' + (v ? 'GOT ' + JSON.stringify(v).substring(0, 80) : 'NULL'));
    }
  } catch(e) { lines.push('getVariables ERR: ' + e.message); }

  var el = doc.createElement('div');
  el.style.cssText = 'position:fixed;top:10px;left:10px;z-index:99999;background:rgba(0,0,0,.9);color:#0f0;font:11px monospace;padding:10px;border-radius:4px;max-width:550px;white-space:pre-wrap;max-height:80vh;overflow-y:auto';
  el.textContent = lines.join('\n');
  doc.body.appendChild(el);
});
export {};
