/**
 * Item Name  : 
 *Creator         :zhang hongchang
 *Email            :hc.zhang@chinalbs.org
 *Created Date:2016.12.6
 *@pararm     :
 */
(function($, window) {
    //  自定义控件
    function diyBdMapTools(opts) {
        this.map = opts.bdMap;
        this.defaultAnchor = opts.anchor;
        this.defaultOffset = opts.offset;

        this.otherBtns  = opts.btns;
        this.rightMouseKey = false;  //鼠标右键事件的关键字

        this.mode = opts.mode;   //用于--控件--作为--按钮使用！
    }
    // 通过JavaScript的prototype属性继承于BMap.Control
    diyBdMapTools.prototype = new BMap.Control();
    diyBdMapTools.prototype.initialize = function () {
        var me = this;
        //控件的容器
        var div = document.createElement("div");

        div.style.height = '36px';
        div.style.border = '2px solid #21536d';
        div.style.position = 'absolute';
        div.style.backgroundColor = 'white';
        
        //用于其他按钮时
        if(me.mode){  
            div.id = 'btnsContianer';

            for(var i=0;i<me.otherBtns.length;i++){
                var domData = {
                    id:'dom_'+me.otherBtns[i].slice(-3),
                    height:'36px',
                    width:'72px',
                    float:'left',
                    backgroundColor:'white',
                    title:me.otherBtns[i].slice(0,-3),
                    html:me.otherBtns[i].slice(0,-3),
                    color:'#21536d',
                };
                var dtdom = me.commonBtn(domData);
                div.appendChild(dtdom);
            }
        }
        else{   //作为自定义控件时

            div.id = 'toolsContianer';

            //--地图
            var dtDOM ={
                id:'dt',
                height:'36px',
                width:'36px',
                float:'left',
                backgroundColor:'white',
                title:'普通地图',
                target:'显示普通地图',
                html:'地图',
                color:'#21536d',
            };
            var dtdom = me.replaceBaner(dtDOM);
            $(dtdom).click();
            div.appendChild(dtdom);

            //--卫星
            var wxDOM ={
                id:'wx',
                height:'36px',
                width:'36px',
                float:'left',
                backgroundColor:'white',
                title:'显示卫星',
                target:'显示卫星影像',
                html:'卫星',
                color:'#21536d',
            };
            var wxdom = me.replaceBaner(wxDOM);
            div.appendChild(wxdom);

            //--三维
            var swDOM ={
                id:'sw',
                height:'36px',
                width:'36px',
                float:'left',
                backgroundColor:'white',
                title:'显示三维',
                target:'显示三维地图',
                html:'三维',
                color:'#21536d',
            };
            var swdom = me.replaceBaner(swDOM);
            div.appendChild(swdom);

            //--全景
            var qjDOM ={
                id:'qj',
                height:'36px',
                width:'36px',
                float:'left',
                backgroundColor:'white',
                title:'显示全景',
                target:'进入全景',
                html:'全景',
                color:'#21536d',
            };
            var qjdom = me.replaceBaner(qjDOM);
            div.appendChild(qjdom);

            //--交通
            var jtDOM ={
                id:'jt',
                height:'36px',
                width:'36px',
                float:'left',
                backgroundColor:'white',
                title:'显示交通',
                target:'显示交通流量',
                html:'交通',
                color:'#21536d',
            };
            var jtdom = me.replaceBaner(jtDOM);
            div.appendChild(jtdom);
        }

        me.map.getContainer().appendChild(div);
        return div;

    };
    diyBdMapTools.prototype.replaceBaner = function (options) {
        var me  = this;
        var domDiv = document.createElement("div");
        domDiv.id = options.id;
        domDiv.style.height = options.height;
        domDiv.style.width = options.width;
        domDiv.style.float = options.float||'left';
        domDiv.style.backgroundColor = options.backgroundColor;
        domDiv.title = options.title;
        domDiv.innerHTML  = options.html;
        domDiv.style.fontSize = '14px';
        domDiv.style.lineHeight = options.height;
        domDiv.style.textAlign = 'center';
        domDiv.style.color = options.color;
        domDiv.style.cursor = 'pointer';
        domDiv.onclick = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            $("div[title="+options.target+"]").click();
            if(options.target=='进入全景'){
                me.rightMouseKey=true;   //打开--开关
            };
            $(this).animate({'width':'80px','fontSize':'18px'}).css({'backgroundColor':'#21536d',color:'white'},50).siblings().animate({'width':'36px','fontSize':'14px'}).css({'backgroundColor':'white',color:'#21536d'},50);
        };
        $(document).mousedown(function (e) {
            if(e.which==3&&me.rightMouseKey==true){    //右键点击且从全景进入。
                $("div[title='进入全景']").trigger('click');   ///再次委派一次真的按钮
                me.rightMouseKey=false;   //关闭按钮
            }
        });  //对于全景的鼠标右键事件
        return domDiv;
    };
    diyBdMapTools.prototype.commonBtn= function (options) {
        var me  = this;
        var domDiv = document.createElement("div");
        domDiv.id = options.id;
        domDiv.style.height = options.height;
        domDiv.style.width = options.width;
        domDiv.style.float = options.float||'left';
        domDiv.style.backgroundColor = options.backgroundColor;
        domDiv.title = options.title;
        domDiv.innerHTML  = options.html;
        domDiv.style.fontSize = '14px';
        domDiv.style.lineHeight = options.height;
        domDiv.style.textAlign = 'center';
        domDiv.style.color = options.color;
        domDiv.style.cursor = 'pointer';
        domDiv.onclick = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }

//            $(this).animate({'width':'90px','fontSize':'18px'}).css({'backgroundColor':'#21536d',color:'white'},50).siblings().animate({'width':'72px','fontSize':'14px'}).css({'backgroundColor':'white',color:'#21536d'},50);
        };
        return domDiv;
    };
    Sifu.module["diyBdMapTools"] = diyBdMapTools;
})(jQuery, window);