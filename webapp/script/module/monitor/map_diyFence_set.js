/**
 * Item Name  :
 *Creator     :zhang hongchang
 *Email       :zhc.zhang@chinalbs.org
 *Created Date:2016.12.29
 *@pararm     :
 */
(function($, window) {
  function FenceSet(opts) {

    // 地图容器的id
    this.id = opts.id;
    // 设备的识别
    this.sn = opts.sn;
    // 要设置围栏的基准点
    this.point = opts.point;
    // 已经保存的围栏
    // this.fences = opts.fences;
    this.fences = [{
      alarmType: 1,
      center: [
        { lng: 116.336691, lat: 40.006788 }
      ],
      name: '围栏1',
      radius: 46.0300882256396,
      shapeType : 0
    }, {
      alarmType: 0,
      center: [
        { lng: 116.338075, lat: 40.006931 },
        { lng: 116.339081, lat: 40.007299 },
        { lng: 116.339427, lat: 40.006681 },
        { lng: 116.338623, lat: 40.005982 },
        { lng: 116.337061, lat: 40.006263 }
      ],
      name: '围栏2',
      radius: null,
      shapeType : 5
    }, ];

    // 工具控件,自己封装的控件按钮
    this.tools = Sifu.module.diyBdMapTools;
    // 当前正在编辑的围栏
    this.active_f = null;



    // 出入围栏标识
    this.alarmType = null;
    // 形状标识
    this.shapeType = null;
    // 围栏名称
    this.fenceName = '';

  };
  FenceSet.prototype = {
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
      // var convertData = me.convertCoord({ 'lng': data[i].position.lng, 'lat': data[i].position.lat });
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

      // 最优化到围栏的基准点
      me.map.setViewport([new BMap.Point(me.point.lng, me.point.lat)]);
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
      me.fence_bind();
      me.fence();
    },
    // 围栏初始化数据
    fence: function() {
      var me = this;
      me.f_init();
    },
    fence_bind: function() {
      var me = this;
      var fn = {
        f_init: function(argument) {
          var me = this;
          // 添加围栏
          me.f_add();
          // 所有的围栏的显示
          me.f_show_init();
          // 添加画图工具
          me.f_tools();

        },
        // 添加画图工具
        f_tools: function() {
          var me = this;
          var styleOptions = {
            strokeColor: "blue", //边线颜色。
            fillColor: "blue", //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1, //边线的宽度，以像素为单位。
            strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
            fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
          };
          //实例化鼠标绘制工具
          var drawingManager = me.drawingManager = new BMapLib.DrawingManager(me.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
              anchor: BMAP_ANCHOR_TOP_LEFT, //位置
              offset: new BMap.Size(10, 10), //偏离值
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions
          });
          $('.BMapLib_Drawing_panel').hide();
          me.f_add_done();
        },
        // 绘画完成时
        f_add_done: function(argument) {
          var me = this;
          me.drawingManager.addEventListener('overlaycomplete', function(e) {
            me.drawingManager.close();
            // 围栏报警参数
            e.overlay.alarmType = me.alarmType;
            // 围栏的形状参数
            e.overlay.shapeType = me.shapeType;
            // 围栏名称
            e.overlay.fenceName = me.fenceName;

            console.log(e.overlay);
            me.f_all();
          });
        },
        // 所有围栏的事件
        f_all: function() {
          /* body... */
          var me = this;
          var all_f = me.map.getOverlays();
          // 显示信息事件
          me.f_mouseover(all_f);
          // 所有围栏的点击事件
          me.f_click(all_f);
          // 向后台发数据的事件
          me.f_send(all_f);
        },
        // -----------------------------------------------------------全部数据
        f_show_init: function(argument) {
          /* body... */
          var me = this;
          me.f_show();
          me.f_show_e();
        },
        f_show: function() {
          var me = this;
          if (me.fences.length == 0) {
            return;
          }
          for (var i = 0; i < me.fences.length; i++) {
            // 多边形展示
            if (me.fences[i].shapeType == 5) {
              me.f_show_duo(me.fences[i]);
            }
            // 圆形展示
            else if (me.fences[i].shapeType == 0){
              me.f_show_yuan(me.fences[i]);
            }
          }
        },
        f_show_e: function(argument) {
          /* body... */
          var me = this;
          var all_f = me.map.getOverlays();
          // 显示信息事件
          me.f_mouseover(all_f);
          // 所有围栏的点击事件
          me.f_click(all_f);
        },
        // 多多边形展示
        f_show_duo: function(data) {
          var me = this;
          var p_arr = [];
          for (var i = 0; i < data.center.length; i++) {
            var p = data.center[i];
            p_arr.push(new BMap.Point(p.lng, p.lat));
          }

          var marker = new BMap.Polygon(p_arr, {
            strokeColor: "blue", //边线颜色。
            fillColor: "blue", //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1, //边线的宽度，以像素为单位。
            strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
            fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
          });
          marker.fenceName = data.name;
          marker.alarmType = data.alarmType;
          marker.shapeType = 5;
          me.map.addOverlay(marker);
        },
        // 圆形展示
        f_show_yuan: function(data) {
          var me = this;
          var center = new BMap.Point(data.center[0].lng, data.center[0].lat);
          var marker = new BMap.Circle(center, data.radius,{
            strokeColor: "blue", //边线颜色。
            fillColor: "blue", //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1, //边线的宽度，以像素为单位。
            strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
            fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
          });
          marker.fenceName = data.name;
          marker.alarmType = data.alarmType;
          marker.shapeType = 0;
          me.map.addOverlay(marker);
        },
        // -----------------------------------------------------------后台保存
        f_send: function(arr) {
          var me = this;
          var send_data = {
            sn: me.sn,
            fences: []
          };
          var lastData = me.f_send_handle(send_data, arr)
          console.log(lastData);
        },
        // 发送之前的处理
        f_send_handle: function function_name(send_data, arr) {
          var me = this;
          // body...
          for (var i = 0; i < arr.length; i++) {
            var fence = {
              name: '',
              radius: null,
              center: [],
              alarmType: null,
              shapeType:null
            };
            // 圆形
            if (arr[i].shapeType == 0) {
              fence.name = arr[i].fenceName;
              fence.radius = arr[i].getRadius();
              fence.center[0] = { lng: arr[i].getCenter().lng, lat: arr[i].getCenter().lat };
              fence.alarmType = arr[i].alarmType;
              fence.shapeType = arr[i].shapeType;
            }
            // 多边形
            else if(arr[i].shapeType == 5) {
              fence.name = arr[i].fenceName;
              fence.radius = null;
              var p_arr = arr[i].getPath();
              for (var j = 0; j < p_arr.length; j++) {
                fence.center.push({ lng: p_arr[j].lng, lat: p_arr[j].lat });
              }
              fence.alarmType = arr[i].alarmType;
              fence.shapeType = arr[i].shapeType;
            }
            // console.log(fence);
            send_data.fences.push(fence);
          };
          return send_data;
        },
        // -----------------------------------------------------------显示功能
        f_mouseover: function(arr) {
          var me = this;
          for (var i = 0; i < arr.length; i++) {
            arr[i].removeEventListener('mouseover');
            arr[i].addEventListener('mouseover', function(e) {
              var str = '';
              if (e.target.alarmType == 1) {
                str = '出围栏报警';
              } else {
                str = '入围栏报警';
              }
              e.target.indexLayer = layer.msg('围栏名称：' + e.target.fenceName + '<span style="margin-left:20px;"></span>报警条件：' + str, {
                time: 0, //不自动关闭
              });
            });
            arr[i].removeEventListener('mouseout');
            arr[i].addEventListener('mouseout', function(e) {
              layer.close(e.target.indexLayer);
            });
          }
        },
        // -----------------------------------------------------------编辑功能
        // 编辑模式
        f_click: function(arr) {
          var me = this;
          for (var i = 0; i < arr.length; i++) {
            arr[i].removeEventListener('click');
            arr[i].addEventListener('click', function(e) {
              // 没有记录点击的围栏
              if (me.active_f == null) {
                // 收集当前围栏
                me.active_f = e.target;
                me.f_edit(e.target);
              }
              // 记录点击的围栏
              else {
                layer.msg('请完成围栏编辑，在进行其他操作！')
              }
            });
          }
        },
        f_edit: function(dom) {
          /* body... */
          var me = this;

          dom.enableEditing();
          dom.setFillColor('red');
          dom.setStrokeColor('red');
          // 删除添加按钮
          me.map.removeControl(me.f_add_btn);

          // 添加保存和删除按钮
          me.f_saveDel_btn = new me.tools({
            bdMap: me.map,
            mode: true,
            btns: ['保存围栏sav', '删除围栏del'],
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: new BMap.Size(10, 10),
          });
          me.map.addControl(me.f_saveDel_btn);
          // 保存围栏
          me.f_edit_save(dom);
          // 删除围栏
          me.f_edit_del(dom);
        },
        f_edit_save: function(dom) {
          var me = this;
          $('#dom_sav').unbind().on('click', function() {
            var ck = '';
            if (dom.alarmType == 1) {
              ck = '<input name = "alarm" type = "radio" value = "1" checked = "checked" /><span class="f_p_one">出围栏报警</span>' +
                '<input name = "alarm" type = "radio" value = "0"  /><span class="f_p_one">入围栏报警</span>';
            } else {
              ck = '<input name = "alarm" type = "radio" value = "1"  /><span class="f_p_one">出围栏报警</span>' +
                '<input name = "alarm" type = "radio" value = "0" checked = "checked" /><span class="f_p_one">入围栏报警</span>';
            };
            var str = '' +
              '<p  class="f_p">' +
              '<span> 围栏名称： </span>' +
              '<input name = "type" type = "text" value=' + dom.fenceName + ' id = "f_name"/>' +
              '</p>' +
              '<p id = "alarm" class="f_p">' +
              '<span> 报警条件： </span>' +
              ck +
              '</p>';
            layer.open({
              type: 1,
              title: '修改围栏',
              area: ['350px', '160px'],
              zIndex: 600,
              shadeClose: false, //点击遮罩关闭
              content: str,
              btn: ['保存', '取消'],
              success: function() {
                //me.layer_man_dataBack();
              },
              yes: function(index, layero) {
                // 重新拿下原来的值
                dom.fenceName = $('#f_name').val();
                dom.alarmType = $('#alarm input[name="alarm"]:checked').val();
                layer.close(index);

                dom.disableEditing();
                dom.setFillColor('blue');
                dom.setStrokeColor('blue');
                // 清空容器
                me.active_f = null;
                // 清除保存删除按钮
                me.map.removeControl(me.f_saveDel_btn);
                // 后台保存围栏
                var all_f = me.map.getOverlays();
                me.f_send(all_f);
                // 添加围栏
                me.f_add();
              },
              btn2: function(index, layero) {
                layer.close(index);
              }
            });


          })
        },
        f_edit_del: function(dom) {
          var me = this;
          $('#dom_del').unbind().on('click', function() {
            me.map.removeOverlay(dom);
            // 清空容器
            me.active_f = null;
            me.map.removeControl(me.f_saveDel_btn);
            // 后台保存围栏
            var all_f = me.map.getOverlays();
            me.f_send(all_f);
            me.f_add();
          })
        },
        // -----------------------------------------------------------添加功能
        // 添加围栏按钮
        f_add: function() {
          var me = this;
          me.f_add_btn = new me.tools({
            bdMap: me.map,
            mode: true,
            btns: ['新增围栏add'],
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: new BMap.Size(10, 10),
          });
          me.map.addControl(me.f_add_btn);

          // 添加围栏的事件
          me.f_add_e();
        },
        // 添加围栏按钮的点击事件
        f_add_e: function() {
          var me = this;
          var str = '' +
            '<p  class="f_p">' +
            '<span> 围栏名称： </span>' +
            '<input name = "type" type = "text"  id = "f_name"/>' +
            '</p>' +
            '<p id = "type" class="f_p">' +
            '<span> 创建形状： </span>' +
            '<input name = "type" type = "radio" value = "0"  checked = "checked" /><span class="f_p_one">圆形</span>' +
            '<input name = "type" type = "radio" value = "5" /><span class="f_p_one">多边形</span>' +
            '</p>' +
            '<p id = "alarm" class="f_p">' +
            '<span> 报警条件： </span>' +
            '<input name = "alarm" type = "radio" value = "1" checked = "checked" /><span class="f_p_one">出围栏报警</span>' +
            '<input name = "alarm" type = "radio"value = "0" /><span class="f_p_one">入围栏报警</span>' +
            '</p>';
          $('#dom_add').unbind().on('click', function() {
            layer.open({
              type: 1,
              title: '新增围栏',
              area: ['350px', '200px'],
              zIndex: 600,
              shadeClose: false, //点击遮罩关闭
              content: str,
              btn: ['确定', '取消'],
              success: function() {
                //me.layer_man_dataBack();
              },
              yes: function(index, layero) {
                me.f_add_yes(index);
              },
              btn2: function(index, layero) {
                layer.close(index);
              }
            });
          })
        },
        f_add_yes: function(index) {
          var me = this;
          var type = me.shapeType = $('#type input[name="type"]:checked').val();
          me.alarmType = $('#alarm input[name="alarm"]:checked').val();
          me.fenceName = $('#f_name').val();
          // 名字不能为空
          if ($('#f_name').val() == '') {
            layer.msg('围栏名称不能为空！');
            return;
          }
          // 圆形
          if (type == 0) {
            me.f_add_yuan();
          }
          // 多边形
          else if (type == 5) {
            layer.msg('温馨提示：结束多边形绘制，请双击鼠标！');
            me.f_add_duo();
          }

          // 关闭弹窗
          layer.close(index);
        },
        // 添加圆形
        f_add_yuan: function() {
          // body... 
          var me = this;
          me.drawingManager.open();
          me.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
        },
        // 添加多边形
        f_add_duo: function(argument) {
          me.drawingManager.open();
          me.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
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
  };
  Sifu.module["FenceSet"] = FenceSet;
})(jQuery, window);

function executePlan(dom) {
  var row = JSON.parse($(dom).attr('json'));
  $('#fastPlan').hide();
  $('#container').show();

  new fc.module.diyBdMap({ id: 'container' }).init(row);
}
