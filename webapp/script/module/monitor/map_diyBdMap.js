/**
 * Item Name  :
 *Creator         :zhang hongchang
 *Email            :hc.zhang@chinalbs.org
 *Created Date:2016.12.6
 *@pararm     :
 */
(function($, window) {
  function diyBdMap(opts) {
    this.id = opts.id;
    this.newTools = null;
    this.newBtns_two = null;
    this.newBtns_closeMonitor = null;
    this.row = null;

    // 室外全部数据的循环器
    this.all_timer = null;
    // 室外全部数据的循环时间
    this.all_update_timer = 3000;

    // 室外覆盖物的容器
    this.overlayContain = [];
    // 室外个人追踪的点击开关，没有点击时有点击事件，点击过后只有信息框
    this.man_clicl_key = true;


    // 个人追踪循环器
    this.man_o_timer = null;
    // 个人刷新时间
    this.man_update_time = this.reset = 4;

    // 室内全部数据的循环器
    this.in_all_timer = null;
    // 室内全部数据的循环时间
    this.in_all_update_timer = 3000;


    // 室内当前点击的楼层
    this.active_c = null;
    // 室内个人追踪器
    this.in_man_o_timer = null;
    // 室内个人刷新时间
    this.in_man_update_time = this.in_reset = 10;
  };
  diyBdMap.prototype = {
    //面向对象初始化
    init: function(row) {
      var me = this;
      me.openBaner(); //开启控件
      setTimeout(function() {
        //自定义插件
        me.setBaner();
        me.event();
      }, 500);
    },
    //控件默认初始化
    openBaner: function() {
      var me = this;
      var map = me.map = new BMap.Map(me.id, { enableMapClick: false }); // 找到地图的ID
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); //这句代码会每次让地图开始----最开始的大级别

      map.addControl(new BMap.MapTypeControl()); //添加地图类型控件

      map.enableScrollWheelZoom(); //缩放功能开启

      var stCtrl = new BMap.PanoramaControl(); //构造全景控件
      stCtrl.setOffset(new BMap.Size(50, 10));
      map.addControl(stCtrl); //添加全景控件

      var ctrl = new BMapLib.TrafficControl({ //添加实时路况
        showPanel: false //是否显示路况提示面板
      });
      ctrl.setOffset(new BMap.Size(10, 32));

      map.addControl(ctrl);
    },
    //控件自定义初始化
    setBaner: function() {
      var me = this;

      var $dt = $("div[title='显示普通地图']").css({ display: 'none', });
      var $wx = $("div[title='显示卫星影像']").css({ display: 'none', });
      var $sanwei = $("div[title='显示三维地图']").css({ display: 'none', });
      var $quanjing = $("div[title='进入全景']").css({ display: 'none', });
      var $jiaotong = $("#tcBtn").css({ display: 'none', });

      //自定义控件的初始化
      me.newTools = new Sifu.module.diyBdMapTools({
        bdMap: me.map,
        mode: false,
        btns: [],
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        offset: new BMap.Size(10, 10),
      });
      me.map.addControl(me.newTools);
    },
    event: function() {
      var me = this;
      me.monitor_bind();
      me.monitor();
    },
    // 初始化数据
    monitor: function() {
      var me = this;
      me.m_init();
    },
    monitor_bind: function() {
      var me = this;
      var fn = {
        m_init: function() {
          var me = this;
          // 全部模拟数据
          all_data();

          function all_data() {
            me.overlayContain = [];
            me.map_clear_Pointer();
            var arr = [{
              "id": 1,
              "floorName": "舜德楼",
              point: {
                "lng": 116.337452,
                "lat": 40.005517,
              },
              "alarmNum": 2,
              "num": 10,
              "key": 1,
              'cols': [
                { 'cName': '一层', floorId: 55, src: '../images/u169.jpg' },
                { 'cName': '二层', floorId: 66, src: '../images/u170.jpg' },
                { 'cName': '三层', floorId: 77, src: '../images/u171.jpg' },
                { 'cName': '4层', floorId: 88, src: '../images/u169.jpg' }
              ]
            }, {
              "id": 2,
              "floorName": "尝试楼",
              point: {
                "lng": 116.338452,
                "lat": 40.006517,
              },
              "alarmNum": 9,
              "num": 5,
              "key": 1,
              'cols': [
                { 'cName': '一层', floorId: 55, src: ['../images/u171_50.jpg', '../images/u171_100.jpg', '../images/u171_200.jpg'] },
                { 'cName': '二层', floorId: 66, src: ['../images/u170_50.jpg', '../images/u170_100.jpg', '../images/u170_200.jpg'] },
                { 'cName': '三层', floorId: 77, src: ['../images/u169_50.jpg', '../images/u169_100.jpg', '../images/u169_200.jpg'] },
              ]
            }, {
              "id": 3,
              "name": "王奶奶",
              point: {
                "lng": 116.335452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                "lat": 40.007517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
              },
              "flag": 1,
              "key": 0,
            }, {
              "id": 4,
              "name": "大奶奶",
              point: {
                "lng": 116.331452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                "lat": 40.001517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
              },
              "flag": 2,
              "key": 0,
            }, {
              "id": 5,
              "name": "2奶奶",
              point: {
                "lng": 116.335452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                "lat": 40.004517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
              },
              "flag": 0,
              "key": 0,
            }];
            var convertData = null,
              pt = null;
            for (var i = 0; i < arr.length; i++) {
              // 室外楼的打点
              if (arr[i].key == 1) {
                me.m_hall(arr[i]);
              }
              // 室外人的打点
              else if (arr[i].key == 0) {
                me.m_man(arr[i]);
              }
              //convertData = me.convertCoord({ 'lng': arr[i].point.lng, 'lat': arr[i].point.lat });
              pt = new BMap.Point(arr[i].point.lng, arr[i].point.lat);
              // 收集所有的点
              me.overlayContain.push(pt);
            }
            // 视角最优化
            me.map.setViewport(me.overlayContain);
            // 定时器开启
            me.all_timer = setTimeout(function() {
              console.log('全部数据');
              all_data();
            }, me.all_update_timer);
          }
          // 搜索功能开启
          me.m_search();
        },
        // 搜索功能
        m_search: function() {
          var me = this;
          var id = '';
          $('#ipt_search').unbind().on('click', function() {

            // 获取输入的ID值
            id = $('#ipt_info').val();
            $('#ipt_info').val('');

            if (id == '') {
              layer.msg('请输入被搜索人的信息！')
            } else {
              // 默认是点击了一个
              me.man_clicl_key = false;
              // 清除全部数据
              me.map_clear_Pointer();
              clearTimeout(me.all_timer);

              // 先来一次打点
              me.m_man_click(id);
              me.out_interval(id);

              // 加载退出事件
              me.m_man_back();
            }

          });
        },
        // 室外楼循环的marker
        m_hall: function(data) {
          var me = this;
          var overlay = new Sifu.module.diyOverlay(data, me);
          me.map.addOverlay(overlay);
        },
        // 室外人的marker
        m_man: function(data) {
          var marker = me.m_man_make(data);
          me.map.addOverlay(marker);
        },
        // 个人--室外追踪生成
        m_man_make: function(data) {
          var me = this;
          var iconPath = '';
          if (data.flag == 0) {
            iconPath = "../images/man_out.png";
          } else if (data.flag == 1) {
            iconPath = "../images/man_on.png";
          } else if (data.flag == 2) {
            iconPath = "../images/man_alarm.png";
          }
          // var convertData = me.convertCoord({'lng':data.lng, 'lat':data.lat});
          var pt = new BMap.Point(data.point.lng, data.point.lat);
          var myIcon = new BMap.Icon(iconPath, new BMap.Size(30, 30));
          var marker = new BMap.Marker(pt, { icon: myIcon });
          marker.man_id = data.id;
          marker.flag = data.flag;
          marker.setTitle(data.name);

          // 没有点击的时候有点击事件
          if (me.man_clicl_key) {
            marker.addEventListener('click', function(e) {
              // 点击过marker
              me.man_clicl_key = false;
              me.map_clear_Pointer();
              clearTimeout(me.all_timer);

              // 先来一次打点
              me.m_man_click(e.target.man_id);
              me.out_interval(e.target.man_id);

              // 加载退出事件
              me.m_man_back();
            })
          }
          // 点击过后只有面板
          else {
            var labelInfo = '<div class="markLabel">' +
              '<span class="labelName" id="devName">姓  名：' + data.name +
              '<br />' +
              '<span class="" id="devReceive" >联系人：' + data.tel_name + "</span>" +
              '<br />' +
              '<span class="" id="devReceive" >联系人电话：' + data.tel + "</span>" +
              '<br />' +
              '<span class="" id="devReceive" style= "color:red;marginRight:"10px"">报警类型：' + data.alarm_info + "</span><span id='sos_list'>详情</span>" +
              '<br />' +
              '</span>' +

              '<div class="labelArrow"></div>' +
              '</div>';
            var label = new BMap.Label(labelInfo, { offset: new BMap.Size(-40, -85) });
            label.setStyle({
              'backgroundColor': 'transparent',
              'border': 'none'
            });
            marker.setLabel(label);
            marker.lableInstance = label;

            $('#t_pos_info').html(data.pos);
          }

          return marker
        },
        // 室内外---先做一次打点
        m_man_click: function(id) {
          var me = this;

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
            // "key": 1,
            //"key": 1,
            'src': '../images/u170_100.jpg',
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
            var t = new Date().getTime();
            $('#in_img').attr('src', data.src + '?t=' + t);

            $('#in_img').unbind().on('load', function() {
              // 楼层table栏隐藏
              $('#in_table_contain').hide();
              $('#in_max_min').hide();

              // 室内追踪框
              $('#in_trail_map').show();

              // 进行比例适应
              !function bili(argument) {
                var img_bl = $('#in_img').height() / $('#in_img').width();
                var win_bl = $('#inside').height() / $('#inside').width();
                console.log(img_bl, win_bl);
                if (img_bl < win_bl) {
                  $('#in_img').css('width', $('#in_img_contain').width() + 'px');
                  $('#in_img_contain').css('height', $('#in_img').height() + 'px');
                } else {
                  // $('#div').css('height', '100%');
                  $('#in_img').css('height', $('#in_img_contain').height() + 'px');
                  $('#in_img_contain').css('width', $('#in_img').width() + 'px');
                }
              }();
              me.in_out_trail_make(data);
            })
          }
        },
        // 室内外----循环 
        out_interval: function(id) {
          var me = this;
          $('#t_time').html(me.man_update_time);
          $('#in_t_time').html(me.man_update_time);
          me.man_update_time--;
          if (me.man_update_time == -1) {
            me.m_man_click(id);
            me.man_update_time = me.reset;
          }
          me.man_o_timer = setTimeout(function() {
            console.log('单个数据追踪');
            me.out_interval(id);
          }, 1000);
        },
        // 个人--室内追踪生成
        in_out_trail_make: function(data) {
          var me = this;
          // 清除所有室内的点
          $('.in_img_xinB').remove();
          var src = '';
          // 人的状态
          if (data.flag == 0) {
            src = '../images/man_out.png';
          } else if (data.flag == 1) {
            src = '../images/man_on.png';
          } else if (data.flag == 2) {
            src = '../images/man_alarm.png';
          }
          // key 区分一个人key=0还是多个人key=2,key=3代码已经点击过！！！
          $('#in_img_contain').append('<div class="in_img_xinB" key=3 style="top:' + data.point.y + ';left:' + data.point.x + ';background:url(' + src + ') no-repeat;">' +
            '<div class="markLabel" style="top:-143px;left:-40px;">' +
            '<span class="labelName" id="devName">姓  名：' + data.name +
            '<br />' +
            '<span class="" id="devReceive" >联系人：' + data.tel_name + "</span>" +
            '<br />' +
            '<span class="" id="devReceive" >联系人电话：' + data.tel + "</span>" +
            '<br />' +
            '<span class="" id="devReceive" style= "color:red;marginRight:"10px"">报警类型：' + data.alarm_info + "</span><span id='sos_list'>详情</span>" +
            '<br />' +
            '</span>' +

            '<div class="labelArrow"></div>' +
            '</div>' +
            '</div>');
          $('#in_t_pos_info').html(data.pos);
        },
        // 室内外---退出
        m_man_back: function() {
          var me = this;
          $('#t_back,#in_t_back').unbind().on('click', function() {
            // 从室外点击的追踪再退出
            if (me.active_c == null) {
              $('#inside').css('zIndex', '999');
              clearTimeout(me.man_o_timer);
              me.map_clear_Pointer();

              me.overlayContain = [];
              me.man_clicl_key = true;
              me.man_update_time = me.reset
              me.m_init();

              // 框的转换
              $('#ipt_map').show();
              $('#trail_map').hide();
            }
            // 从室内点击的追踪再退出
            else {
              $('#inside').css('zIndex', '1001');
              clearTimeout(me.man_o_timer);
              $('#in_table_contain').show();
              $('#in_trail_map').hide();

              me.man_clicl_key = true;

              var src = me.active_c.attr('imgSrc');
              var hallId = me.active_c.attr('hallId');
              var floorId = me.active_c.attr('floorId');
              me.in_img_load(src, hallId, floorId);
            }

          });
        },




        // 1、室内地图的退出
        in_back: function() {
          var me = this;
          $('#in_back').unbind().on('click', function() {
            clearTimeout(me.in_all_timer);
            me.m_init();
            // 清除table的记录
            me.active_c = null;
            $('#inside').css('zIndex', '999');
            $('#trail_map').hide();
            $('#ipt_map').show();
            // 图片加载标记为0--未加载
            $('#in_img').attr('flag', 0);
          });
        },
        // 2、点击室内图标，进行室内监控
        // 初始化table栏
        in_table: function(arr, hallId) {
          var me = this;
          // 返回、table栏显示
          $('#in_table_contain').show();
          $('#in_max_min').show();
          
          // 室内追踪框隐藏
          $('#in_trail_map').hide();

          // 清除地图上的点和停止定时器
          me.map_clear_Pointer();
          clearTimeout(me.all_timer);

          $('#c_table').html('');
          for (var i = 0; i < arr.length; i++) {
            // { 'cName': '一层', floorId: 11 }
            if (arr[i].cName == '一层') {
              $('#c_table').append('<span class="in_btn_style active" imgSrc50 = ' + arr[i].src[0] + ' imgSrc100 = ' + arr[i].src[1] + ' imgSrc200 = ' + arr[i].src[2] + '  hallId = ' + hallId + ' floorId =' + arr[i].floorId + '>' + arr[i].cName + '</span>');
              // 样式---默认访问100%层
              $('#in_max_min .in_max_min_span').removeClass('active');
              $('#mm_100').addClass('active');
              // 容器比例的改变
              $('#in_img_contain').width('100%');
              $('#in_img_contain').height('100%');
              $('#in_img').css({ 'width': "100%", 'height': "100%" });

              // 图片加载100%那个
              me.in_img_load(arr[i].src[1], hallId, arr[i].floorId);
              // 每次加载都是100%;
              $($('#in_max_min span')[1]).addClass('active');
              // 首次记录下当前的层的table
              me.active_c = $('#c_table .active')
            } else {
              $('#c_table').append('<span class="in_btn_style" imgSrc50 = ' + arr[i].src[0] + ' imgSrc100 = ' + arr[i].src[1] + ' imgSrc200 = ' + arr[i].src[2] + ' hallId = ' + hallId + ' floorId = ' + arr[i].floorId + '>' + arr[i].cName + '</span>');
            }
          };
          // table栏图片切换
          me.in_img_click();
        },
        // table栏图片切换
        in_img_click: function() {
          var me = this;
          $('#c_table').unbind().on('click', '.in_btn_style', function(e) {
            // 切换层的table栏先清除定时器
            clearTimeout(me.in_all_timer);
            var active = $(e.target).hasClass('active');
            // 再次点击的时候记录下点击的table的对象
            me.active_c = $(e.target);
            if (!active) {
              $('#c_table span').removeClass('active');
              $(e.target).addClass('active');
              // 图片标记为0--未进行比例适应
              $('#in_img').attr('flag', 0);
              // 样式---默认访问100%层
              $('#in_max_min .in_max_min_span').removeClass('active');
              $('#mm_100').addClass('active');
              // 容器比例的改变
              $('#in_img_contain').width('100%');
              $('#in_img_contain').height('100%');
              $('#in_img').css({ 'width': "100%", 'height': "100%" });

              var src = $(e.target).attr('imgSrc100');
              var hallId = $(e.target).attr('hallId');
              var floorId = $(e.target).attr('floorId');
              me.in_img_load(src, hallId, floorId);
            }
          })
        },
        // 加载完图片进行打点
        in_img_load: function(src, hallId, floorId) {
          var me = this;
          var t = new Date().getTime();
          $('#in_img').attr('src', src);
          // $('#in_img').css('backgroundImage', 'url(' + src + ')');

          $('#in_img').unbind().on('load', function() {
            console.log('楼层图片地址---', src, '   楼id---', hallId, '   层id---', floorId, '-----------------加载完成室内图');

            // 比例的适应(第一次加载时进行适应)
            me.in_bili();

            // 打点。启动循环
            in_all_data(src, hallId, floorId);

            function in_all_data(src, hallId, floorId) {
              $('.in_img_xinB').remove();
              var arr = [{
                x: 56 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
                y: 23 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
                pepole: [
                  { name: '王奶奶', id: 1, flag: 0 }
                ]
              }, {
                x: 45 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
                y: 78 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
                pepole: [
                  { name: '张大爷', id: 2, flag: 1 }
                ]
              }, {
                x: 23 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
                y: 65 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
                pepole: [
                  { name: '陈大爷', id: 3, flag: 2 }
                ]
              }, {
                x: '76%',
                y: '37%',
                pepole: [
                  { name: 'jay', id: 1, flag: 0 },
                  { name: '王大拿', id: 3, flag: 1 },
                  { name: '全身的', id: 3, flag: 2 },
                  { name: '阿萨德', id: 4, flag: 0 },
                  { name: '玩儿啊', id: 5, flag: 1 },
                  { name: '去去去', id: 6, flag: 2 },
                ]
              }];
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].pepole.length == 1) {
                  me.in_img_one(arr[i]);
                } else {
                  me.in_img_lot(arr[i]);
                }
              }
              me.in_all_timer = setTimeout(function() {
                console.log('室内全部数据', src);
                in_all_data(src, hallId, floorId);
              }, me.in_all_update_timer);
            }
            // 点击--信标或人的事件
            me.in_img_pep_click();
            // 室内地图的放大缩小功能
            me.in_max_min();
          })
        },

        // --------------------------------------
        // 室内单人数据打点渲染
        in_img_one: function(data) {
          // <div class="in_img_xinB" style="position: absolute; width: 50px;height: 50px; top:50%;left: 50%;background-color: red;"></div>
          var src = '';
          if (data.pepole[0].flag == 0) {
            src = '../images/man_out.png';
          } else if (data.pepole[0].flag == 1) {
            src = '../images/man_on.png';
          } else if (data.pepole[0].flag == 2) {
            src = '../images/man_alarm.png';
          }
          // stats 区分一个人key=0还是多个人
          $('#in_img_contain').append('<img class="in_img_xinB" stats=0 pName="' + data.pepole[0].name + '" pflag="' + data.pepole[0].flag + '" pId="' + data.pepole[0].id + '" style="top:' + data.y + ';left:' + data.x + ';display:block" src="' + src + '" title="' + data.pepole[0].name + '"></img>')
        },
        // 室内多人数据打点渲染
        in_img_lot: function(data) {
          var me = this;
          var src = '../images/man_lots.png';
          var datas = '';
          for (var i = 0; i < data.pepole.length; i++) {
            datas += JSON.stringify(data.pepole[i]) + '&'
          }
          // stats 区分一个人key=1还是多个人
          $('#in_img_contain').append('<div class="in_img_xinB" stats=1 datas=' + datas + ' style="top:' + data.y + ';left:' + data.x + ';background:url(' + src + ') no-repeat;"></div>')
        },
        // 室内地图点击--信标或人的事件
        in_img_pep_click: function() {
          var me = this;
          $('#in_img_contain').unbind().on('click', '.in_img_xinB', function(e) {
            // 拿到点的状态
            var stats = $(e.target).attr('stats');
            // 单人
            var oneId = '';
            // 多人
            var str = '';
            var status = '';
            var color = 'black';
            var arr = null;
            var datas = [];

            if (stats == 0) {
              id = $(e.target).attr('pId');
              clearTimeout(me.in_all_timer);
              // 默认点击过点的样式
              me.man_clicl_key = false;

              // 先来一次打点
              me.m_man_click(oneId);
              me.out_interval(oneId);

              // 加载退出事件
              me.m_man_back();
            }
            // 点击信标
            else if (stats == 1) {
              arr = $(e.target).attr('datas').slice(0, -1).split('&');
              for (var i = 0; i < arr.length; i++) {
                datas.push(JSON.parse(arr[i]))
              }
              for (var j = 0; j < datas.length; j++) {
                // flag 表示他的状态
                if (datas[j].flag == 0) {
                  color = 'black';
                  status = '离线';
                } else if (datas[j].flag == 1) {
                  color = 'black';
                  status = '正常';
                } else if (datas[j].flag == 2) {
                  color = 'red';
                  status = '报警';
                }
                str += '<p style="margin-left:20px;margin-top:5px;"><span class="in_pep" style="cursor:pointer;color:' + color + '" pId = ' + datas[j].id + '>' + datas[j].name + '</span><span style="margin-left:20px;">状态：' + status + '</span></p>'
              }

              var index = layer.open({
                type: 1,
                title: '信息列表',
                area: ['200px', '200px'],
                zIndex: 1002,
                shadeClose: false, //点击遮罩关闭
                content: str,
                btn: ['关闭'],
                success: function() {
                  $('.in_pep').unbind().on('click', function() {
                    var id = $(this).attr('pId')
                    layer.close(index);
                    clearTimeout(me.in_all_timer);
                    // 默认点击过点的样式
                    me.man_clicl_key = false;

                    // 先来一次打点
                    me.m_man_click(oneId);
                    me.out_interval(oneId);

                    // 加载退出事件
                    me.m_man_back();
                  })
                },
                btn1: function(index, layero) {
                  layer.close(index);
                }
              });
            }

          })
        },
        // --------------------------------------
        // 比例的适应
        in_bili: function() {
          // 第一次加载时进行比例的适应
          if ($('#in_img').attr('flag') == '0') {
            var img_bl = $('#in_img').height() / $('#in_img').width();
            var win_bl = $('#inside').height() / $('#inside').width();
            console.log(img_bl, win_bl);
            if (img_bl < win_bl) {
              $('#in_img').css('width', $('#in_img_contain').width() + 'px');
              $('#in_img_contain').css('height', $('#in_img').height() + 'px');
            } else {
              // $('#div').css('height', '100%');
              $('#in_img').css('height', $('#in_img_contain').height() + 'px');
              $('#in_img_contain').css('width', $('#in_img').width() + 'px');
            }
            // 设置标记证明第一次加载完成
            $('#in_img').attr('flag', 1);
          } else {
            var id = $('#in_max_min .active').attr('id');
            if (id == 'mm_50') {
              // $('#in_img_contain').css({'width':'50%','height':'50%'});
              $('#in_img_contain').width('50%');
              $('#in_img_contain').height('50%');

            } else if (id == 'mm_100') {
              // $('#in_img_contain').css({'width':'100%','height':'100%'});
              $('#in_img_contain').width('100%');
              $('#in_img_contain').height('100%');
            } else if (id == 'mm_200') {
              // $('#in_img_contain').css({'width':'200%','height':'200%'});
              $('#in_img_contain').width('200%');
              $('#in_img_contain').height('200%');
            }
            $('#in_img').css({ 'width': "100%", 'height': "100%" });
          }
        },
        // 室内地图的放大缩小功能
        in_max_min: function() {
          console.log(454545);
          /* body... */
          $('#in_max_min').unbind().on('click', '.in_max_min_span', function(e) {
            // 切换比例图先清除定时器
            clearTimeout(me.in_all_timer);
            /* body... */
            var active = $(e.target).hasClass('active');
            if (!active) {
              $('#in_max_min .in_max_min_span').removeClass('active');
              $(e.target).addClass('active');
              var src = $(me.active_c).attr('imgsrc100');
              var hallId = $(me.active_c).attr('hallId');
              var floorId = $(me.active_c).attr('floorId');
              me.in_img_load(src, hallId, floorId);
            }

          });
        },



        // m_man_info: function(id) {
        //   var me = this;
        //   var out_point = {
        //     "lng": 116.335452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
        //     "lat": 40.004517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
        //   };

        //   var data = {
        //     "id": 5,
        //     "name": "大奶奶",
        //     "tel_name": "哇哈哈",
        //     "tel": "13833333333",
        //     point: null,
        //     pos: '食堂哈哈哈阿斯顿和哈市',
        //     "flag": 2,
        //     "alarm_info": 'SOS报警',
        //     // key:0室外 1 室内
        //     "key": 0,
        //   };
        //   if (data.key == 0) {
        //     me.map_clear_Pointer();
        //     data.point = out_point;
        //     var marker = me.m_man_make(data);
        //     me.map.addOverlay(marker);
        //     var pt = new BMap.Point(data.point.lng, data.point.lat);
        //     me.map.setViewport([pt]);
        //   }
        // },


        // // 个人室内追踪
        // in_img_one_trail: function(id) {
        //   var me = this;

        //   clearTimeout(me.in_all_timer);

        //   me.in_one_trail_make(id);
        //   in_one_trail(id);

        //   function in_one_trail(id) {
        //     $('#in_t_time').html(me.in_man_update_time);
        //     me.in_man_update_time--
        //       if (me.in_man_update_time == -1) {
        //         me.in_man_update_time = me.in_reset;
        //         me.in_one_trail_make(id);
        //       }
        //     me.in_man_o_timer = setTimeout(function() {
        //       console.log('室内个人追踪');
        //       in_one_trail(id);
        //     }, 1000)
        //   }

        //   $('#in_trail_map').show();
        //   $('#in_table_contain').hide();
        //   me.in_img_one_trail_back();
        // },
        // // 个人室内追踪生成
        // in_one_trail_make: function(id) {
        //   var me = this;
        //   $('.in_img_xinB').remove();
        //   var data = {
        //     "id": 5,
        //     "name": "陈思学",
        //     "tel_name": "王先生",
        //     "tel": "13833333333",
        //     point: {
        //       "x": 56 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
        //       "y": 23 + 10 * (Math.random() > 0.5 ? Math.random() : -Math.random()) + '%',
        //     },
        //     pos: '楼梯间',
        //     "flag": 2,
        //     "alarm_info": 'SOS报警',
        //   };
        //   var src = '';
        //   if (data.flag == 0) {
        //     src = '../images/man_out.png';
        //   } else if (data.flag == 1) {
        //     src = '../images/man_on.png';
        //   } else if (data.flag == 2) {
        //     src = '../images/man_alarm.png';
        //   }
        //   // key 区分一个人key=0还是多个人key=2,key=3代码已经点击过！！！
        //   $('#in_img_contain').append('<div class="in_img_xinB" key=3 style="top:' + data.point.y + ';left:' + data.point.x + ';background:url(' + src + ') no-repeat;">' +
        //     '<div class="markLabel" style="top:-143px;left:-40px;">' +
        //     '<span class="labelName" id="devName">姓  名：' + data.name +
        //     '<br />' +
        //     '<span class="" id="devReceive" >联系人：' + data.tel_name + "</span>" +
        //     '<br />' +
        //     '<span class="" id="devReceive" >联系人电话：' + data.tel + "</span>" +
        //     '<br />' +
        //     '<span class="" id="devReceive" style= "color:red;marginRight:"10px"">报警类型：' + data.alarm_info + "</span><span id='sos_list'>详情</span>" +
        //     '<br />' +
        //     '</span>' +

        //     '<div class="labelArrow"></div>' +
        //     '</div>' +
        //     '</div>');
        //   $('#in_t_pos_info').html(data.pos);
        // },
        // // 个人室内退出追踪
        // in_img_one_trail_back: function() {
        //   var me = this;
        //   $('#in_t_back').unbind().on('click', function() {
        //     $('#in_trail_map').hide();
        //     $('#in_table_contain').show();
        //     // 清除个人追踪定时器和时间为10
        //     clearTimeout(me.in_man_o_timer);
        //     me.in_man_update_time = me.in_reset;
        //     // 找到当前table选项进行渲染
        //     var src = me.active_c.attr('imgSrc');
        //     var hallId = me.active_c.attr('hallId');
        //     var floorId = me.active_c.attr('floorId');
        //     me.in_img_load(src, hallId, floorId);
        //   });
        // },










































        c_labelSet: function() {
          var me = this;
          me.c_label = '<div class="layerCon">' +
            '<p class="txtWrap">' +
            '<span class="txtName">围栏名称：</span>' +
            '<input type="text"  id="c_name"/><i style="color:red; margin-left:5px">*</i>' +
            '</p>' +
            '<p class="txtWrap">' +
            '<span class="txtName">备注：</span>' +
            '<input type="text"  id="c_memo"/>' +
            '</p><br/>' +

            '</div>';
        },
        c_add: function() {
          var me = this;
          me.c_labelSet();
          layer.open({
            type: 1,
            title: '新增围栏',
            area: ['800px', '150px'],
            zIndex: 500,
            shadeClose: false, //点击遮罩关闭
            content: me.c_label,
            btn: ['保存', '取消'],
            success: function() {
              //me.layer_man_dataBack();
            },
            yes: function(index, layero) {
              me.c_set_name = $('#c_name').val();
              if (me.c_set_name == '') {
                layer.msg('请输入围栏名称！');
                return;
              }
              me.c_set_memo = $('#c_memo').val();
              layer.close(index);
              me.c_yes();
            },
            btn2: function(index, layero) {
              layer.close(index);
            }
          });
        },
        c_yes: function() {
          var me = this;
          me.map.removeControl(me.c_addBtn);
          me.c_saveBtn = new diyBdMapTools({
            bdMap: me.map,
            mode: true,
            btns: ['保存围栏sav', '返回列表bac'],
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: new BMap.Size(10, 10),
          });
          me.map.addControl(me.c_saveBtn);

          var circle = me.c_draw({
            fenceDTO: {
              center: []
            }
          });
          me.c_container.push(circle);
          circle.enableEditing();

          $('#dom_sav').click(function() {
            var opts = {
              scenicId: me.edit_s_data[0].id,
              fenceName: me.c_set_name,
              memo: me.c_set_memo,
              center: [circle.getCenter().lng, circle.getCenter().lat],
              radius: parseInt(circle.getRadius()),
            };
            me.c_save(opts, circle);
          });

          $('#dom_bac').click(function() {
            $(me.contentIn).prop('src', '/bike/html/scenicList.html');
          });
        },
        c_draw: function(data) {
          var me = this;

          var r = data.fenceDTO.radius ? data.fenceDTO.radius : 500;
          var lng = data.fenceDTO.center[0] ? data.fenceDTO.center[0] : me.edit_s_data[0].lng;
          var lat = data.fenceDTO.center[1] ? data.fenceDTO.center[1] : me.edit_s_data[0].lat;

          var color = data.id ? 'blue' : 'red';
          var convertData = me.convertCoord({ 'lng': lng, 'lat': lat });
          var pt = new BMap.Point(convertData.lng, convertData.lat);

          var circle = new BMap.Circle(pt, r, { strokeColor: color, strokeWeight: 1, fillOpacity: 0.1, fillColor: color });

          me.map.addOverlay(circle);
          circle.id = data.id;
          circle.name = data.name;
          circle.memo = data.memo;

          circle.onclick = function() {
            me.c_edit(circle);
          };

          return circle;
        },
        c_s_draw: function(data) {
          var me = this;

          var r = data.fenceDTO.radius ? data.fenceDTO.radius : 500;
          var lng = data.fenceDTO.center[0] ? data.fenceDTO.center[0] : me.edit_s_data[0].lng;
          var lat = data.fenceDTO.center[1] ? data.fenceDTO.center[1] : me.edit_s_data[0].lat;

          var color = data.id ? 'blue' : 'red';
          var pt = new BMap.Point(lng, lat);

          var circle = new BMap.Circle(pt, r, { strokeColor: color, strokeWeight: 1, fillOpacity: 0.1, fillColor: color });

          me.map.addOverlay(circle);
          circle.id = data.id;
          circle.name = data.name;
          circle.memo = data.memo;

          circle.onclick = function() {
            me.c_edit(circle);
          };

          return circle;
        },
        c_save: function(opts, circle) {
          API.circle.add(opts).done(function(data) {
            if (data.ret == 1) {
              me.map.removeControl(me.c_saveBtn);
              me.c_addBtn = new diyBdMapTools({
                bdMap: me.map,
                mode: true,
                btns: ['新增围栏add', '返回列表bac'],
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: new BMap.Size(10, 10),
              });
              me.map.addControl(me.c_addBtn);
              $('#dom_add').click(function() {
                me.c_add();
              });
              $('#dom_bac').click(function() {
                $(me.contentIn).prop('src', '/bike/html/scenicList.html');
              });

              circle.disableEditing();
              me.c_set_name = '';
              me.c_set_memo = '';
              me.c_container = [];
              me.c_first();
            }
          });
        },
        c_edit: function(circle) {
          var me = this;
          if (me.c_container.length == 1) {
            layer.msg('请完成围栏编辑，在进行其他操作！');
            return;
          }
          me.c_container.push(circle);

          me.map.removeControl(me.c_addBtn);
          me.c_editBtn = new diyBdMapTools({
            bdMap: me.map,
            mode: true,
            btns: ['保存围栏sed', '信息编辑lab', '删除围栏del', '返回列表bac'],
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: new BMap.Size(10, 10),
          });
          me.map.addControl(me.c_editBtn);

          circle.enableEditing();
          circle.setFillColor('red');
          circle.setStrokeColor('red');

          $('#dom_del').click(function() {
            me.c_del(circle);
          });
          $('#dom_lab').click(function() {
            me.c_labSet(circle);
          });
          $('#dom_sed').click(function() {
            me.c_save_edit(circle);

            //  /bike/html/scenicList.html
          });
          $('#dom_bac').click(function() {
            $(me.contentIn).prop('src', '/bike/html/scenicList.html');
          });
        },
        c_del: function(circle) {
          var me = this;
          layer.open({
            type: 1,
            title: '删除围栏',
            area: ['220px', '130px'],
            zIndex: 500,
            shadeClose: false, //点击遮罩关闭
            content: '<div style="margin-left: 30px; margin-top: 10px">确认删除围栏？</div>',
            btn: ['确认', '取消'],
            yes: function(index, layero) {
              var opts = {
                id: circle.id
              };
              API.circle.del(opts).done(function(data) {
                if (data.ret == 1) {
                  layer.close(index);
                  me.map.removeControl(me.c_editBtn);
                  me.c_addBtn = new diyBdMapTools({
                    bdMap: me.map,
                    mode: true,
                    btns: ['新增围栏add', '返回列表bac'],
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    offset: new BMap.Size(10, 10),
                  });
                  me.map.addControl(me.c_addBtn);
                  me.c_first();
                  me.c_set_name = '';
                  me.c_set_memo = '';
                  me.c_container = [];
                  $('#dom_add').click(function() {
                    me.c_add();
                  });
                  $('#dom_bac').click(function() {
                    $(me.contentIn).prop('src', '/bike/html/scenicList.html');
                  });
                }
              });
            },
            btn2: function(index, layero) {
              layer.close(index);
            }
          });
        },
        c_labSet: function(circle) {
          var me = this;
          me.c_labelSet();
          layer.open({
            type: 1,
            title: '信息编辑',
            area: ['800px', '150px'],
            zIndex: 500,
            shadeClose: false, //点击遮罩关闭
            content: me.c_label,
            btn: ['保存', '取消'],
            success: function() {
              $('#c_name').val(circle.name);
              $('#c_memo').val(circle.memo);
            },
            yes: function(index, layero) {
              me.c_set_name = $('#c_name').val();
              if (me.c_set_name == '') {
                layer.msg('请输入围栏名称！');
                return;
              }
              me.c_set_memo = $('#c_memo').val();
              layer.close(index);
            },
            btn2: function(index, layero) {
              layer.close(index);
            }
          });
        },
        c_save_edit: function(circle) {
          var opts = {
            id: circle.id,
            fenceName: me.c_set_name || circle.name,
            memo: me.c_set_memo || circle.memo,
            center: [circle.getCenter().lng, circle.getCenter().lat],
            radius: parseInt(circle.getRadius()),
          };
          me.c_update(opts, circle);
        },
        c_update: function(opts, circle) {
          API.circle.update(opts).done(function(data) {
            if (data.ret == 1) {
              me.map.removeControl(me.c_editBtn);
              me.c_addBtn = new diyBdMapTools({
                bdMap: me.map,
                mode: true,
                btns: ['新增围栏add', '返回列表bac'],
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: new BMap.Size(10, 10),
              });
              me.map.addControl(me.c_addBtn);

              me.c_first();
              me.c_set_name = '';
              me.c_set_memo = '';
              me.c_container = [];
              $('#dom_add').click(function() {
                me.c_add();
              });
              $('#dom_bac').click(function() {
                $(me.contentIn).prop('src', '/bike/html/scenicList.html');
              });
            }
          });
        },
      };
      for (k in fn) {
        me[k] = fn[k];
      };
    },







    //地图清除点
    map_clear_Pointer: function() {
      var me = this;
      var allOverlay = me.map.getOverlays();
      for (var i = 0; i < allOverlay.length; i++) {
        me.map.removeOverlay(allOverlay[i]);
      };
    },

    //请求楼的数据，渲染数据
    hall_ajaxBackData: function(row) {
      var me = this;
      me.clearPointer();
      //楼信息打点
      me.hallData = { lng: row.lng, lat: row.lat };
      me.hall_makePointer(me.hallData);

      //预案信息弹出
      var opts = {
        floorId: row.id
      };
      var host = location.host;
      getDevice.hall_emergencePlan(opts).done(function(data) {
        //正式地址
        //var path = location.host+'/fire_cloud'+data.data.viewPath.split('\\').join('\/');

        //测试地址
        var path = '../..' + data.data.viewPath.split('\\').join('\/');
        me.hall_planShow(path);
      });

      //负责人信息
      me.manForFire = row.respPerson;
      me.phoneForFire = row.phone;

    },

    //楼------点的生成地图点
    hall_makePointer: function(data) {

      var me = this;

      var geoPoints = [];

      var iconPath = "../images/fireHall.png";

      // var convertData = me.convertCoord({'lng':data.lng, 'lat':data.lat});
      var pt = new BMap.Point(data.lng, data.lat);
      geoPoints.push(pt);

      var myIcon = new BMap.Icon(iconPath, new BMap.Size(56, 46));
      var marker = new BMap.Marker(pt, { icon: myIcon });

      me.map.addOverlay(marker);
      me.map.setViewport(geoPoints);

      me.map.enableScrollWheelZoom(); //缩放功能开启
    },
    //楼------预案信息弹出
    hall_planShow: function(data) {
      var me = this;
      var layerID = layer.open({
        type: 2,
        title: '预案文档',
        offset: 'rb',
        area: 'auto',
        maxmin: true,
        closeBtn: 0,
        shade: 0,
        zIndex: 500,
        shadeClose: false, //点击遮罩关闭
        content: data,
      });
    },

    // //两大按钮的事件函数
    // event: function() {
    //   var me = this;
    //   me.manage_carsEvent();
    //   me.device_event();
    // },

    //人车管理得点击事件
    manage_carsEvent: function() {
      var me = this;
      me.cars = $('#dom_rcc');
      me.cars.click(function() {
        //鼠标没有点----出现点及围栏
        if (me.cars.attr('click_key') == undefined) {
          $(this).animate({ 'width': '90px', 'fontSize': '18px' })
            .css({ 'backgroundColor': '#21536d', color: 'white' }, 50);

          me.cars.attr('click_key', true);
          me.manage_ajaxCarsData();
        } else {
          $(this).animate({ 'width': '72px', 'fontSize': '14px' })
            .css({ 'backgroundColor': 'white', color: '#21536d' }, 50);

          me.cars.attr('click_key', null);
          clearTimeout(me.carsTimer);
          me.manage_clearCarsData();
        };
      });

      if (me.closeBtnKey) {
        me.cars.click();
      }
    },
    //请求回人车的数据
    manage_ajaxCarsData: function() {
      var me = this;

      //var asd = [{
      //    position:{lng:4545,lat:45454},
      //    carNum:000,
      //    phone:000,
      //    name:4545,
      //}];
      getDevice.hall_carsMansData().done(function(data) {
        me.manage_clearCarsData();
        var carsData = data.manCars;
        me.manage_darwCarsData(carsData);
        me.carsViews = false;
        me.carsTimer = setTimeout(function() {
          me.manage_ajaxCarsData();
        }, 2000);
      });

    },
    //所有的数据进行打点--最佳视角
    manage_darwCarsData: function(data) {
      var me = this;
      for (var i = 0; i < data.length; i++) {
        var iconPath = '';
        if (data[i].type == 1) {
          iconPath = "../images/car_online.png";
        } else {
          iconPath = "../images/view_man.png";
        }

        var convertData = me.convertCoord({ 'lng': data[i].position.lng, 'lat': data[i].position.lat });
        var pt = new BMap.Point(convertData.lng, convertData.lat);

        if (me.carsViews) {
          me.carsPointers.push(pt);
        }
        var myIcon = new BMap.Icon(iconPath, new BMap.Size(54, 46));
        var marker = new BMap.Marker(pt, { icon: myIcon });

        marker.id = data[i].id;
        me.manage_clickCarsEvent(marker);


        if (data[i].type == 1) {
          marker.setTitle('车牌号：' + data[i].carNum + '; 电话：' + data[i].phone);
        } else {
          marker.setTitle('联系人：' + data[i].name + '; 电话：' + data[i].phone);
        }
        me.map.addOverlay(marker);
        me.carsMarkers.push(marker);
      };

      if (me.carsViews) {
        me.map.setViewport(me.carsPointers);
      }

    },
    //清除所有人车的的数据
    manage_clearCarsData: function() {
      var me = this;
      var allOverlay = me.carsMarkers;
      for (var i = 0; i < allOverlay.length; i++) {
        me.map.removeOverlay(allOverlay[i]);
      };
      me.carsMarkers = [];
    },
    //每个人车的点击事件
    manage_clickCarsEvent: function(dom) {
      var me = this;
      dom.onclick = function() {
        if (me.carsClickKey) {
          me.carsClickKey = false;

          //清除人车的定时器和点
          clearTimeout(me.carsTimer);
          me.manage_clearCarsData();

          //清除两大功能按钮
          me.map.removeControl(me.newBtns_two);

          //添加退出追踪按钮
          me.newBtns_closeMonitor = new fc.module.diyBdMapTools({
            bdMap: me.map,
            mode: true,
            btns: ['退出追踪tcz'],
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: new BMap.Size(10, 10),
          });
          me.map.addControl(me.newBtns_closeMonitor);
          me.manage_closeMonitor();

          var opts = { manCarId: dom.id };

          me.manage_ajaxOneCarData(opts);
        }
      };

    },
    //请求回单个设备的人车的数据
    manage_ajaxOneCarData: function(opts) {
      var me = this;
      getDevice.hall_oneCarsMansData(opts).done(function(data) {
        var carsData = data.manCar;
        me.oneCarsPointers = [];
        me.manage_darwOneCarsData([carsData]);
        me.onecarsTimer = setTimeout(function() {
          me.manage_ajaxOneCarData(opts);
        }, 2000);
      });

    },
    //单个设备的打点和移动
    manage_darwOneCarsData: function(data) {
      var me = this;
      if (me.oneCar == null) {
        //打点打label
        for (var i = 0; i < data.length; i++) {
          var iconPath = '';
          if (data[i].type == 1) {
            iconPath = "../images/car_online.png";
          } else {
            iconPath = "../images/view_man.png";
          }

          var convertData = me.convertCoord({ 'lng': data[i].position.lng, 'lat': data[i].position.lat });
          var pt = new BMap.Point(convertData.lng, convertData.lat);

          me.oneCarsPointers.push(pt);

          var myIcon = new BMap.Icon(iconPath, new BMap.Size(54, 46));
          var marker = me.oneCar = new BMap.Marker(pt, { icon: myIcon });
          marker.setOffset(new BMap.Size(6, -22)); //设置marker偏移以和点对上

          //label信息--设置
          var labelInfo = '<div class="markLabel">' +
            '<span class="labelName" id="devName">车牌号：' + data[i].carNum +
            '<br />' +
            '<span class="" id="devReceive" >速度：' + data[i].position.speed + "km/h</span>" +
            '<br />' +
            '</span>' +
            '<div class="labelArrow"></div>' +
            '</div>';
          var label = new BMap.Label(labelInfo, { offset: new BMap.Size(-35, -48) });
          label.setStyle({
            'backgroundColor': 'transparent',
            'border': 'none'
          });
          marker.setLabel(label);
          marker.lableInstance = label;

          if (data[i].type == 1) {
            marker.setTitle('车牌号：' + data[i].carNum + '; 电话：' + data[i].phone);
          } else {
            marker.setTitle('联系人：' + data[i].name + '; 电话：' + data[i].phone);
          }
          me.map.addOverlay(marker);
        };
      } else {
        for (var j = 0; j < data.length; j++) {
          var convertData = me.convertCoord({ 'lng': data[j].position.lng, 'lat': data[j].position.lat });
          var newPoint = new BMap.Point(convertData.lng, convertData.lat);

          me.oneCarsPointers.push(newPoint);

          var oldPoint = me.oneCar.getPosition();
          me.addPolyLine([oldPoint, newPoint], {});
          me.oneCar.setPosition(newPoint); //移动到新的数据点上

          $('#devReceive').html('速度：' + data[j].position.speed + 'km/h');
        }
      }
      me.map.setViewport(me.oneCarsPointers);


    },
    //退出追踪的事件
    manage_closeMonitor: function() {
      var me = this;
      me.btn_closeMonitor = $('#dom_tcz');
      me.btn_closeMonitor.click(function() {
        me.closeBtnKey = true;
        me.map.removeControl(me.newBtns_closeMonitor);
        clearTimeout(me.onecarsTimer); //清除单个设备的定时器
        me.map.clearOverlays();
        layer.closeAll();
        me.carsViews = true; //开启最佳视角
        me.carsClickKey = true; //回归没有点击DOME，没有信息框，有点击事件可以点击
        me.oneCar = null; //回归单个设备容器还没有收集marker
        me.init(me.row); //全部设备渲染

      });
    },

    //周边力量
    device_event: function() {
      var me = this;
      me.zll = $('#dom_zll')
      me.zll.click(function() {
        if (me.zll.attr('click_key') == undefined) {
          $(this).animate({ 'width': '90px', 'fontSize': '18px' })
            .css({ 'backgroundColor': '#21536d', color: 'white' }, 50);

          me.zll.attr('click_key', true);
          me.device_range();
        } else {
          $(this).animate({ 'width': '72px', 'fontSize': '14px' })
            .css({ 'backgroundColor': 'white', color: '#21536d' }, 50);
          me.zll.attr('click_key', null);

          layer.close(me.layerIndex);
          me.device_rangeClear();
          me.device_devsClear();

        };
      });
    },
    //所有消防栓的范围
    device_range: function() {
      var me = this;
      var r = me.circle ? me.circle.getRadius() : 100;
      var convertData = me.convertCoord({ 'lng': me.hallData.lng, 'lat': me.hallData.lat });
      me.circle = circle = new BMap.Circle(new BMap.Point(convertData.lng, convertData.lat), r, { strokeColor: "red", strokeWeight: 1, fillOpacity: 0.1, fillColor: 'red' });
      me.map.addOverlay(circle);
      me.rangeMarkers.push(circle);

      //弹窗信息
      me.layerIndex = layer.open({
        type: 1,
        title: '消防栓信息',
        offset: ['55px', '10px'],
        area: 'auto',
        shade: 0,
        zIndex: 400,
        closeBtn: 0,
        shadeClose: false, //点击遮罩关闭
        content: '<div id = "manForFire">' +
          '<div class="Fire_info">楼宇联系人：' + me.manForFire + '</div>' +
          '<div class="Fire_info">联系人电话：' + me.phoneForFire + '</div>' +
          '</div>' +
          '<ul id = "devUl" style="width: auto"></ul>',
      });

      //初始化的时候就进行一次请求
      var opts = {
        center: [me.hallData.lng, me.hallData.lat],
        radius: me.circle.getRadius(),
      };
      me.device_mouseout(opts);

      circle.addEventListener('mouseover', function() {
        me.circle.enableEditing();
      });
      circle.addEventListener('mouseout', function() {
        me.circle.disableEditing();
        if (me.rangeMarkers.length) {
          me.device_mouseout(opts);
        }
      });



    },
    //清除圆圈的时候就把装圆的容器清空
    device_rangeClear: function() {
      var me = this;
      var allOverlay = me.rangeMarkers;
      for (var i = 0; i < allOverlay.length; i++) {
        me.map.removeOverlay(allOverlay[i]);
      };
      me.rangeMarkers = [];
    },
    device_mouseout: function(opts) {
      var me = this;
      //信息框--信息为空

      getDevice.hall_fireplugData(opts).done(function(data) {
        $('#devUl').html('');
        me.device_devsClear();
        me.device_drawDevsData(data.device);
      });

    },
    //消防栓打点
    device_drawDevsData: function(data) {
      var me = this;
      for (var i = 0; i < data.length; i++) {
        var iconPath = '../images/dev.png';
        var convertData = me.convertCoord({ 'lng': data[i].lng, 'lat': data[i].lat });
        var pt = new BMap.Point(convertData.lng, convertData.lat);
        var myIcon = new BMap.Icon(iconPath, new BMap.Size(30, 30));
        var marker = new BMap.Marker(pt, { icon: myIcon });
        marker.setTitle('名称：' + data[i].name);
        me.map.addOverlay(marker);
        me.devsMarkers.push(marker);

        $('#devUl').append(
          '<li class="dev_info">' +
          '<span>名称：' + data[i].name + '</span>' +
          '<span class="info_wp">水压：' + data[i].waterPress + '</span>' +
          '<span class="info_t">最后通信时间：' + formatterDateDay(data[i].lastTime) + '</span>' +
          '</li>'
        );
      };
    },
    //清除所有消防栓
    device_devsClear: function() {
      var me = this;
      var allOverlay = me.devsMarkers;
      for (var i = 0; i < allOverlay.length; i++) {
        me.map.removeOverlay(allOverlay[i]);
      };
      me.devsMarkers = [];
    },

    //添加折线
    addPolyLine: function(points, opts) {
      var me = this;
      var polyLine = new BMap.Polyline(points, {
        strokeColor: (opts.color || "#21536d"),
        strokeWeight: (opts.weight || 4),
        strokeOpacity: (opts.opacity || 0.8)
      });
      me.map.addOverlay(polyLine);
      return polyLine;
    },
    convertCoord: function(oLnglat) {
      var me = this;
      var lnglat = {};
      var corG = convertWgsToGcj02(oLnglat.lng, oLnglat.lat);
      if (corG != false) {
        var corP = convertGcj02ToBd09(corG.longitude, corG.latitude);
        lnglat = { lng: corP.longitude, lat: corP.latitude };
      } else {
        lnglat = oLnglat;
      }
      return lnglat;
    },

  };
  Sifu.module["diyBdMap"] = diyBdMap;
})(jQuery, window);

function executePlan(dom) {
  var row = JSON.parse($(dom).attr('json'));
  $('#fastPlan').hide();
  $('#container').show();

  new fc.module.diyBdMap({ id: 'container' }).init(row);
}
