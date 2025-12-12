'use strict'
// 全局声明插件代号
const pluginname = 'hexo_butterfly_clock_remake'
// 全局声明依赖
const pug = require('pug')
const path = require('path')
const fs = require('fs')
const urlFor = require('hexo-util').url_for.bind(hexo)
const util = require('hexo-util')

hexo.extend.filter.register('after_generate', function (locals) {
  // 获取配置
  const config = hexo.config.electric_clock ? hexo.config.electric_clock : hexo.theme.config.electric_clock
  if (!(config && config.enable)) return

  const data = {
    enable_page: config.enable_page ? config.enable_page : "all",
    exclude: config.exclude,
    layout_type: config.layout.type,
    layout_name: config.layout.name,
    insert_before: config.layout.insert_before,
    insert_after: config.layout.insert_after,
    loading: config.loading ? urlFor(config.loading) : urlFor('/images/loading.gif'),
    clock_css: config.clock_css ? urlFor(config.clock_css) : urlFor('/css/clock.min.css'),
    clock_js: config.clock_js ? urlFor(config.clock_js) : urlFor('/js/clock.js'),
    qweather_key: config.qweather_key ? config.qweather_key : "e6a79dfc143a4aec961f9de5519f73e0",
    qweather_api_host: config.qweather_api_host ? config.qweather_api_host : "https://pp6tupe4xx.re.qweatherapi.com",
    gaud_map_key: config.gaud_map_key ? config.gaud_map_key : "",
    default_city: config.default_city || ''
  }

  // ---------- 复制资源文件 ----------
  const copyFile = (src, dest) => {
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
    }
    if (fs.existsSync(src)) fs.copyFileSync(src, dest)
  }

  copyFile(path.join(__dirname, './lib/clock.js'), path.join(hexo.public_dir, 'js', 'clock.js'))
  copyFile(path.join(__dirname, './lib/loading.gif'), path.join(hexo.public_dir, 'images', 'loading.gif'))
  copyFile(path.join(__dirname, './lib/clock.min.css'), path.join(hexo.public_dir, 'css', 'clock.min.css'))

  // 复制字体文件
  const fontsSourceDir = path.join(__dirname, 'lib', 'fonts')
  const fontsDestDir = path.join(hexo.public_dir, 'css', 'fonts')
  if (!fs.existsSync(fontsDestDir)) fs.mkdirSync(fontsDestDir, { recursive: true })
  const fontFiles = ['qweather-icons.ttf', 'qweather-icons.woff', 'qweather-icons.woff2']
  fontFiles.forEach(fontFile => {
    const fontSourcePath = path.join(fontsSourceDir, fontFile)
    const fontDestPath = path.join(fontsDestDir, fontFile)
    if (fs.existsSync(fontSourcePath)) {
      fs.copyFileSync(fontSourcePath, fontDestPath)
    }
  })

  // ---------- 渲染页面 ----------
  const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/html.pug'), data)

  // ---------- 注入 CSS/JS ----------
  const css_text = `<link rel="stylesheet" href="${data.clock_css}" />`
  const js_text = `<script data-pjax src="${data.clock_js}"></script>`

  // ---------- 挂载容器脚本 ----------
  const user_info_js = `<script data-pjax>
function ${pluginname}_injector_config(){
  var parent_div_git;
  var item_html = \`${temple_html_text}\`;

  // 按类型获取容器
  if ('${data.layout_type}' === 'class') {
    parent_div_git = document.getElementsByClassName('${data.layout_name}')[0];
  } else if ('${data.layout_type}' === 'id') {
    parent_div_git = document.getElementById('${data.layout_name}');
  } else {
    parent_div_git = document.getElementById('${data.layout_name}');
  }

  if(parent_div_git){
    var reference_el_before = ${data.insert_before ? `parent_div_git.querySelector('.${data.insert_before}')` : 'null'};
    var reference_el_after = ${data.insert_after ? `parent_div_git.querySelector('.${data.insert_after}')` : 'null'};

    if(reference_el_before){
      parent_div_git.insertBefore(
        (function(){var temp = document.createElement('div'); temp.innerHTML = item_html; return temp;}()),
        reference_el_before
      );
    } else if(reference_el_after){
      reference_el_after.insertAdjacentHTML('afterend', item_html);
    } else {
      parent_div_git.insertAdjacentHTML('afterbegin', item_html);
    }
  }
}

console.log('已挂载 butterfly_clock_anzhiyu-yang 修复版');

// ---------- 全局变量声明 ----------
var cpage = location.pathname;
var epage = '${data.enable_page}';
var qweather_key = '${data.qweather_key}';
var qweather_api_host = '${data.qweather_api_host}';
var default_city = '${data.default_city}';
var gaud_map_key = '${data.gaud_map_key}';

// ---------- 页面过滤 ----------
var elist = '${data.exclude}'.split(',');
var flag = 0;
for(var i=0;i<elist.length;i++){
  if(cpage.includes(elist[i])) flag++;
}

if((epage === 'all') && (flag == 0)){
  ${pluginname}_injector_config();
} else if(epage === cpage){
  ${pluginname}_injector_config();
}
</script>`

  // ---------- 注入 Hexo ----------
  hexo.extend.injector.register('body_end', user_info_js, 'default')
  hexo.extend.injector.register('body_end', js_text, 'default')
  hexo.extend.injector.register('head_end', css_text, 'default')

},
hexo.extend.helper.register('priority', function(){
  const pre_priority = hexo.config.electric_clock.priority ?  hexo.config.electric_clock.priority : hexo.theme.config.electric_clock.priority
  return pre_priority ? pre_priority : 10
})
)

