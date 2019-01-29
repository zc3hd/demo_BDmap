function App(opts) {
  var me = this;

  me.conf = {
    center: [116.404, 39.915],
    zoom: 11,
  };

  me.all_obj = {
    // 室外个人追踪的点击开关，没有点击时有点击事件，点击过后只有信息框   man_clicl_key
    ev_key: true,

    // 视图字段
    view_key: false,

    // 全局监控
    all: {
      timer: null,
      time: 3000,

      // 收集点的容器
      arr: [],
    },

    // 楼内监控
    hall: {
      hall_id: null,
      floor_id: null,

      time: 3000,
    },

    // 个人监控
    man: {
      user_id: null,
      // 追踪模式关闭
      mode: false,

      time: 3000,
    },

  };


};
App.prototype = {
  //面向对象初始化
  init: function(row) {
    var me = this;
    me._bind();
    // 
    me._map();

    // 全部监控
    me._all();

    // 楼内监控
    me._hall();

    // 
    me._man();

  },
  _bind: function() {
    var me = this;
    var fn = {
      //控件默认初始化
      _map: function() {
        // 找到地图的ID
        me.map = new BMap.Map("map");
        //
        me.map.centerAndZoom(new BMap.Point(me.conf.center[0], me.conf.center[1]), me.conf.zoom);
        //
        me.map.enableScrollWheelZoom();

        // 
        me._map_ev();
      },
      _map_ev: function() {
        me.map.addEventListener("click", function(e) {
          // 追踪模式开启,不允许再点击
          if (me.all_obj.man.mode) {
            return;
          }

          // 
          if (e.overlay == null) {
            return;
          }

          switch (e.overlay.ele.key) {
            // hall
            case 1:
              me._hall_ev(e.overlay.ele);
              break;
            case 0:
              me._man_ev(e.overlay.ele);
              break;
          }
        });
      },

      // 
      _all: function() {


        // **********************************************模拟数据
        all_data.forEach(function(ele, index) {

          // ren 
          if (ele.key == 0) {
            // 室内外
            if (Math.random() < 0.5) {
              // 室内
              ele.pos_key = "in";
            }
            // 
            else {
              ele.pos_key = "out";
            }



            // 人：状态
            if (Math.random() < 0.33) {
              ele.flag = 0;
            } else if (Math.random() < 0.66) {
              ele.flag = 1;
            } else {
              ele.flag = 2;
            }

            // 人非离线 ：位置
            if (ele.flag != 0) {
              ele.point.lng = ele.point.lng + 0.0001 * (Math.random() > 0.5 ? Math.random() : -Math.random());
              ele.point.lat = ele.point.lat + 0.0001 * (Math.random() > 0.5 ? Math.random() : -Math.random());
            }
          }




          // 楼的数据
          if (ele.key == 1) {

            // 楼总的报警数
            ele.alarmNum = Math.floor(ele.num * Math.random());

            // 
            ele.floor.forEach(function(floor_ele, index) {
              // 每层的数据
              floor_ele.user.forEach(function(user_ele, index) {


                // 人：状态
                if (Math.random() < 0.33) {
                  user_ele.flag = 0;
                } else if (Math.random() < 0.66) {
                  user_ele.flag = 1;
                } else {
                  user_ele.flag = 2;
                }


                // 人非离线
                if (user_ele.flag != 0) {
                  // 每个用户数据位置
                  user_ele.point.lng = user_ele.point.lng + (Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 10));
                  user_ele.point.lat = user_ele.point.lat + (Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 10));

                  if (user_ele.point.lng < 0) {
                    user_ele.point.lng = 10;
                  }
                  // 
                  else if (user_ele.point.lng > 100) {
                    user_ele.point.lng = 90;
                  }

                  if (user_ele.point.lat < 0) {
                    user_ele.point.lat = 10;
                  }
                  // 
                  else if (user_ele.point.lat > 100) {
                    user_ele.point.lat = 90;
                  }
                }






              });

            });
            // console.log(ele.floor);
          }
        });
        // ******************************************************


        // 不是追踪模式
        if (!me.all_obj.man.mode) {
          // 清除
          me.all_obj.all.arr.length = 0;
          me.map.clearOverlays();
          // 渲染
          me._all_render();
        }


        // 定时器开启
        me.all_obj.all.timer = setTimeout(function() {
          me._all();
        }, me.all_obj.all.time);
      },
      _all_render: function() {
        var pt = null;
        all_data.forEach(function(ele, index) {
          // lou
          if (ele.key == 1) {
            me._hall_marker(ele);
            pt = new BMap.Point(ele.point.lng, ele.point.lat);
          }
          // 室外的人ren
          else if (ele.key == 0 && ele.pos_key == "out") {
            me._man_marker(ele);
          }
          
          // 收集所有的点
          me.all_obj.all.arr.push(pt);
        });

        // 视角最优化
        if (!me.all_obj.view_key) {
          me.all_obj.view_key = true;
          me.map.setViewport(me.all_obj.all.arr);
        }
      },

      // 室外人的marker
      _man_marker: function(ele) {
        var pt = new BMap.Point(ele.point.lng, ele.point.lat);

        // 图标
        var icon = new BMap.Icon(`./img/man_${ele.flag}.png`, new BMap.Size(32, 32), {
          imageSize: new BMap.Size(32, 32)
        });

        var marker = new BMap.Marker(pt, { icon: icon });
        // 
        marker.ele = ele;
        me._man_marker_info(marker);

        me.map.addOverlay(marker);
      },
      // 表头
      _man_marker_info: function(marker) {
        if (marker.ele.flag == 2) {
          var str = `
          <div class="marker_title ren">
            <div class="item">姓名:${marker.ele.name}</div>
            <div class="item">联系:admin</div>
            <div class="item">电话:13888888888</div>
            <div class="item">报警:摔倒报警</div>
            <div class="arrow"></div>
          </div>
          `;
          var label = new BMap.Label(str, {
            offset: new BMap.Size(0, 0)
          });
          marker.setLabel(label);
        }
      },


      // 点击人
      _man_ev: function(ele) {

        // 记录用户ID
        me.all_obj.man.user_id = ele.id;

        // 追踪模式开启
        me.all_obj.man.mode = true;

        // 当前数据包执行一次
        me._man_ev_once(ele);

        // 
        me._man_out();
      },
      // 执行一次
      _man_ev_once: function(ele) {

        // 室外
        if (ele.pos_key == 'out') {
          me._man_ev_out(ele);
        }
        // 
        else {
          me._man_ev_in(ele);
        }
      },

      // 室外
      _man_ev_out: function(ele) {
        // **********************************************************
        ele.point.lng = 116.335452 + 0.0001 * (Math.random() > 0.5 ? Math.random() : -Math.random());
        ele.point.lat = 40.007517 + 0.0001 * (Math.random() > 0.5 ? Math.random() : -Math.random());
        // **********************************************************

        $('#user_img').hide();
        // 清除所有
        me.map.clearOverlays();
        // 打点
        me._man_marker(ele);
        // 聚焦
        me.map.setViewport([new BMap.Point(ele.point.lng, ele.point.lat)]);
      },

      // 室内
      _man_ev_in: function(ele) {

        // ************************************************************
        // 楼ID
        ele.hall_id = (Math.random() < 0.5 ? 1 : 2);

        // 层ID
        if (Math.random() < 0.33) {
          ele.floor_id = 1;
        } else if (Math.random() < 0.66) {
          ele.floor_id = 2;
        } else {
          ele.floor_id = 3;
        }

        ele.point.lng = Math.floor(Math.random() * 100);
        ele.point.lat = Math.floor(Math.random() * 100);
        // ************************************************************

        // 
        $('#user_img').show();

        // 图片加载
        $("#one_img_box")
          .attr('src', `./img/${ele.hall_id}_${ele.floor_id}.jpg`)
          // 加载完成
          .on('load', function() {
            // 父级的高度
            $("#one_img_box").parent().css('height', $("#one_img_box").height() + "px");
            $("#one_img_box").parent().css('width', $("#one_img_box").width() + "px");

            // 层打点
            me._man_ev_in_user([ele]);
          });
      },
      // 楼层内的用户打点
      _man_ev_in_user: function(arr) {
        $('#one_user_box>.user').remove();

        var str = '';
        var info = '';
        arr.forEach(function(ele, index) {
          // 报警
          if (ele.flag == 2) {
            info = `
              <div class="marker_title ren">
                  <div class="item">姓名:${ele.name}</div>
                  <div class="item">联系:admin</div>
                  <div class="item">电话:13888888888</div>
                  <div class="item">报警:摔倒报警</div>
                  <div class="arrow"></div>
              </div>
            `;
          }
          // 
          else {
            info = ''
          }

          str += `
              <div class="user" style="top:${ele.point.lng}%;left:${ele.point.lat}%;background: url('./img/man_${ele.flag}.png') center center no-repeat;background-size: cover;">
                ${info}
              </div>
          `;
        });

        $('#one_user_box').append(str);
      },

      // 退出追踪
      _man_out: function() {
        $('#user_out')
          .show()
          .off()
          .on("click", function() {
            // 
            me.all_obj.man.user_id = null;
            // 
            me.all_obj.man.mode = false;
            // 
            $('#user_out').hide();


            // 容器隐藏
            $('#user_img').hide();


            // 清除
            me.all_obj.all.arr.length = 0;
            me.map.clearOverlays();
            // 渲染
            me._all_render();
            me.map.setViewport(me.all_obj.all.arr);

          });
      },

      // 用户的追踪
      _man: function() {

        // 点击了用户
        if (me.all_obj.man.user_id != null && me.all_obj.man.mode) {
          var user_data = null;
          all_data.forEach(function(user_ele, index) {
            // 人
            if (user_ele.key == 0) {
              // 找到人
              if (user_ele.id == me.all_obj.man.user_id) {
                user_data = user_ele;
                return;
              }
            }
          });
          // console.log(floor_ele);
          // 层打点
          me._man_ev_once(user_data);
        }




        setTimeout(function() {
          me._man();
          console.log("--man");
        }, me.all_obj.man.time);
      },



      // 楼的打点
      _hall_marker: function(ele) {
        var pt = new BMap.Point(ele.point.lng, ele.point.lat);

        // 图标
        var icon = new BMap.Icon('./img/hall.png', new BMap.Size(60, 60), {
          imageSize: new BMap.Size(60, 60)
        });

        var marker = new BMap.Marker(pt, { icon: icon });

        // 
        marker.ele = ele;
        me._hall_marker_info(marker);

        me.map.addOverlay(marker);
      },
      // 楼层信息
      _hall_marker_info: function(marker) {
        var alarm = '';
        if (marker.ele.alarmNum != 0) {
          alarm = 'hall_alarm';
        }
        // 没有报警
        else {
          alarm = '';
        }
        var str = `
          <div class="marker_title hall ${alarm}">

            <div class="item">
              ${marker.ele.name}
            </div>

            <div class="item">
              <span class="sum">
                <img src="./img/hall_sum.png" alt="">
              </span>
              <span>${marker.ele.num}</span>
            </div>

            <div class="item">
              <span class="sum">
                <img src="./img/hall_alarm.png" alt="">
              </span>
              <span>${marker.ele.alarmNum}</span>
            </div>

            <div class="arrow"></div>

          </div>
          `;
        var label = new BMap.Label(str, {
          offset: new BMap.Size(0, 0)
        });
        marker.setLabel(label);
      },
      // 楼内事件
      _hall_ev: function(ele) {
        // 图层显示
        $('#img').show();
        // 导航
        me._hall_nav(ele);

        // 退出
        me._hall_out();
      },
      // 加载导航
      _hall_nav: function(data) {
        var str = '';
        data.floor.forEach(function(ele, index) {
          str += `<div class="item item_${ele.id}" _ele='${JSON.stringify(ele)}'>${ele.name}</div>`;
        });

        // 加载导航
        $('#nav')
          .html(str)
          .off()
          .on('click', '.item', function(e) {
            $('#nav>.item').removeClass('ac');
            // 
            me._hall_nav_one(data.id, JSON.parse($(e.target).attr('_ele')));
          });

        // 默认选择第一项
        me._hall_nav_one(data.id, data.floor[0]);
      },
      // 单项
      _hall_nav_one: function(hall_id, floor_ele) {
        // console.log(hall_id,floor_ele);
        // 导航样式
        $(`#nav>.item_${floor_ele.id}`).addClass('ac');

        // 图片加载
        $("#img_box")
          .attr('src', `./img/${hall_id}_${floor_ele.id}.jpg`)
          // 加载完成
          .on('load', function() {
            // 父级的高度
            $("#img_box").parent().css('height', $("#img_box").height() + "px");
            $("#img_box").parent().css('width', $("#img_box").width() + "px");

            // 记录hall、floor_id
            me.all_obj.hall.hall_id = hall_id;
            me.all_obj.hall.floor_id = floor_ele.id;

            // 层打点
            me._hall_nav_one_user(floor_ele.user);
          });
      },
      // 楼内的循坏
      _hall: function() {

        if (me.all_obj.hall.hall_id != null && me.all_obj.hall.floor_id != null) {
          var floor_ele = null;
          all_data.forEach(function(hall_ele, index) {
            // 楼
            if (hall_ele.key == 1) {
              // 找到楼
              if (hall_ele.id == me.all_obj.hall.hall_id) {
                hall_ele.floor.forEach(function(ele, index) {
                  // 找到层
                  if (ele.id == me.all_obj.hall.floor_id) {
                    floor_ele = ele;
                    return;
                  }
                });
              }
            }
          });
          // console.log(floor_ele);
          // 层打点
          me._hall_nav_one_user(floor_ele.user);
        }

        setTimeout(function() {
          me._hall();
          console.log("--hall");
        }, me.all_obj.hall.time);
      },
      // 楼层内的用户打点
      _hall_nav_one_user: function(arr) {
        $('#user_box>.user').remove();

        var str = '';
        var info = '';
        arr.forEach(function(ele, index) {
          // 报警
          if (ele.flag == 2) {
            info = `
              <div class="marker_title ren">
                  <div class="item">姓名:${ele.name}</div>
                  <div class="item">联系:admin</div>
                  <div class="item">电话:13888888888</div>
                  <div class="item">报警:摔倒报警</div>
                  <div class="arrow"></div>
              </div>
            `;
          }
          // 
          else {
            info = ''
          }

          str += `
              <div class="user" style="top:${ele.point.lng}%;left:${ele.point.lat}%;background: url('./img/man_${ele.flag}.png') center center no-repeat;background-size: cover;">
                ${info}
              </div>
          `;
        });

        $('#user_box').append(str);
      },

      // 退出事件
      _hall_out: function() {
        $('#hall_out')
          .off()
          .on('click', function() {
            $('#img').hide();

            // 归零
            me.all_obj.hall.hall_id = null;
            me.all_obj.hall.floor_id = null;
          });
      },






































    };
    for (var k in fn) {
      me[k] = fn[k];
    };
  },
};
