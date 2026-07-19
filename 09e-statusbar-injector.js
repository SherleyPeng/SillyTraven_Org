var _curData = {};
var _initDone = false;
var _log = [];

function _trace(msg) {
  _log.push(new Date().toLocaleTimeString() + ' ' + msg);
  if (_log.length > 6) _log.shift();
  var doc = window.parent.document;
  var el = doc.getElementById('sb-trace');
  if (!el) {
    el = doc.createElement('div'); el.id = 'sb-trace';
    el.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:99999;background:rgba(0,0,0,.85);color:#0f0;font:10px monospace;padding:6px 10px;border-radius:4px;line-height:1.4';
    doc.body.appendChild(el);
  }
  el.textContent = _log.join('\n');
}

function _readData() {
  try { if (typeof Mvu !== 'undefined' && Mvu.getMvuData) { var r = Mvu.getMvuData({type:'message',message_id:0}); if (r && r.stat_data && Object.keys(r.stat_data).length>0) return r.stat_data; } } catch(e) {}
  try { if (typeof getVariables === 'function') { var v = getVariables({type:'message',message_id:0}); if (v && v.stat_data && Object.keys(v.stat_data).length>0) return v.stat_data; } } catch(e) {}
  return null;
}

function _g(obj,path,def){if(!obj||!path)return def;var k=path.replace(/\[(\d+)\]/g,'.$1').split('.'),c=obj;for(var i=0;i<k.length;i++){if(c==null)return def;c=c[k[i]];}return c!=null?c:def;}
function _s(v,d){return(v==null||v==='')?(d||'-'):String(v);}
function _n(v,d){var n=Number(v);return isNaN(n)?(d!=null?String(d):'0'):String(n);}

var _CSS='#sb-r{background:#0f0f1a;color:#e0e0e0;font:13px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;padding:10px;margin:8px 0;max-width:600px;border-radius:10px;border:1px solid rgba(255,255,255,.08)}#sb-r *{margin:0;padding:0;box-sizing:border-box}.sbtb{display:flex;gap:4px;padding:6px;background:rgba(255,255,255,.06);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);border-radius:10px;margin-bottom:10px}.sbt{flex:1;padding:8px 4px;border:none;background:transparent;color:#888;font-size:12px;cursor:pointer;border-radius:8px}.sbt:hover{background:rgba(255,255,255,.1)}.sbt.act{background:rgba(124,140,248,.25);color:#7c8cf8;font-weight:600}.sbp{display:none}.sbp.act{display:block}.sbc{background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 14px;margin-bottom:8px}.sbc-h{display:flex;justify-content:space-between;margin-bottom:8px}.sbc-t{font-size:13px;font-weight:600;color:#fff}.sbc-s{font-size:11px;color:#888}.sbg{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px 12px}.sbf{display:flex;flex-direction:column}.sbfl{font-size:11px;color:#888;letter-spacing:.5px}.sbfv{font-size:13px;color:#e0e0e0}.sbch{display:flex;flex-wrap:wrap;gap:4px}.sbci{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:3px 8px;font-size:11px}.sbr{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px}.sbr-l{color:#fff;font-weight:600}.sbr-r{color:#888}.sba{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)}.sba-v{font-size:16px;font-weight:600;color:#fff}.sbtx{max-height:200px;overflow-y:auto}.sbt2{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:11px}.sbt-d{color:#888;width:70px;flex-shrink:0}.sbt-c{color:#888;width:56px;flex-shrink:0;text-align:center}.sbt-a{font-weight:600;width:64px;flex-shrink:0;text-align:right}.sbin{color:#34d399}.sbout{color:#f87171}.sbtm{text-align:center;padding:20px 10px}.sbc-cl{font-size:36px;font-weight:200;color:#fff;letter-spacing:3px}.sbc-dt{font-size:16px;color:#e0e0e0;margin-top:4px}.sbc-wd{font-size:13px;color:#7c8cf8;margin-top:2px}.sbc-we{font-size:20px;margin-top:6px}.sbc-sn{font-size:12px;color:#888;margin-top:2px}.sbe{text-align:center;padding:30px;color:#888}';

