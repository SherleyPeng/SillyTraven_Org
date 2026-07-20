var _obsPrev = null;

$(async function() {
  async function capture() {
    try {
      var cur = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
      if (_obsPrev && cur && cur.stat_data) {
        var prevStr = JSON.stringify(_obsPrev.stat_data);
        var curStr = JSON.stringify(cur.stat_data);
        if (prevStr !== curStr) {
          console.log('[VarObs] stat_data changed');
        }
      }
      _obsPrev = cur ? JSON.parse(JSON.stringify(cur)) : null;
    } catch(e) { console.warn('[VarObs]', e); }
  }

  if (typeof eventOn === 'function' && typeof Mvu !== 'undefined' && Mvu.events) {
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, function() { setTimeout(capture, 200); });
  }
  if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined') {
    eventOn(tavern_events.VARIABLE_UPDATE_ENDED, function() { setTimeout(capture, 200); });
  }
  capture();
});

export {};
