/**
 * Item Name  :室内外--动态--轨迹查询
 *Creator     :cc
 *Email       :cc
 *Created Date:2017.1.19
 *@pararm     :
 */
(function($, window) {
  function CheckTrail(opts) {
    this.id = opts.id;
    this.sn = '';
    this.data1 = $('#check_ipt1');
    this.data2 = $('#check_ipt2');
    this.time1 = '';
    this.time2 = '';

    this.partTime1 = '';
    this.partTime2 = '';

    // 拿到一条轨迹，分室内外的下标。开始
    this.i = 0;
    // 全局的定时器
    this.timer = null;

    // 速度的选择
    this.speed = 1000;

    // 当前进度
    this.current_length = 0;
    // 总进度长度
    this.all_length = 0;
  };
  CheckTrail.prototype = {
    //面向对象初始化
    init: function(row) {
      var me = this;
      me.openBaner(); //开启控件
      setTimeout(function() {
        //自定义插件
        me.setBaner();
      }, 500);

      me.event();
      me.select_speed();
      // me.oneline();
    },
    // -------------------------------------------------------------------------------组件初始化
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
    //初始化事件函数
    event: function() {
      var me = this;
      //日期插件渲染
      me.date_init();
      // 查询按钮的事件
      me.btn_event();

      me.info_p_event();
    },
    //日期插件渲染
    date_init: function() {
      var me = this;

      var start = {
        elem: '#check_ipt1', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD hh:mm:ss', //日期格式
        istime: true, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: false, //是否显示今天
        issure: true, //是否显示确认
        festival: true, //是否显示节日
        // min: '1900-01-01 00:00:00', //最小日期
        // max: '2099-12-31 23:59:59', //最大日期
        max: laydate.now(), //设定最大日期为当前日期
        //start: '2014-6-15 23:00:00',  //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function(dates) { //选择好日期的回调
          //var  time = dates.replace(new RegExp("-","gm"),"/");
          var time_hm = (new Date(dates)).getTime(); //得到毫秒数
          console.log(dates);
          me.time1 = time_hm;
          end.min = dates; //开始日选好后，重置结束日的最小日期
          end.start = dates //将结束日的初始值设定为开始日
        }
      }
      var end = {
        elem: '#check_ipt2', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD hh:mm:ss', //日期格式
        istime: true, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: false, //是否显示今天
        issure: true, //是否显示确认
        festival: true, //是否显示节日
        // min: '1900-01-01 00:00:00', //最小日期 max: '2099-12-31 23:59:59', //最大日期 
        //start: '2014-6-15 23:00:00',  //开始日期
        max: laydate.now(), //设定最大日期为当前日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function(dates) { //选择好日期的回调
          //var  time = dates.replace(new RegExp("-","gm"),"/");
          var time_hm = (new Date(dates)).getTime(); //得到毫秒数

          me.time2 = time_hm;
          start.max = dates; //结束日选好后，重置开始日的最大日期
        }
      };
      $('#check_ipt1').click(function() {
        laydate(start);
      });
      $('#check_ipt2').click(function() {
        laydate(end);
      });
    },
    //查询按钮事件
    btn_event: function() {
      var me = this;
      var btn = $('#check_btn');

      btn.click(function() {
        if (me.data1.val() == '') {
          layer.msg('请选择起始时间！', { icon: 2, time: 2000 });
          return;
        };
        if (me.data2.val() == '') {
          layer.msg('请选择结束时间！', { icon: 2, time: 2000 });
          return;
        };
        var opts = {
          device_sn: me.sn,
          begin: me.time1,
          end: me.time2,
        };
        // 请求数据
        me.infos_ajax(opts);
      });
    },
    //请求回的数据渲染为列表
    infos_ajax: function(opts) {
      var me = this;
      // getDevice.trail_BackData(opts).done(function(data) {
      // });
      // 清除地图所有点
      me.map.clearOverlays();
      $('.imgDiv').remove();
      $('#trailInfo_show').html('');

      // var trackArr = data.track;
      var trackArr = [
        { states: [{ receive: 1483286400000 }, { receive: 1483459200000 }], distance: 2.5, unit: 'km' },
        { states: [{ receive: 1483286123456 }, { receive: 1483894578545 }], distance: 0.8, unit: 'km' }
      ];

      if (trackArr.length == 0) {
        layer.msg('该日期无轨迹信息，请重新查询！', { icon: 2, time: 2000 });
        return;
      }
      for (var i = 0; i < trackArr.length; i++) {
        $('#trailInfo_show').append(
          '<p class="info_p" placeType=' + trackArr[i].placeType + '  t1="' + trackArr[i].states[1].receive + '" t2="' + trackArr[i].states[0].receive + '">' +
          '<span>轨迹' + (i + 1) + '</span>' +
          // '<span>位置：</span><span>' + (trackArr[i].placeType == 1 ? '室外' : '室内') + '</span>' +
          '<span>起始时间：</span><span>' + cLib.base.formatterDateDay(trackArr[i].states[1].receive) + '</span>' +
          '<span>截止时间：</span><span>' + cLib.base.formatterDateDay(trackArr[i].states[0].receive) + '</span>' +
          '<span>轨迹长度：</span><span>' + trackArr[i].distance + trackArr[i].unit + '</span>' +
          '</p>'
        )
      };
      me.info_p_event();
    },
    //列表信息点击事件
    info_p_event: function() {
      var me = this;
      var info_p = $('.info_p');
      for (var i = 0; i < info_p.length; i++) {
        info_p[i].onclick = function() {
          // 当前点击对象
          me.partTime1 = $(this).attr('t1');
          me.partTime2 = $(this).attr('t2');

          var opts = {
            device_sn: me.sn,
            // part: me.type,
            begin: me.partTime1,
            end: me.partTime2
          };
          me.oneline(opts);
        };
      }
    },
    // ------------------------------------------------------------------------------速度选择
    select_speed: function() {
      /* body... */
      var me = this;
      $('.sudu_info').off().on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');

        if ($(this).hasClass('active')) {
          switch ($(this).attr('spd')) {
            case '1':
              me.speed = 2000;
              console.log(me.speed);
              break;
            case '2':
              me.speed = 1000;
              console.log(me.speed);
              break;
            case '3':
              me.speed = 500;
              console.log(me.speed);
              break;
            default:
              break;
          }
        }
      })
    },
    // ------------------------------------------------------------------------------一条轨迹
    oneline: function(opts) {
      /* body... */
      var me = this;

      // 从区分室内外数据开始
      me.i = 0;
      me.map.clearOverlays();
      $('.imgDiv').remove();
      clearTimeout(me.timer);

      me.arr = [{
        placeType: 1,
        pois: [
          { lng: 116.4541, lat: 39.9231 },
          { lng: 116.4655, lat: 39.9459 },
          { lng: 116.4958, lat: 39.9182 },
        ],
        src: null
      }, {
        placeType: 0,
        pois: [
          { "lng": 56, "lat": 23 },
          { "lng": 86, "lat": 56 },
          { "lng": 45, "lat": 75 },
          { "lng": 45, "lat": 48 },
        ],
        src: '../images/u169_100.jpg'
      }, {
        placeType: 1,
        pois: [
          { lng: 116.4231, lat: 39.9231 },
          { lng: 116.4455, lat: 39.9719 },
          { lng: 116.4518, lat: 39.9672 },
          { lng: 116.4818, lat: 39.9852 },
        ],
        src: null
      }];

      var all_l = 0;
      for (var i = 0; i < me.arr.length; i++) {
        all_l += me.arr[i].pois.length;
      }
      me.all_length = all_l;

      me.oneline_draw(me.arr);
    },
    oneline_draw: function(arr) {
      /* body... */
      var me = this;
      if (me.i == arr.length) {
        return;
      }
      // 室外
      if (arr[me.i].placeType == 1) {

        $('#map_main').css('z-index', 100);
        $('#in_map').css('z-index', 99);
        me.map.clearOverlays();

        me.draw_out(arr[me.i].pois);
      }
      // 室内轨迹
      else if (arr[me.i].placeType == 0) {

        $('#map_main').css('z-index', 99);
        $('#in_map').css('z-index', 100);
        $('.imgDiv').remove();

        me.draw_in(arr[me.i]);
      }
      me.i++;
    },
    // 室外轨迹
    draw_out: function(argument) {
      /* body... */
      var me = this;
      var arr = argument;
      // 拿到数据进行点收集
      var arr_pois = [];
      for (var i = 0; i < arr.length; i++) {
        var convertData = me.convertCoord({ 'lng': arr[i].lng, 'lat': arr[i].lat });
        var pt = new BMap.Point(convertData.lng, convertData.lat);
        arr_pois.push(pt);
      }
      me.map.addOverlay(new BMap.Polyline(arr_pois, {
        strokeColor: "#21536d",
        strokeWeight: 4,
        strokeOpacity: .5
      }));
      me.map.setViewport(arr_pois);


      var iconPath = "../../../images/man_on.png";
      var pt = arr_pois[0];
      var myIcon = new BMap.Icon(iconPath, new BMap.Size(30, 30), { anchor: new BMap.Size(14, 25) });
      var marker = new BMap.Marker(pt, { icon: myIcon });
      me.map.addOverlay(marker);

      move(0);

      function move(index) {
        /* body... */
        if (index == arr_pois.length) {
          // alert('到达终点');
          me.oneline_draw(me.arr);
          return;
        }
        marker.setPosition(arr_pois[index]);
        me.show_length();
        me.timer = setTimeout(function() {

          index++;
          move(index);

        }, me.speed);
      }
    },
    // 室内轨迹
    draw_in: function(data) {
      /* body... */
      var me = this;

      var me = this;
      var t = new Date().getTime();
      $('#in_img').attr('src', data.src + '?t=' + t);
      $('#in_img').unbind().on('load', function() {
        // 进行比例适应
        ! function bili() {
          var img_bl = $('#in_img').height() / $('#in_img').width();
          var win_bl = $('#in_map').height() / $('#inside').width();
          if (img_bl < win_bl) {
            $('#in_img').css('width', $('#in_img_contain').width() + 'px');
            $('#in_img_contain').css('height', $('#in_img').height() + 'px');
          } else {
            // $('#div').css('height', '100%');
            $('#in_img').css('height', $('#inside').height() + 'px');
            $('#in_img_contain').css('width', $('#in_img').width() + 'px');
          }
        }();
        // 室内打点
        me.in_t_make(data.pois);
      })
    },
    // 室内打点
    in_t_make: function(data) {
      var me = this;
      var arr = [];
      move(0);

      function move(index) {
        if (index == data.length) {
          $('.imgDiv_pos').remove();
          me.oneline_draw(me.arr);
          return;
        }
        // 室内人的图标的打点
        $('.imgDiv').remove();
        $('#in_img_contain').append('<div class="imgDiv" style="top:' + data[index].lng + '%; left:' + data[index].lat + '%" >' +
          '<img  src="../images/man_on.png" style = "" width="30px" height="30px" />' +
          '<div>');
        $('#in_img_contain').append('<div class="imgDiv_pos" style="top:' + data[index].lng + '%; left:' + data[index].lat + '%" >' +
          // '<img  src="../images/man_on.png" style = "" width="30px" height="30px" />' +
          '<div>');

        // 进度
        me.show_length();
        me.timer = setTimeout(function() {
          index++;
          move(index);
        }, me.speed);
      }
    },
    // 显示轨迹
    show_length: function() {
      /* body... */
      var me = this;

      if (me.current_length == (me.all_length - 1)) {
        me.current_length = 0;
        $('#all_l').html('100%');
        layer.msg('轨迹播放完毕！');
      } else {
        $('#all_l').html((me.current_length / me.all_length * 100).toFixed(2) + '%');
        me.current_length++;
      }
    },
    //坐标转化
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
  Sifu.module["CheckTrail"] = CheckTrail;
})(jQuery, window);
