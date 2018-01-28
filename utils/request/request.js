// @ts-nocheck
load();
function load() {
    document.getElementsByTagName('html')[0].style.opacity = '0';
}


var modList = {};

function request(list, f) {

    if (list.length <= 0) {
        if (f) f();
        return;
    }

    if (typeof (list) == 'string') {
        list = [list];
    }

    for (var i = 0; i < list.length; i++) {

        var url = list[i];

        modList[url] = {
            isLoad: false,
        }

        loadMod(url);
    }
    validate(f);


}
function validate(f) {
    var interval = setInterval(function () {

        var isLoad = true;

        for (var x in modList) {
            if (!modList[x].isLoad) {
                isLoad = false;
            }
        }

        if (isLoad) {

            if (f != null && typeof (f) == 'function') {
                try {
                    f();
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.warn('request回调函数未定义');
            }
            clearInterval(interval);
        }

    }, 100);

}
function loadMod(url) {


    if (url.indexOf('.js') >= 0) {

        //js 
        var _script = document.createElement('script');
        _script.type = 'text/javascript';
        _script.charset = 'utf-8';
        _script.async = false;
        _script.src = url;

        console.log(`<script src='${url}'></script>`);

        _script.onload = function () {
            modList[url].isLoad = true;
        }
        _script.onerror = function () {
            console.error('[ ' + url + ' ] 文件出错或不存在');
        }

        document.body.appendChild(_script);


        modList[url].$script = _script;
    }

    if (url.indexOf('.css') >= 0) {
        //css 

        console.log(`<link href='${url}' rel='stylesheet'type='text/css' />`);

        var _link = document.createElement('link');
        _link.rel = 'stylesheet';
        _link.type = "text/css"
        _link.href = url;
        _link.onload = function () {
            modList[url].isLoad = true;
        }
        _link.onerror = function () {
            console.error('[ ' + url + ' ]文件出错或不存在');
        }
        document.head.appendChild(_link);

        modList[url].$script = _link;

    }
}



function requestInit() {

    var name = window.location.href.split('/');
    name = name[name.length - 1];
    name = name.split('.')[0];

    request([
        '../../utils/jquery/jquery.min.js',
    ], function () {
        $.getJSON('../../app.json', function (res) {
            var list = res.request;
            //先导入全局依赖
            request(list, function () {
                //再导入page依赖
                $.getJSON(name + '.json', function (res) {

                    var _list;

                    if (res.request != null && res.request.length > 0) {

                        _list = res.request;
                        request(_list, function () {
                            //最后导入自定义依赖

                            request([name + ".css"], function () { })
                            request([name + ".js"], function () { })

                        });

                    } else {

                        request([name + ".css"], function () { })
                        request([name + ".js"], function () { })
                    }
                });
            });
        });
    })

}
window.onload = function () {
    requestInit();
}