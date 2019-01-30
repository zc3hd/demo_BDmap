(function($, window) {
  function FN() {
    var me = this;

    me.all_obj = {
      juhe: {
        // 记录点击的数据包
        ele: null,
      }
    }
  };
  FN.prototype = {
    init: function() {
      var me = this;
      // 
      me._bind();
      // 
      me._init();
    },
    _bind: function() {
      var me = this;
      var fns = {

        _init: function() {

          me._map();

          // 聚合数据
          me._juhe();

          // 退出
          me._out();
        },
        _map: function() {
          me.map = new BMap.Map("map");
          me.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
          me.map.enableScrollWheelZoom();

          me._map_ev();
        },
        _map_ev: function() {
          me.map.addEventListener("click", function(e) {

            // 
            if (e.overlay == null) {
              return;
            }
            if (e.overlay.ele.key==4) {
              return;
            }


            me.all_obj.juhe.ele = e.overlay.ele;


            // 点击的层
            switch (me.all_obj.juhe.ele.key) {
              case 1:
                // 点击1 进入2
                me._juhe_2("new");
                break;
              case 2:
                // 点击2 进入3
                me._juhe_3("new");
                break;
              case 3:
                // 点击3 进入4
                me._juhe_4("new");
                break;
            }
          });
        },


        // 聚合数据
        _juhe: function() {
          me._juhe_1();
        },
        // 第1层数据
        _juhe_1: function() {
          all_data_1 = all_data_1;
          me._juhe_model(all_data_1, 40);
        },
        // 第2层数据
        _juhe_2: function(key) {
          // **************************************模拟数据
          if (key) {
            all_data_2.length = 0;
            for (var i = 0; i < me.all_obj.juhe.ele.sum; i++) {
              all_data_2.push({
                id: i + 1,
                name: "第2层",
                key: 2,
                lng: me.all_obj.juhe.ele.lng + 0.01 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                lat: me.all_obj.juhe.ele.lat + 0.01 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                sum: Math.floor(Math.random() * 6),
              });
            }
          }

          // **************************************模拟数据
          $('#out').show();

          me._juhe_model(all_data_2, 36);
        },
        // 第3层数据
        _juhe_3: function(key) {
          // **************************************模拟数据
          if (key) {
            all_data_3.length = 0;
            for (var i = 0; i < me.all_obj.juhe.ele.sum; i++) {
              all_data_3.push({
                id: i + 1,
                name: "第3层",
                key: 3,
                lng: me.all_obj.juhe.ele.lng + 0.01 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                lat: me.all_obj.juhe.ele.lat + 0.01 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                sum: 2 + Math.floor(Math.random() * 6),
              });
            }
          }
          // **************************************模拟数据
          $('#out').show();

          me._juhe_model(all_data_3, 32);
        },
        // 第4层数据
        _juhe_4: function(key) {
          // **************************************模拟数据
          if (key) {
            all_data_4.length = 0;
            for (var i = 0; i < me.all_obj.juhe.ele.sum; i++) {
              all_data_4.push({
                id: i + 1,
                name: "第4层",
                key: 4,
                lng: me.all_obj.juhe.ele.lng + 0.01 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                lat: me.all_obj.juhe.ele.lat + 0.01 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
                sum: 1,
              });
            }
          }
          // **************************************模拟数据

          me._juhe_model(all_data_4, 28);
        },


        _out: function() {
          $('#out')
            .on('click', function() {

              switch (me.all_obj.juhe.ele.key) {
                case 1:
                  // 当前2，上一层是1，退到1
                  me._out_1();
                  break;
                case 2:
                  // 当前3，上一层是2，退到2
                  me._out_2();
                  break;
                case 3:
                  // 当前4，上一层是3，退到3
                  me._out_3();
                  break;

              }

            });
        },
        // 退到1
        _out_1: function() {
          // 退出按钮消失
          $('#out').hide();

          // 初始化
          me._juhe_1();

          // 点击数据包为null
          me.all_obj.juhe.ele = null;
        },
        _out_2: function() {
          // 退出按钮消失
          $('#out').show();

          // 初始化
          me._juhe_2();

          // 点击数据包为
          me.all_obj.juhe.ele.key = 1;
        },
        _out_3: function() {
          // 退出按钮消失
          $('#out').show();

          // 初始化
          me._juhe_3();

          // 点击数据包为
          me.all_obj.juhe.ele.key = 2;
        },




        // 层渲染数据的模型
        _juhe_model: function(arr, w) {
          // 画之前先清除点
          me.map.clearOverlays();
          // 
          var arr_view = [];
          arr.forEach(function(ele, index) {
            me._juhe_marker(ele, arr_view, w);
          });
          // 
          me.map.setViewport(arr_view);
        },
        // marker
        _juhe_marker: function(ele, arr, w) {
          var pt = new BMap.Point(ele.lng, ele.lat);
          arr.push(pt);

          // 图标
          var icon = new BMap.Icon(`./img/${ele.key}.png`, new BMap.Size(w, w), {
            imageSize: new BMap.Size(w, w)
          });

          var marker = new BMap.Marker(pt, { icon: icon });
          // 
          marker.ele = ele;
          me._juhe_marker_info(marker);

          me.map.addOverlay(marker);
        },
        // 表头
        _juhe_marker_info: function(marker) {
          var str = `
            <div class="marker_title juhe_${marker.ele.key}">
              <div class="item">${marker.ele.name}</div>
              <div class="item">有${marker.ele.sum}个数据</div>
              <div class="arrow"></div>
            </div>
          `;
          var label = new BMap.Label(str, {
            offset: new BMap.Size(0, 0)
          });
          marker.setLabel(label);
        },

      };
      for (var key in fns) {
        me[key] = fns[key];
      }
    },
  };
  window["FN"] = FN;
})(jQuery, window);
