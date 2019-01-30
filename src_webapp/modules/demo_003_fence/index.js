/**
 * Item Name  :
 *Creator     :zhang hongchang
 *Email       :
 *Created Date:2016.12.29
 *@pararm     :
 */
(function($, window) {
  function FN() {

    var me = this;


    me.conf = {
      // 图形的样式
      style: {
        //边线颜色。
        strokeColor: "blue",
        //填充颜色。当参数为空时，圆形将没有填充效果。
        fillColor: "blue",
        //边线的宽度，以像素为单位。
        strokeWeight: 1,
        //边线透明度，取值范围0 - 1。
        strokeOpacity: 0,
        //填充的透明度，取值范围0 - 1。
        fillOpacity: 0.2,
        //边线的样式，solid或dashed。
        strokeStyle: 'solid'
      },
    };


    me.all_obj = {
      fence: {
        view_arr: [],
        // 弹窗的层级
        index: 0,
      }
    }


    // 当前正在编辑的围栏
    this.active_f = null;



    // 出入围栏标识
    this.alarmType = null;
    // 形状标识
    this.shapeType = null;
    // 围栏名称
    this.fenceName = '';

  };
  FN.prototype = {
    //面向对象初始化
    init: function(row) {
      var me = this;

      me._bind();
      me._map();

      me._fence();
    },
    //控件默认初始化

    _bind: function() {
      var me = this;
      var fn = {
        _map: function() {
          var map = me.map = new BMap.Map("map", { enableMapClick: false });
          map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
          map.enableScrollWheelZoom();

          me._map_ev();
        },
        _map_ev: function() {
          // 
          me.map.addEventListener("mousemove", function(e) {
            // 围栏信息
            me._fence_ev_info(e.overlay);
          });

          me.map.addEventListener("click", function(e) {

            if (e.overlay == null) {
              return;
            }
            // 围栏信息
            me._fence_ev_edit(e.overlay);
          });

        },
        _fence: function(argument) {

          // 添加画图工具
          me._fence_tool();

          // 所有的围栏的显示
          me._fence_show();

          // 添加围栏
          // me.f_add();
        },






        // -----------------------------------------------------------全部数据
        _fence_show: function(argument) {
          /* body... */

          me._fence_render();
          // me.f_show_e();
        },
        _fence_render: function() {

          all_data.forEach(function(ele, index) {
            // 多边形展示
            if (ele.shape == 5) {
              me._fence_duo(ele);
            }
            // 圆形展示
            else if (ele.shape == 0) {
              me._fence_yuan(ele);
            }
          });

          // 初始化
          me.map.setViewport(me.all_obj.fence.view_arr);
        },
        // 多边形展示
        _fence_duo: function(ele) {

          var p_arr = [];
          var p_marker = null;
          ele.path.forEach(function(p, index) {
            p_marker = new BMap.Point(p.lng, p.lat);
            p_arr.push(p_marker);
            me.all_obj.fence.view_arr.push(p_marker);
          });

          var marker = new BMap.Polygon(p_arr, me.conf.style);
          marker.ele = ele;
          me.map.addOverlay(marker);

          p_arr = null;
          p_marker = null;
          marker = null;
        },
        // 圆形展示
        _fence_yuan: function(ele) {

          var center = new BMap.Point(ele.center.lng, ele.center.lat);
          me.all_obj.fence.view_arr.push(center);

          var marker = new BMap.Circle(center, ele.radius, me.conf.style);
          marker.ele = ele;
          me.map.addOverlay(marker);

          center = null;
          center = null;
        },
        // 
        _fence_ev_info: function(overlay) {
          // 存在
          if (overlay != null) {
            $('#info')
              .show()
              .html(`
                围栏名称：${overlay.ele.name}
                报警条件：${overlay.ele.alarm}
              `);
          }
          // 
          else {
            $('#info').hide()
          }
        },
        // 点击进入编辑模式
        _fence_ev_edit:function (overlay) {
          overlay.enableEditing();
          overlay.setFillColor('red');
          overlay.setStrokeColor('red');
        },
















        // 添加画图工具
        _fence_tool: function() {

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
            //是否开启绘制模式
            isOpen: false,
            //是否显示工具栏
            enableDrawingTool: false,
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions
          });
          // me.f_add_done();
        },
        // 绘画完成时
        f_add_done: function(argument) {

          me.drawingManager
            .addEventListener('overlaycomplete', function(e) {
              me.drawingManager.close();

              // 围栏报警参数
              e.overlay.alarmType = me.alarmType;
              // 围栏的形状参数
              e.overlay.shapeType = me.shapeType;
              // 围栏名称
              e.overlay.fenceName = me.fenceName;


              var m_Bounds = e.overlay.getBounds();

              var pt = new BMap.Point(m_Bounds.Ee, m_Bounds.De);
              var marker = new BMap.Marker(pt);
              me.map.addOverlay(marker);

              var pt = new BMap.Point(m_Bounds.Je, m_Bounds.Ie);
              var marker = new BMap.Marker(pt);
              me.map.addOverlay(marker);


              me.f_all();
            });
        },

        // 所有围栏的事件
        f_all: function() {
          /* body... */

          var all_f = me.map.getOverlays();
          // 显示信息事件
          me.f_mouseover(all_f);
          // 所有围栏的点击事件
          me.f_click(all_f);
          // 向后台发数据的事件
          me.f_send(all_f);
        },
        f_show_e: function(argument) {
          /* body... */

          var all_f = me.map.getOverlays();
          // 显示信息事件
          me.f_mouseover(all_f);
          // 所有围栏的点击事件
          me.f_click(all_f);
        },







        // -----------------------------------------------------------后台保存
        f_send: function(arr) {

          var send_data = {
            sn: me.sn,
            fences: []
          };
          var lastData = me.f_send_handle(send_data, arr)
          console.log(lastData);
        },
        // 发送之前的处理
        f_send_handle: function function_name(send_data, arr) {

          // body...
          for (var i = 0; i < arr.length; i++) {
            var fence = {
              name: '',
              radius: null,
              center: [],
              alarmType: null,
              shapeType: null
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
            else if (arr[i].shapeType == 5) {
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


        // -----------------------------------------------------------编辑功能
        // 编辑模式
        f_click: function(arr) {

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


          dom.enableEditing();
          dom.setFillColor('red');
          dom.setStrokeColor('red');
          // 删除添加按钮
          me.map.removeControl(me.f_add_btn);

          // 添加保存和删除按钮

          // 保存围栏
          me.f_edit_save(dom);
          // 删除围栏
          me.f_edit_del(dom);
        },
        f_edit_save: function(dom) {

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


          // 添加围栏的事件
          me.f_add_e();
        },
        // 添加围栏按钮的点击事件
        f_add_e: function() {

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
          $('#dom_add')
            .off()
            .on('click', function() {
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

          me.drawingManager.open();
          me.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
        },
        // 添加多边形
        f_add_duo: function(argument) {
          me.drawingManager.open();
          me.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
        },
      };
      for (var k in fn) {
        me[k] = fn[k];
      };
    },
  };
  window["FN"] = FN;
})(jQuery, window);
