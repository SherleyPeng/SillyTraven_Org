$(async function() {
  if (typeof eventOn === 'function') {
    eventOn(getButtonEvent('恢复变量快照'), async function() {
      try {
        await waitGlobalInitialized('Mvu');
        var vars = getVariables({ type: 'chat' });
        var snapshot = vars && vars._mvu_checkpoint;

        if (!snapshot || Object.keys(snapshot).length === 0) {
          toastr.warning('未找到快照。请先在原分支点击"保存变量快照"。');
          return;
        }

        var ts = (vars && vars._mvu_checkpoint_time) || '未知时间';
        if (!confirm('确认从快照恢复变量？（保存时间: ' + ts + '）\n\n当前变量将被覆盖。')) {
          return;
        }

        Mvu.replaceMvuData(snapshot);
        toastr.success('已恢复 (' + ts + ')。状态栏如未刷新请按 F5。');
      } catch(e) {
        toastr.error('恢复失败: ' + e.message);
        console.error(e);
      }
    });
  }
});
$(window).on('pagehide', function() {});
export {};
