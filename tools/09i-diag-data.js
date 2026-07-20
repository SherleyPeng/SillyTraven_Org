$(async function() {
  var doc = window.parent.document;
  var lines = [];

  try {
    if (typeof waitGlobalInitialized === 'function') {
      await waitGlobalInitialized('Mvu');
      lines.push('Mvu ready: YES');
    }
  } catch(e) { lines.push('init ERR: ' + e.message); }

  // Try different ways to read data
  var tests = [
    ['Mvu.getMvuData()', function() { return Mvu.getMvuData(); }],
    ['Mvu.getMvuData("latest")', function() { return Mvu.getMvuData('latest'); }],
    ['Mvu.getMvuData({type:"message",message_id:-1})', function() { return Mvu.getMvuData({type:'message',message_id:-1}); }],
    ['Mvu.getMvuData({type:"message",message_id:0})', function() { return Mvu.getMvuData({type:'message',message_id:0}); }],
    ['Mvu.getMvuData({type:"message",message_id:1})', function() { return Mvu.getMvuData({type:'message',message_id:1}); }],
    ['getVariables()', function() { return getVariables(); }],
    ['getVariables({type:"message"})', function() { return getVariables({type:'message'}); }],
    ['getVariables({type:"chat"})', function() { return getVariables({type:'chat'}); }]
  ];

  for (var i = 0; i < tests.length; i++) {
    try {
      var result = tests[i][1]();
      if (result && typeof result === 'object') {
        var keys = Object.keys(result);
        var hasSD = result.stat_data ? 'HAS stat_data' : 'NO stat_data';
        lines.push(tests[i][0] + ': keys=' + keys.length + ' ' + hasSD);
        if (keys.length && keys.length <= 10) lines.push('  keys: [' + keys.join(', ') + ']');
      } else {
        lines.push(tests[i][0] + ': ' + JSON.stringify(result));
      }
    } catch(e) { lines.push(tests[i][0] + ': ERR ' + e.message); }
  }

  // Check .mes for any distinguishing class
  var msgs = doc.querySelectorAll('.mes');
  for (var j = 0; j < Math.min(msgs.length, 3); j++) {
    var m = msgs[j];
    lines.push('mes['+j+'] classes=' + (m.className||'(none)') + ' data-attrs=' + Array.from(m.attributes).filter(function(a){return a.name.startsWith('data-');}).map(function(a){return a.name+'='+a.value;}).join(' '));
  }

  var el = doc.createElement('div');
  el.style.cssText = 'position:fixed;top:10px;left:10px;z-index:99999;background:rgba(0,0,0,.9);color:#0f0;font:11px monospace;padding:10px;border-radius:4px;max-width:550px;white-space:pre-wrap;max-height:80vh;overflow-y:auto';
  el.textContent = lines.join('\n');
  doc.body.appendChild(el);
});
export {};
