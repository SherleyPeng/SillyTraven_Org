var _ckptAutoSave = true;

$(async function() {
  if (typeof eventOn === 'function') {
    eventOn(getButtonEvent('保存变量快照'), async function() {
      try {
        await waitGlobalInitialized('Mvu');
        var cur = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
        if (!cur || !cur.stat_data || Object.keys(cur.stat_data).length === 0) {
          toastr.warning('当前无变量数据可保存');
          return;
        }
        var clone = JSON.parse(JSON.stringify(cur.stat_data));
        insertOrAssignVariables({ _mvu_checkpoint: clone }, { type: 'chat' });
        var ts = new Date().toLocaleString();
        insertOrAssignVariables({ _mvu_checkpoint_time: ts }, { type: 'chat' });
        toastr.success('变量快照已保存 (' + ts + ')');
      } catch(e) {
        toastr.error('保存失败: ' + e.message);
      }
    });
  }
});
$(window).on('pagehide', function() {});
export {};
