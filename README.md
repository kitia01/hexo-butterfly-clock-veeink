# hexo-butterfly-clock-veeink

>  [!IMPORTANT]
>  这是基于[hoochanlon/hexo-butterfly-clock-remake](https://github.com/hoochanlon/hexo-butterfly-clock-remake) 项目修改而来的版本，新增高德地图 IP 定位支持
>  适用于 **Hexo + Butterfly 主题**，提供实时天气、时间、城市自动定位等功能。

### 功能特性

1. 以和风天气API为执行基础。
1. 通过IP定位API拿到城市位置，通过城市位置拿到和风天气location id
1. 再通过location id获取到天气
1. 增加高德地图api方案


### 安装

【1】卸载旧时钟插件

```bash
npm uninstall hexo-butterfly-clock
npm uninstall hexo-butterfly-clock-anzhiyu 
npm uninstall hexo-butterfly-clock-anzhiyu-yang
npm uninstall hexo-butterfly-clock-remake
```

【2】安装本插件：

```bash
npm install hexo-butterfly-clock-veeink
```

### 使用

【1】 在站点配置文件 _config.yml 或者主题配置文件 _config.butterfly.yml 中添加：

> [!NOTE]
> 提示：使用该插件需注册和风天气开发者账号，并使用自己的和风天气api host和key。
> 
> 👉：https://dev.qweather.com

```yml
# electric_clock
# see：https://github.com/kitia01/hexo-butterfly-clock-veeink
electric_clock:
  enable: true           # 插件开关
  priority: 5            # 过滤器优先级
  enable_page: all       # 应用页面，可写特定路径或 "all"
  exclude:            # 排除页面，可留空或写具体路径
    # - /posts/
    # - /about/
  layout:
    type: class          # 容器类型，class 或 id
    name: aside-content  # 目标容器的 class 或 id
    # insert_before: user-countdown   # 插入到该元素前面 
    insert_after: card-announcement  # 插入到该元素后面（二选一）
  loading: https://cdn.cbd.int/hexo-butterfly-clock-veeink@1.0.0/lib/loading.gif
  clock_css: https://cdn.cbd.int/hexo-butterfly-clock-veeink@1.0.0/lib/clock-min.css
  clock_js: https://cdn.cbd.int/hexo-butterfly-clock-veeink@1.0.0/lib/clock-min.js
  qweather_api_host: {YOUR API HOST}
  qweather_key: {YOUR KEY}
  # 新增：高德地图 Web 服务 Key
  gaud_map_key: {YOUR KEY} # 高得地图web服务key
  default_city: "资兴"
```


【2】 参数释义

|参数|类型|释义|
|:--|:--|:--|
|priority|number|【可选】过滤器优先级，数值越小，执行越早，默认为10，选填|
|enable|true/false|【必选】控制开关|
|enable_page|path|【可选】填写想要应用的页面,如根目录就填'/',分类页面就填'/categories/'。若要应用于所有页面，就填`all`，默认为`all`|
|exclude|path|【可选】填写想要屏蔽的页面，可以多个。写法见示例。原理是将屏蔽项的内容逐个放到当前路径去匹配，若当前路径包含任一屏蔽项，则不会挂载。|
|layout.type|id/class|【可选】挂载容器类型，填写id或class，不填则默认为id|
|layout.name|id/class|【必选】挂载容器名称|
|layout.insert_before|id/class|【可选】 插入到该元素前面（二选一）|
|layout.insert_after|id/class|【可选】插入到该元素后面（二选一）|
|loading|URL|【可选】电子钟加载动画的图片|
|clock_css|URL|【可选】电子钟样式CDN资源|
|clock_js|URL|【可选】电子钟执行脚本CDN资源|
|qweather_key|key|【必选】和风天气 key|
|qweather_api_host|URL|【必选】和风天气 api_host|
|gaud_map_key|string|【可选】高得地图web服务key，如果没有填写则根据默认城市优先选择|
|default_city|string|【可选】当默认城市为空，优先根据IP定位，填写了默认城市将优先使用默认城市的定位和天气|


### 插件重制使用到的工具

* 和风天气location id：https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv
* 高德地图key控制台：https://lbs.amap.com/
* 经纬度查询：https://jingweidu.bmcx.com

