// @ts-nocheck
Vue.component('order-comp', function (resolve, reject) {
    //获得组件的html代码
    getComponent('order/order', function (comp) {
        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            // props: [],
            //设置组件的data
            data: function () {
                return {
                }
            },
            methods: {

            },
            watch: {

            }
        });

    })

});