(function ($) {
    //构造器
    function main() {
        this.API=new Sifu.module.API();
    }
    main.prototype = {
        constructor: main,
        init:function(){
            var _self=this;
        }
    }
    Sifu.module["main"] = main;
})(jQuery)