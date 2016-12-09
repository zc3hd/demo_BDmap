
## 运行

* git pull 下来后，先下载包;

* 运行 gulp test;

* 在端口号后输入 /html/

-----------------------------------------------

## 项目说明

* 此项目实行了室内追踪模式的前端。使用的是百度API，和layer的弹窗
* 室外监控：箭头处的小人和页面上的黑色半透明框（地图上楼宇）为实时数据。
* 室外人的监控：根据人的状态数据不同来展示不同状态图片，位置实时更新。
![室外人的监控](./webapp/readme_img/001.png)
* 室外楼宇的监控：半透明框上排的数据为报警数据，下排数据为楼内的人的数量
![室外楼宇的监控](./webapp/readme_img/002.png)
* 右上角为自定义的工具栏      [自定义百度工具栏](https://github.com/zc3hd/demo_BDmap_in-out_change/blob/master/webapp/script/module/monitor/map_diyTools.js)
![室外楼宇的监控](./webapp/readme_img/003.png)
* 点击室外人的marker进入追踪模式，因为数据为实时的，所以人有可能会在室内或室外，室内外地图进行切换，代码部分为层级的切换。
    - 室内追踪
    ![室内人的追踪](./webapp/readme_img/004.png)
    - 室外追踪
    ![室外人的追踪](./webapp/readme_img/005.png)
    - 代码部分
```
    function(id){
        var me = this;
          // 数据为模拟数据
          var out_point = {
            "lng": 116.335452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
            "lat": 40.004517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
          };
          var in_point = {
            "x": 56 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
            "y": 23 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
          };
          var data = {
            "id": 5,
            "name": "大奶奶",
            "tel_name": "哇哈哈",
            "tel": "13833333333",
            point: null,
            pos: '食堂哈哈哈阿斯顿和哈市',
            "flag": 2,
            "alarm_info": 'SOS报警',
            // key:0室外 1 室内
            "key": (1000 * Math.random()) > 500 ? 0 : 1,
            //"key": 1,
            'src': '../images/u170.jpg',
          };


          // 先进行室内外判断
          // 室外
          if (data.key == 0) {
            $('#inside').css('zIndex', '999');

            //框的切换 
            $('#ipt_map').hide();
            $('#trail_map').show();

            me.map_clear_Pointer();
            data.point = out_point;
            var marker = me.m_man_make(data);
            me.map.addOverlay(marker);
            var pt = new BMap.Point(data.point.lng, data.point.lat);
            me.map.setViewport([pt]);
          }
          // 室内
          else if (data.key == 1) {
            // 提高室内图的层级
            $('#inside').css('zIndex', '1001');
            data.point = in_point;
            $('#in_img').attr('src', data.src);

            $('#in_img').unbind().on('load', function() {

              $('#in_table_contain').hide();
              $('#in_trail_map').show();
              me.in_out_trail_make(data);
            })
          }
    }
```

* 退出追踪，因进入追踪模式是从室外监控进入的，所以退出时，为室外监控。清除个人追踪的定时器。
![室外人的追踪](./webapp/readme_img/006.png)

* 搜索模式：和点击一个人进入追踪模式相同。是特定搜索某个人的信息。
![室外人的追踪](./webapp/readme_img/007.png)
* 室内监控：点击室外楼宇信息下排的数据进入
![室内的追踪](./webapp/readme_img/008.png)
* 进入页面后先进行室内地图加载，加载完成后再进行室内打点，室内打点为 top 和 left，室内点为实时
![室内的数据](./webapp/readme_img/009.png)
* 从室内点击个人，进入追踪模式，实时数据为室内或室外，退出追踪模式时，界面为当前进入的室内监控界面。
* 点击多人图标弹出多人信息列表，列表信息为人名和当前状态。点击人的名字进入追踪模式
![室内的数据](./webapp/readme_img/010.png) 
![室内的数据](./webapp/readme_img/011.png) 

## 3.思路
* 第一次实现室内地图切换，在追踪模式室内外地图切换的地方折腾了会，开始的思路有错误，但值得先按先前的思维写代码。
* 先前的想法：就是室外写室外的追踪，室内写室内的追踪。两个定时器，互不干扰。渲染数据的逻辑也不一样。
* 需求：就是追踪数据有可能在室内，也有可能是室外的，思路：点击一个marker，先拿到追踪数据，判断该数据为室内外？！，分别进行不同的渲染，共用一个定时器。

## github
[![Support via Gittip](https://rawgithub.com/chris---/Donation-Badges/master/gittip.jpeg)](https://github.com/zc3hd/demo_BDmap_in-out_change)