function renderProfile(sd){var p=sd.profile||{},bg=p.background||{},st=p.status||{},app=p.appearance||{},inv=p.inventory||[],rels=p.relationships||{};var h='';function f(l,v){return'<div class="sbf"><span class="sbfl">'+l+'</span><span class="sbfv">'+v+'</span></div>';}h+='<div class="sbc"><div class="sbc-h"><span class="sbc-t">'+_s(p.name)+'</span><span class="sbc-s">'+_s(p.occupation)+'</span></div><div class="sbg">';h+=f('性别',_s(p.gender));h+=f('年龄',_n(p.age)+'岁');h+=f('出生',_n(p.birth_year)+'.'+_n(p.birth_month)+'.'+_n(p.birth_day));h+=f('外貌',_s(app.build)+(app.full?', '+_s(app.full):''));h+=f('身体',_s(st.physical));h+=f('精神',_s(st.mental));h+='</div></div><div class="sbc"><div class="sbc-t" style="margin-bottom:6px">背景</div><div class="sbg">';h+=f('家乡',_s(bg.hometown));h+=f('教育',_s(bg.education));h+=f('居住',_s(bg.living));h+=f('求职',_s(bg.job_status));h+='</div></div><div class="sbc"><div class="sbc-t" style="margin-bottom:6px">物品</div>';if(inv.length){h+='<div class="sbch">';for(var i=0;i<inv.length;i++)h+='<span class="sbci">'+_s(inv[i].name)+(inv[i].desc?' ('+_s(inv[i].desc)+')':'')+'</span>';h+='</div>';}else h+='<span class="sbfl">暂无</span>';h+='</div>';var rk=Object.keys(rels);if(rk.length){h+='<div class="sbc"><div class="sbc-t" style="margin-bottom:6px">关系 ('+rk.length+')</div>';for(var ri=0;ri<rk.length;ri++){var rel=rels[rk[ri]];h+='<div class="sbr"><span class="sbr-l">'+_s(rel.name)+'</span><span class="sbr-r">'+_s(rel.relation)+' - '+_s(rel.status)+'</span></div>';}h+='</div>';}return h;}
function renderFinance(sd){var f=sd.finance||{},a=f.assets||{},tx=f.transactions||[],ak=Object.keys(a);var h='<div class="sbc"><div class="sbc-t" style="margin-bottom:8px">资产</div>';if(ak.length)for(var i=0;i<ak.length;i++)h+='<div class="sba"><span>'+_s(ak[i])+'</span><span class="sba-v">'+_n(a[ak[i]],'0')+' 元</span></div>';else h+='<span class="sbfl">暂无</span>';h+='</div>';if(tx.length){h+='<div class="sbc"><div class="sbc-t" style="margin-bottom:6px">收支</div><div class="sbtx">';var st=Math.max(0,tx.length-10);for(var ti=st;ti<tx.length;ti++){var t=tx[ti],inc=t.type==='收入';h+='<div class="sbt2"><span class="sbt-d">'+_s(t.date)+'</span><span class="sbt-c">'+_s(t.category)+'</span><span class="sbt-a '+(inc?'sbin':'sbout')+'">'+(inc?'+':'')+_n(t.amount,'0')+'</span></div>';}h+='</div></div>';}return h;}
function renderTime(sd){var t=sd.time||{};return'<div class="sbc sbtm"><div class="sbc-cl">'+String(t.hour||0).padStart(2,'0')+':'+String(t.minute||0).padStart(2,'0')+'</div><div class="sbc-dt">'+_n(t.year)+'年'+_n(t.month)+'月'+_n(t.day)+'日</div><div class="sbc-wd">'+_s(t.weekday)+'</div><div class="sbc-we">'+_s(t.weather)+'</div><div class="sbc-sn">'+_s(t.season)+'</div></div>';}
function renderRelations(sd){var sx=sd.sexual||{},ml=sd.npc_male||{},sk=Object.keys(sx),mk=Object.keys(ml),h='';function b(v,m,c){var p=Math.min(100,Math.max(0,(Number(v)||0)/(Number(m)||1)*100));return'<span style="width:56px;height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden;display:inline-block;vertical-align:middle;margin-right:3px"><span style="height:100%;border-radius:2px;display:block;background:'+(c==='aff'?'#f472b6':'#7c8cf8')+';width:'+p+'%"></span></span>'+Math.round(p);}if(sk.length)for(var i=0;i<sk.length;i++){var u=sk[i],sn=sx[u],ph=_g(sn,'menstrual.current_phase','?');h+='<div class="sbc"><div class="sbc-h"><span class="sbc-t">'+_s(sn.name)+'</span><span class="sbc-s">'+_n(sn.age)+'岁</span></div><div class="sbg"><div class="sbf"><span class="sbfl">好感</span><span class="sbfv">'+b(sn.affection,100,'aff')+'</span></div><div class="sbf"><span class="sbfl">服从</span><span class="sbfv">'+b(sn.obedience,100,'obed')+'</span></div><div class="sbf"><span class="sbfl">月经</span><span class="sbfv">'+_s(ph)+'</span></div><div class="sbf"><span class="sbfl">处女</span><span class="sbfv">'+(sn.is_virgin?'是':'否')+'</span></div><div class="sbf"><span class="sbfl">经验</span><span class="sbfv">'+_n((sn.experience||{}).total)+'次</span></div><div class="sbf"><span class="sbfl">穿着</span><span class="sbfv">'+_s(sn.outfit)+'</span></div></div></div>';}if(mk.length)for(var mi=0;mi<mk.length;mi++){var mn=ml[mk[mi]];h+='<div class="sbc"><div class="sbc-h"><span class="sbc-t">'+_s(mn.name)+'</span><span class="sbc-s">'+_n(mn.age)+'岁</span></div><div class="sbg"><div class="sbf"><span class="sbfl">职业</span><span class="sbfv">'+_s(mn.occupation)+'</span></div><div class="sbf"><span class="sbfl">关系</span><span class="sbfv">'+_s(mn.social_status)+'</span></div></div></div>';}return h||'<div class="sbe">暂无 NPC</div>';}

