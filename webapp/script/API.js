/*!
 * Item Name    : 数据API
 * Creator      : 王鹏
 * Created Date : 2016.12.2
 */
(function ($) {
    //构造器
    function API() {

    };
    API.prototype = {
        // 登陆
        login : function(requestModel) {
            return $.ajax({
                url : Sifu.basePrefixURL + "/login/login.do",
                dataType : "json",
                type:"post",
                data : requestModel,
                async : false
            });
        }
    }
    //将设备服务模型添加到全局变量中
    Sifu.module["API"] = API;
})(jQuery);
