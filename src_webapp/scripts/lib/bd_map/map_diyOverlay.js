/**
 * Item Name  :
 *Creator         :zhang hongchang
 *Email            :hc.zhang@chinalbs.org
 *Created Date:2016.12.6
 *@pararm     :
 */

(function($, window) {
  function diyOverlay(options,ccObj) {

    var me = this;
    me._point = options.point;
    me._id = options.id
    me.arr = options.cols;

    me._imgUrl1 = '../images/map_icon_001.png';
    me._text1 = options.num ? options.num : 0;

    me._imgUrl2 = '../images/map_icon_002.png';
    me._text2 = options.alarmNum ? options.alarmNum : 0;
    me.ccObj = ccObj;
  };
  diyOverlay.prototype = new BMap.Overlay();
  diyOverlay.prototype.initialize = function(map) {
    var me = this;
    me._map = map;
    var div = me._div = document.createElement("div");
    var p1 = me._p1 = document.createElement("p");
    p1.style['height'] = '15px';
    p1.style['width'] = '40px';
    p1.style['cursor'] = 'pointer';
    $(p1).click(function(){
      var ifm = window.parent.document.getElementById('contentIn');
      $(ifm).attr('src','./html/alarm.html?id='+me._id);
    });

    var p2 = me._p2 = document.createElement("p");
    p2.style['height'] = '15px';
    p2.style['width'] = '40px';
    p2.style['margin-top'] = '5px';
    p2.style['cursor'] = 'pointer';

    $(p2).click(function(){
      me.ccObj.in_table(me.arr,me._id);
      me.ccObj.in_back();
      $('#inside').css('zIndex','1001');
    });

      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(me._point.lat);
      div.style.backgroundColor = "rgba(0,0,0,0.5)";
      div.style.border = "none";
      div.style.color = "white";
      div.style.MozUserSelect = "none";
      div.style.fontSize = "12px",
      div.style.padding = "3px";
      div.style.borderRadius = "8px";


      var img1 = me._img1 = document.createElement('img');
      me._img1.src = me._imgUrl1;
      me._img1.alt = me._img1.title = "报警总数";
      var info1 = me._info1 = document.createElement('span');
      me._info1.innerHTML = me._text1;
      me._p1.appendChild(img1);
      me._p1.appendChild(info1);
      div.appendChild(me._p1);

      var img2 = me._img2 = document.createElement('img');
      me._img2.src = me._imgUrl2;
      me._img2.alt = me._img2.title = "楼内人数";
      var info2 = me._info2 = document.createElement('span');
      me._info2.innerHTML = me._text2;
      me._p2.appendChild(img2);
      me._p2.appendChild(info2);
      div.appendChild(me._p2);

    var arrow = me._arrow = document.createElement("div");
    arrow.style.position = "absolute";
    arrow.style.width = "11px";
    arrow.style.height = "10px";
    arrow.style.top = "22px";
    arrow.style.left = "10px";
    arrow.style.overflow = "hidden";
    div.appendChild(arrow);

    $(me._div).find('img').css({ 'width': '15px', 'height': '15px','float':'left' });
    $(me._div).find('span').css({ 'display': 'inline-block', 'padding': '0 3px','height':'15px','lineHeight':'15px','float':'right' });

    map.getPanes().labelPane.appendChild(div);
    return div;
  };
  diyOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top = pixel.y - 30 + "px";
  };
  conf.module["diyOverlay"] = diyOverlay;
})(jQuery, window);
