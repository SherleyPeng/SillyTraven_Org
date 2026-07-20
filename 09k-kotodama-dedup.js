// 变量数组去重 v1.1 —— 模糊匹配，自动合并1~2字差异的近重复记录
var _ddDedupTimer = null;

// 标准化：去空格、全角数字转半角
function _norm(s) {
  return (s || '').trim().replace(/[０-９]/g, function(c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); });
}

// 两个字符串是否"近重复"（1~2字差异）
function _nearDup(a, b) {
  a = _norm(a);
  b = _norm(b);
  if (!a || !b) return false;
  if (a === b) return true;
  // 一个包含另一个（截断/尾部差异）
  if (a.length >= 3 && b.length >= 3 && (a.indexOf(b) !== -1 || b.indexOf(a) !== -1)) return true;
  // 字符重叠率 >= 85%
  var shorter = a.length < b.length ? a : b;
  var longer  = a.length < b.length ? b : a;
  if (shorter.length < 3) return false;
  var overlap = 0;
  for (var i = 0; i < shorter.length; i++) {
    if (longer.indexOf(shorter[i]) !== -1) overlap++;
  }
  return (overlap / shorter.length) >= 0.85;
}

// 两个交易是否近重复
function _txNearDup(txA, txB) {
  // 核心5字段必须完全一致
  if (String(txA.date||'') !== String(txB.date||'')) return false;
  if (String(txA.amount||'') !== String(txB.amount||'')) return false;
  if (String(txA.type||'') !== String(txB.type||'')) return false;
  if (String(txA.account||'') !== String(txB.account||'')) return false;
  if (String(txA.category||'') !== String(txB.category||'')) return false;
  // 核心一致，note 允许1~2字差异
  return _nearDup(txA.note, txB.note);
}

$(async function() {
  async function dedup() {
    try {
      if (typeof Mvu === 'undefined' || !Mvu.getMvuData) return;
      var cur = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
      if (!cur || !cur.stat_data) return;
      var sd = cur.stat_data;

      // ── kotodama.records 去重（模糊匹配 command）──
      var kd = ((sd.kotodama || {}).records || []);
      if (kd.length > 1) {
        var kdChanged = false;
        var deduped = [];
        for (var i = 0; i < kd.length; i++) {
          var isDup = false;
          for (var j = 0; j < deduped.length; j++) {
            if (_nearDup(kd[i].command, deduped[j].command)) {
              isDup = true;
              kdChanged = true;
              // 保留更长的 command（信息更多）
              if ((kd[i].command||'').trim().length > (deduped[j].command||'').trim().length) {
                deduped[j] = kd[i];
              }
              break;
            }
          }
          if (!isDup) deduped.push(kd[i]);
        }
        if (kdChanged) {
          for (var k = 0; k < deduped.length; k++) { deduped[k].id = k + 1; }
          if (typeof TavernHelper !== 'undefined' && TavernHelper.setVariable) {
            await TavernHelper.setVariable('kotodama.records', deduped, { type: 'message', message_id: 'latest' });
          }
          console.log('[Dedup] kotodama: ' + kd.length + ' -> ' + deduped.length);
        }
      }

      // ── finance.transactions 去重（核心字段精确 + note 模糊）──
      var txs = ((sd.finance || {}).transactions || []);
      if (txs.length > 1) {
        var txChanged = false;
        var txDeduped = [];
        for (var ti = 0; ti < txs.length; ti++) {
          var txDup = false;
          for (var tj = 0; tj < txDeduped.length; tj++) {
            if (_txNearDup(txs[ti], txDeduped[tj])) {
              txDup = true;
              txChanged = true;
              break;
            }
          }
          if (!txDup) txDeduped.push(txs[ti]);
        }
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
