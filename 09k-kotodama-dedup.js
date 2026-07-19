// 变量数组去重 —— 双重UpdateVariable兜底，自动合并kotodama和finance重复记录
var _ddDedupTimer = null;

$(async function() {
  async function dedup() {
    try {
      if (typeof Mvu === 'undefined' || !Mvu.getMvuData) return;
      var cur = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
      if (!cur || !cur.stat_data) return;
      var sd = cur.stat_data;

      // ── kotodama.records 去重 (by command) ──
      var kd = ((sd.kotodama || {}).records || []);
      if (kd.length > 1) {
        var seen = {}, kdChanged = false;
        var deduped = kd.filter(function(r) {
          var key = (r.command || '').trim();
          if (!key) return true;
          if (seen[key]) { kdChanged = true; return false; }
          seen[key] = true;
          return true;
        });
        if (kdChanged) {
          for (var i = 0; i < deduped.length; i++) { deduped[i].id = i + 1; }
          if (typeof TavernHelper !== 'undefined' && TavernHelper.setVariable) {
            await TavernHelper.setVariable('kotodama.records', deduped, { type: 'message', message_id: 'latest' });
          }
          console.log('[Dedup] kotodama: ' + kd.length + ' -> ' + deduped.length);
        }
      }

      // ── finance.transactions 去重 (by fingerprint) ──
      var txs = ((sd.finance || {}).transactions || []);
      if (txs.length > 1) {
        var txSeen = {}, txChanged = false;
        var txDeduped = txs.filter(function(tx) {
          var fp = [tx.date, tx.amount, tx.type, tx.account, tx.category, tx.note].map(function(v) { return (v != null ? String(v) : ''); }).join('|');
          if (!fp || fp === '|||||') return true;
          if (txSeen[fp]) { txChanged = true; return false; }
          txSeen[fp] = true;
          return true;
        });
        if (txChanged) {
          if (typeof TavernHelper !== 'undefined' && TavernHelper.setVariable) {
            await TavernHelper.setVariable('finance.transactions', txDeduped, { type: 'message', message_id: 'latest' });
          }
          console.log('[Dedup] transactions: ' + txs.length + ' -> ' + txDeduped.length);
        }
      }
    } catch(e) { console.warn('[Dedup]', e); }
  }

  // Hook into variable update end
  try {
    if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined') {
      eventOn(tavern_events.VARIABLE_UPDATE_ENDED, function() {
        if (_ddDedupTimer) clearTimeout(_ddDedupTimer);
        _ddDedupTimer = setTimeout(dedup, 600);
      });
    }
  } catch(e) {}
  try {
    if (typeof eventOn === 'function' && typeof Mvu !== 'undefined' && Mvu.events) {
      eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, function() {
        if (_ddDedupTimer) clearTimeout(_ddDedupTimer);
        _ddDedupTimer = setTimeout(dedup, 600);
      });
    }
  } catch(e) {}
});
