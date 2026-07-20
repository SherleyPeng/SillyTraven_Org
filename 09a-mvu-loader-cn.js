import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js';
setTimeout(function() {
  if (typeof Mvu === 'undefined' || !Mvu.getMvuData) {
    console.error('[MVU-Loader-CN] MVU框架未就绪，请检查网络或切换国外CDN');
    if (typeof toastr !== 'undefined') toastr.warning('MVU加载失败，请切换国外CDN或检查网络');
  }
}, 5000);
