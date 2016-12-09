(function ($) {
    //构造器
    function login() {
        this.API=new Sifu.module.API();
    }
    login.prototype = {
        constructor: login,
        init:function(){
            var _self=this;
        }
    }
    Sifu.module["login"] = login;
})(jQuery)