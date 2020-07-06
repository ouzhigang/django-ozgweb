
var cfg = {
    web_server_root: '/server/mgr/',
    web_root: '/static/mgr/',
	web_res_root: '/static/',
    web_title: 'django-ozgweb后台管理系统'
}

var func = {
    get_rest_param(name) {
        var url = window.location.href.split("#");
        url = url[1];

        var params = url.split("/");
        for(var i = 0; i < params.length; i++) {
            if(params[i] == name) {
                var k = i + 1;
                if(params[k] != undefined) {
                    return params[k];
                }
                else {
                    return null;
                }
            }
        }

        return null;
    }
    
}

export {
    cfg,
    func
}
