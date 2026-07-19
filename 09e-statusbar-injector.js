var _curData = {};
var _initDone = false;

function _readData() {
  // Try multiple message scopes
  var methods = [
    function() { if (typeof Mvu !== 'undefined' && Mvu.getMvuData) return Mvu.getMvuData({ type: 'message', message_id: 0 }); },
    function() { if (typeof Mvu !== 'undefined' && Mvu.getMvuData) return Mvu.getMvuData({ type: 'message', message_id: -1 }); },
    function() { if (typeof Mvu !== 'undefined' && Mvu.getMvuData) return Mvu.getMvuData({ type: 'message', message_id: 1 }); },
    function() { if (typeof getVariables === 'function') return getVariables({ type: 'message', message_id: 0 }); },
    function() { if (typeof getVariables === 'function') return getVariables({ type: 'message', message_id: -1 }); },
    function() { if (typeof getVariables === 'function') return getVariables(); }
  ];
  for (var i = 0; i < methods.length; i++) {
    try {
      var r = methods[i]();
      if (r && r.stat_data && Object.keys(r.stat_data).length > 0) return r.stat_data;
    } catch(e) {}
  }
  return null;
}

function _g(obj,path,def){if(!obj||!path)return def;var k=path.replace(/\[(\d+)\]/g,'.$1').split('.'),c=obj;for(var i=0;i<k.length;i++){if(c==null)return def;c=c[k[i]];}return c!=null?c:def;}
function _s(v,d){return(v==null||v==='')?(d||'-'):String(v);}
function _n(v,d){var n=Number(v);return isNaN(n)?(d!=null?String(d):'0'):String(n);}

function renderProfile(sd) {
  var p=sd.profile||{},bg=p.background||{},st=p.status||{},app=p.appearance||{},inv=p.inventory||[],rels=p.relationships||{},rKeys=Object.keys(rels);
  var h='<div class="sbc"><div class="sbc-h"><span class="sbc-t">'+_s(p.name)+'</span><span class="sbc-s">'+_s(p.occupation)+'</span></div><div class="sbg">';
  function f(l,v){return'<div class="sbf"><span class="sbfl">'+l+'</span><span class="sbfv">'+v+'</span></div>';}
  h+=f('性别',_s(p.gender));h+=f('年龄',_n(p.age)+'岁');h+=f('出生',_n(p.birth_year)+'.'+_n(p.birth_month)+'.'+_n(p.birth_day));
  h+=f('外貌',_s(app.build)+(app.full?', '+_s(app.full):''));h+=f('身体',_s(st.physical));h+=f('精神',_s(st.mental));
  h+='</div></div><div class="sbc"><div class="sbc-t" style="margin-bottom:6px">背景</div><div class="sbg">';
  h+=f('家乡',_s(bg.hometown));h+=f('教育',_s(bg.education));h+=f('居住',_s(bg.living));h+=f('求职',_s(bg.job_status));
  h+='</div></div><div class="sbc"><div class="sbc-t" style="margin-bottom:6px">物品</div>';
  if(inv.length){h+='<div class="sbch">';for(var i=0;i<inv.length;i++)h+='<span class="sbci">'+_s(inv[i].name)+(inv[i].desc?' ('+_s(inv[i].desc)+')':'')+'</span>';h+='</div>';}else h+='<span class="sbfl">暂无</span>';
  h+='</div>';
  if(rKeys.length){h+='<div class="sbc"><div class="sbc-t" style="margin-bottom:6px">关系 ('+rKeys.length+')</div>';
    for(var ri=0;ri<rKeys.length;ri++){var rel=rels[rKeys[ri]];h+='<div class="sbr"><span class="sbr-l">'+_s(rel.name)+'</span><span class="sbr-r">'+_s(rel.relation)+' - '+_s(rel.status)+'</span></div>';}h+='</div>';}
  return h;
}

function renderFinance(sd) {
  var f=sd.finance||{},assets=f.assets||{},txs=f.transactions||[],aKeys=Object.keys(assets);
  var h='<div class="sbc"><div class="sbc-t" style="margin-bottom:8px">资产</div>';
  if(aKeys.length)for(var i=0;i<aKeys.length;i++)h+='<div class="sba"><span>'+_s(aKeys[i])+'</span><span class="sba-v">'+_n(assets[aKeys[i]],'0')+' 元</span></div>';
  else h+='<span class="sbfl">暂无</span>';
  h+='</div>';
  if(txs.length){h+='<div class="sbc"><div class="sbc-t" style="margin-bottom:6px">收支</div><div class="sbtx">';
    var st=Math.max(0,txs.length-10);for(var ti=st;ti<txs.length;ti++){var tx=txs[ti],inc=tx.type==='收入';
      h+='<div class="sbt2"><span class="sbt-d">'+_s(tx.date)+'</span><span class="sbt-c">'+_s(tx.category)+'</span><span class="sbt-a '+(inc?'sbin':'sbout')+'">'+(inc?'+':'')+_n(tx.amount,'0')+'</span></div>';}
    h+='</div></div>';}
  return h;
}