function _inject() {
  var doc = window.parent.document;
  if (!doc.getElementById('sbcss')) { var s=doc.createElement('style'); s.id='sbcss'; s.textContent=_CSS; doc.head.appendChild(s); }
  var msgs = doc.querySelectorAll('.mes');
  _trace('msgs='+msgs.length);
  for (var i = msgs.length - 1; i >= 0; i--) {
    var msg = msgs[i];
    if (msg.querySelector('#sb-r')) continue;
    var r = doc.createElement('div'); r.id = 'sb-r';
    r.innerHTML = '<div class="sbtb"><button class="sbt act" data-i="0">\u{1F464} 人物</button><button class="sbt" data-i="1">\u{1F4B0} 财务</button><button class="sbt" data-i="2">\u{1F550} 时间</button><button class="sbt" data-i="3">\u{1F495} 关系</button></div><div class="sbp act" id="sb-p-0"><div class="sbe">-</div></div><div class="sbp" id="sb-p-1"><div class="sbe">-</div></div><div class="sbp" id="sb-p-2"><div class="sbe">-</div></div><div class="sbp" id="sb-p-3"><div class="sbe">-</div></div>';
    msg.appendChild(r);
    r.querySelectorAll('.sbt').forEach(function(t){t.onclick=function(){r.querySelectorAll('.sbt').forEach(function(x){x.classList.remove('act')});r.querySelectorAll('.sbp').forEach(function(x){x.classList.remove('act')});t.classList.add('act');var p=r.querySelector('#sb-p-'+t.getAttribute('data-i'));if(p)p.classList.add('act');};});
    _trace('SB+');
  }
  var roots = doc.querySelectorAll('#sb-r');
  if (roots.length) {
    var sd = _curData || {};
    for (var ri=0;ri<roots.length;ri++) {
      var rt=roots[ri];
      (rt.querySelector('#sb-p-0')||{}).innerHTML=renderProfile(sd)||'<div class="sbe">暂无数据</div>';
      (rt.querySelector('#sb-p-1')||{}).innerHTML=renderFinance(sd)||'<div class="sbe">暂无数据</div>';
      (rt.querySelector('#sb-p-2')||{}).innerHTML=renderTime(sd)||'<div class="sbe">暂无数据</div>';
      (rt.querySelector('#sb-p-3')||{}).innerHTML=renderRelations(sd)||'<div class="sbe">暂无数据</div>';
    }
     _trace('DATA '+(sd&&sd.time?'Y':'N'));
  }
}

function _tick() {
  var d = _readData();
  if (d) _curData = d;
  _inject();
}

$(async function() {
  try { if (typeof waitGlobalInitialized === 'function') await waitGlobalInitialized('Mvu'); } catch(e) {}
  setTimeout(function() { _tick(); _initDone = true; }, 2000);
  setInterval(function() { if (_initDone) _tick(); }, 2000);
});
export {};
