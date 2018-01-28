// @ts-nocheck
initGlobalVariable();

//初始化一些全局变量
function initGlobalVariable(conf, fun) {


    //服务器地址===================================
    window.serverRoot = 'http://' + window.location.host + '/server/index.php';

    //服务器home分组地址===================================
    window.serverRootHome = serverRoot + 'home/';
    //服务器Admin分组地址===================================
    window.serverRootAdmin = serverRoot + 'Admin/';

    //当前页面的的名字===================================
    var name = window.location.pathname.split('/');
    name = name[name.length - 1];
    name = name.split('.')[0];
    window.pagesName = name;
    if (fun) fun();

}

function pages(conf) {

    if (pagesName !== 'login') {
        isLogin(function () {
            initPage(conf);
        });
    } else {
        initPage(conf);
    }

}

function initPage(conf) {

    conf.el = '#pageApp';
    window.pageApp = new Vue(conf);

    if (window.pageApp.onLoadPage) {
        window.pageApp.onLoadPage();
    }
    $("html").animate({ opacity: '1' }, 0);
}

/** -
* 判断是否登录
* 
*/
function isLogin(fun) {
    if (!fun) return;
    $.post(serverRootAdmin + 'index/isLogin', function (res) {

        res = JSON.parse(res);
        if (res.res == 1) {
            //已经登录`
            fun();
        } else {
            window.location.href = '../../pages/login/login.html';
        }

    });
}

function signOut(params) {

}


var regDirective = function () {




}
regDirective();

var origin = (function () {

    var obj = {

        post: function (conf) {
            $.post(conf.url, conf.data, function (res) {
                try {
                    res = JSON.parse(res);

                } catch (error) {
                    console.error(conf.url + '：接口出现错误！');
                    console.error(error);
                    console.error(res);
                    if (conf.error) {
                        conf.error(false, error);
                    }
                    return false;
                }

                //登录验证
                if (res.res == -992 || res.rse == -991) {
                    //登录失败跳转登录页
                    window.location.href = '../login/login.html'
                } else {
                    if (conf.success) {
                        conf.success(res);
                    }
                }
            });
        },
        get: function (conf) {
            $.get(conf.url, conf.data, function (res) {
                try {
                    res = JSON.parse(res);
                    //登录验证
                    if (res.res == -992 || res.rse == -991) {
                        //登录失败跳转登录页
                        window.location.href = '../login/login.html'
                    } else {
                        if (conf.success) {
                            conf.success(res);
                        }
                    }
                } catch (error) {
                    console.error(conf.url + '：接口出现错误！');
                    console.error(error);
                    if (conf.error) {
                        conf.error(res, error);
                    }
                    return false;
                }
            });

        }
    }

    return obj;
}());

//可 ajax 的对象
var Ajax = function (conf) {
    extend(this, conf);
    this.conf = conf;
    //url处理

    var url = this.url;
    if (url.indexOf('http') == -1) {
        //没有http
        this.url = serverRootAdmin + this.url;
    }


    //继承
    this.post = () => {
        origin.post({
            url: this.url,
            data: this.data,
            success: this.success,
            error: this.error,
        });
    }
    this.get = () => {
        origin.get({
            url: this.url,
            data: this.data ? this.data : [],
            success: this.success,
            error: this.error,
        });
    }
}


var extend = function (parent, subclass) {
    for (var x in subclass) {
        parent[x] = subclass[x];
    }
    return parent;
};