function renderTime(sd){var t=sd.time||{};return'<div class="sbc sbtm"><div class="sbc-cl">'+String(t.hour||0).padStart(2,'0')+':'+String(t.minute||0).padStart(2,'0')+'</div><div class="sbc-dt">'+_n(t.year)+'年'+_n(t.month)+'月'+_n(t.day)+'日</div><div class="sbc-wd">'+_s(t.weekday)+'</div><div class="sbc-we">'+_s(t.weather)+'</div><div class="sbc-sn">'+_s(t.season)+'</div></div>';}

function renderRelations(sd){var sx=sd.sexual||{},ml=sd.npc_male||{},sk=Object.keys(sx),mk=Object.keys(ml),h='';
  function b(v,m,c){var p=Math.min(100,Math.max(0,(Number(v)||0)/(Number(m)||1)*100));return'<span class="sbbw" style="width:56px;height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden;display:inline-block;vertical-align:middle;margin-right:3px"><span style="height:100%;border-radius:2px;display:block;background:'+(c==='aff'?'#f472b6':'#7c8cf8')+';width:'+p+'%"></span></span>'+Math.round(p);}
  if(sk.length)for(var i=0;i<sk.length;i++){var u=sk[i],sn=sx[u],ph=_g(sn,'menstrual.current_phase','安全期');
    h+='<div class="sbc"><div class="sbc-h"><span class="sbc-t">'+_s(sn.name)+'</span><span class="sbc-s">'+_n(sn.age)+'岁</span></div>';
    h+='<div class="sbg"><div class="sbf"><span class="sbfl">好感</span><span class="sbfv">'+b(sn.affection,100,'aff')+'</span></div><div class="sbf"><span class="sbfl">服从</span><span class="sbfv">'+b(sn.obedience,100,'obed')+'</span></div>';
    h+='<div class="sbf"><span class="sbfl">月经</span><span class="sbfv">'+_s(ph)+'</span></div>';
    h+='<div class="sbf"><span class="sbfl">处女</span><span class="sbfv">'+(sn.is_virgin?'是':'否')+'</span></div>';
    h+='<div class="sbf"><span class="sbfl">经验</span><span class="sbfv">'+_n((sn.experience||{}).total||0)+'次</span></div>';
    h+='<div class="sbf"><span class="sbfl">穿着</span><span class="sbfv">'+_s(sn.outfit)+'</span></div></div></div>';}
  if(mk.length)for(var mi=0;mi<mk.length;mi++){var mn=ml[mk[mi]];h+='<div class="sbc"><div class="sbc-h"><span class="sbc-t">'+_s(mn.name)+'</span><span class="sbc-s">'+_n(mn.age)+'岁</span></div><div class="sbg"><div class="sbf"><span class="sbfl">职业</span><span class="sbfv">'+_s(mn.occupation)+'</span></div><div class="sbf"><span class="sbfl">关系</span><span class="sbfv">'+_s(mn.social_status)+'</span></div></div></div>';}
  return h||'<div class="sbe">暂无 NPC</div>';
}

function _refreshAll() {
  var doc = window.parent.document;
  var roots = doc.querySelectorAll('#sb-r');
  if (!roots.length) return;
  var sd = _curData || {};
  for (var ri = 0; ri < roots.length; ri++) {
    var r = roots[ri];
    var p0 = r.querySelector('#sb-p-0'); if (p0) p0.innerHTML = renderProfile(sd) || '<div class="sbe">暂无数据</div>';
    var p1 = r.querySelector('#sb-p-1'); if (p1) p1.innerHTML = renderFinance(sd) || '<div class="sbe">暂无数据</div>';
    var p2 = r.querySelector('#sb-p-2'); if (p2) p2.innerHTML = renderTime(sd) || '<div class="sbe">暂无数据</div>';
    var p3 = r.querySelector('#sb-p-3'); if (p3) p3.innerHTML = renderRelations(sd) || '<div class="sbe">暂无数据</div>';
    // Bind tabs if not already bound
    if (!r._sbBound) {
      r._sbBound = true;
      r.querySelectorAll('.sbt').forEach(function(t) {
        t.addEventListener('click', function() {
          r.querySelectorAll('.sbt').forEach(function(x) { x.classList.remove('act'); });
          r.querySelectorAll('.sbp').forEach(function(x) { x.classList.remove('act'); });
          t.classList.add('act');
          var p = r.querySelector('#sb-p-' + t.getAttribute('data-i'));
          if (p) p.classList.add('act');
        });
      });
    }
  }
}

function _tick() {
  var d = _readData();
  if (d) _curData = d;
  _refreshAll();
}

$(async function() {
  try { if (typeof waitGlobalInitialized === 'function') await waitGlobalInitialized('Mvu'); } catch(e) {}
  setTimeout(function() { _tick(); _initDone = true; }, 2000);
  setInterval(function() { if (_initDone) _tick(); }, 3000);
});
export {};
