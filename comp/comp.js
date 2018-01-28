// @ts-nocheck
function getComponent(url, fun) {

    url = `../../comp/${url}.comp.html`;

    $('<div/>').load(url, function (res) {
        if (fun) fun(res);
    });
}

function regComp() {
    //注册导航栏
    Vue.component('nav-comp', function (resolve, reject) {
        //获得组件的html代码
        getComponent('nav/nav', function (comp) {
            //获得导航栏配置
            $.getJSON('../../app.json', function (conf) {
                var navList = conf.nav;

                //注册组件的回调函数
                resolve({
                    //设置组件的模板
                    template: comp,
                    //设置组件的属性
                    // props: [],
                    //设置组件的data
                    data: function () {
                        return {
                            //栏目列表，需要使用配置文件获得
                            navList: navList,
                            isCollapse: localStorage.isCollapse == 'true' ? true : false,
                            active: pagesName,
                        }
                    },
                    methods: {
                        open: function (key, keyPath) {
                            var pageUrl = `../../pages/${key}/${key}.html`;
                            window.location.href = pageUrl;
                        },
                        setActive: function () {
                        }
                    },
                    watch: {
                        isCollapse: function (isCollapse) {
                            localStorage.isCollapse = isCollapse;
                        }
                    }
                });
            });

        })

    });
    //注册表格组件
    Vue.component('table-comp', function (resolve, rejpagesect) {
        //获得组件的html代码
        getComponent('table/table', function (comp) {
            //注册组件的回调函数
            resolve({
                //设置组件的模板
                template: comp,
                //设置组件的属性
                props: ['conf'],
                //设置组件的data
                data: function () {
                    return {
                        data: [],
                    };
                },
                methods: {
                    del: function (index, row, ajaxConf) {

                        if (ajaxConf) {
                            //执行ajax删除
                            var ajax = new Ajax({
                                url: ajaxConf.url,
                                data: ajaxConf.data,
                                success: (res) => {

                                    if (res.res == 1) {
                                        //删除成功
                                        if (ajaxConf.success) {
                                            ajaxConf.success(res);
                                        } else {
                                            this.$message({
                                                type: 'success',
                                                message: '删除成功~'
                                            });
                                        }
                                        this.data.splice(index, 1);
                                        this.conf.page.total--;
                                    }
                                    if (res.res == -1) {
                                        //删除失败
                                        if (ajaxConf.error) {
                                            ajaxConf.error(res);
                                        } else {
                                            this.$message({
                                                type: 'error',
                                                message: '删除失败！'
                                            });
                                        }
                                    }
                                },
                                error: (res, error) => {
                                    if (ajaxConf.error) {
                                        ajaxConf.error(false, error);
                                    }
                                    this.$message({
                                        type: 'error',
                                        message: '删除接口出现错误！'
                                    });
                                }
                            });
                            ajax.post();
                        }
                    },
                    /**
                     * 批量删除
                     */
                    batchDeleting: function (delList, ajaxConf) {
                        //如果长度为0就不执行
                        if (this.conf.table.selectList.length <= 0) return;
                        //如果不传参数，就默认为选中的项
                        delList = delList != null ? delList : this.conf.table.selectList;
                        //将数据记录在变量中方便处理
                        var list = this.data.slice();
                        //清空数据
                        this.data = [];
                        //删除判断循环开始
                        for (var i = list.length - 1; i >= 0; i--) {
                            for (var j = 0; j < delList.length; j++) {
                                //如果此项需要删除，就删除
                                if (delList[j] == list[i]) {
                                    list.splice(i, 1);
                                }
                            }
                        }
                        //重新赋值数据
                        this.data = list;
                        //判断是否执行ajax
                        if (ajaxConf) {
                            var ajax = new Ajax({
                                url: ajaxConf.url,
                                data: ajaxConf.data,
                                success: (res) => {
                                    if (res.res == 1) {
                                        //删除成功
                                        if (ajaxConf.success) {
                                            ajaxConf.success(res);
                                        } else {
                                            this.$message({
                                                type: 'success',
                                                message: '删除成功~'
                                            });
                                        }
                                        this.conf.page.total -= delList.length;
                                    }
                                    if (res.res == -1) {
                                        //删除失败
                                        if (ajaxConf.error) {
                                            ajaxConf.error(res);
                                        } else {
                                            this.$message({
                                                type: 'error',
                                                message: '删除失败！'
                                            });
                                        }
                                    }
                                },
                                error: (res, error) => {

                                    if (ajaxConf.error) {
                                        ajaxConf.error(false, error);
                                    } else {
                                        if (res === false) {
                                            this.$message({
                                                type: 'error',
                                                message: '删除接口出现错误！'
                                            });
                                        }
                                    }

                                }
                            });
                            ajax.post();

                        }
                    },
                    handleSelectionChange: function (val) {
                        // 选中项发生变化时触发
                        this.conf.table.selectList = val;
                    },
                    changeSize: function (val) {
                        //页面显示数量改变触发
                        this.conf.page.pageSize = val;
                        localStorage[pagesName + '_tablePageSize'] = this.conf.page.pageSize;
                        // this.refresh();
                    },
                    changeCurrent: function (val) {
                        //页面切换触发
                        this.conf.page.currentPage = val;
                        localStorage[pagesName + '_tableCurrentPage'] = this.conf.page.currentPage;
                        // this.refresh();
                    },
                    refresh: function (a, b) {
                        this.conf.table.loading = true;

                        var fun;
                        var url;
                        var conf;
                        if (typeof (a) == 'function') {
                            fun = a;
                        } else {
                            fun = b;
                            conf = a;
                        }

                        if (conf != null) {

                            if (conf.url != null) {
                                this.conf.url = conf.url;
                            }

                            if (conf.data != null) {
                                this.conf.data = conf.data;
                            }

                        }

                        // this.data = [];
                        //默认携带分页数据
                        //当前页
                        this.conf.data.page = this.conf.page.currentPage;
                        //每页显示条数
                        this.conf.data.limit = this.conf.page.pageSize;

                        var ajax = new Ajax({
                            url: this.conf.url,
                            data: this.conf.data ? this.conf.data : {},
                            success: (res) => {
                                this.data = res.msg;
                                this.conf.table.loading = false;
                                this.conf.page.total = res.count;
                                if (fun) fun(res);
                            }
                        });

                        ajax.get();

                    },
                    changeFilter: function (val) {
                        console.log(val);
                    }
                },
                computed: {
                    init: function () {
                        console.log('init');
                        this.refresh();
                    },
                },
                watch: {
                }
            });
        })

    });

    //注册文件选择器
    Vue.component('file-list-comp', function (resolve, reject) {
        //获得组件的html代码
        getComponent('file-list-comp/file-list-comp', function (comp) {

            //注册组件的回调函数
            resolve({
                //设置组件的模板
                template: comp,
                //设置组件的属性
                props: ['activefile', 'server'],
                //设置组件的data
                data: function () {
                    return {
                        loading: true,
                        //文件列表
                        list: [],
                        //分页组件
                        page: {
                            //当前页
                            indexPage: 1,
                            //总条数
                            total: 0,
                            sizes: [8, 16],
                            size: 8,
                        },
                        file: null,

                    }
                },
                methods: {

                    //构建基本的列表
                    builderlist: function (list) {
                        for (let i = 0; i < list.length; i++) {
                            list[i].isActive = false;
                            list[i].isLoading = true;
                            list[i].isError = false;
                        }
                        return list;
                    },
                    //刷新
                    refresh: function () {
                        this.loading = true;
                        var data = {};
                        //当前页
                        data.page = this.page.indexPage;
                        //每页显示条数
                        data.limit = this.page.size;
                        //要查询的表
                        data.table = 'assets';
                        //条件查询
                        data.where = {
                            is_recycle: 0,
                            type: 'img',
                        };
                        var ajax = new Ajax({
                            url: "assets/getList",
                            data: data,
                            success: (res) => {
                                this.page.total = res.count;
                                this.list = this.builderlist(res.msg);
                                this.loading = false;
                            }
                        });
                        ajax.get();
                    },
                    // 每页显示数量被改变
                    handleSizeChange: function (val) {
                        this.page.size = val;
                        this.refresh();
                    },
                    // 当前页被改变
                    handleCurrentChange: function (val) {
                        this.page.indexPage = val;
                        this.refresh();
                    },
                    //获得全路径
                    getUrl: function (index, item, url) {
                        if (url.indexOf('http') == -1) {
                            return serverRoot + url;
                        } else {
                            return url;
                        }
                    },
                    //设置选中项
                    setActive: function (index, item, list) {

                        for (let i = 0; i < list.length; i++) {
                            if (item != list[i]) {
                                list[i].isActive = false;
                            }
                        }
                        item.isActive = !item.isActive;

                        if (this.server) {
                            this.file = this.getUrl(null, null, item.url);
                        } else {
                            this.file = item.url;
                        }
                        if (!item.isActive) {
                            this.file = '';

                        }
                        this.$emit('update:activefile', this.file);

                    },
                },
                computed: {
                    //初始化列表
                    init: function () {
                        this.refresh();
                    }
                }
            });

        })

    });

    //注册产品添加组件
    Vue.component('goods-add-comp', function (resolve, rejpagesect) {
        //获得组件的html代码
        getComponent('goods/goods-add', function (comp) {
            //注册组件的回调函数
            resolve({
                //设置组件的模板
                template: comp,
                //设置组件的属性
                props: ['item', 'type'],
                //设置组件的data
                data: function () {
                    return {
                        head_img: {
                            url: '',
                            _url: '',
                            is_select: false,
                        },

                        add: {
                            data: {
                                goods_title: '',
                                goods_count: '',
                                money: '',
                                max: '',
                                imglist: [{
                                    url: '',
                                    btn: {
                                        title: '选择',
                                        //关闭状态
                                        off: '选择',
                                        //打开状态
                                        on: '关闭选择',
                                    },
                                    is_select: false,
                                }],
                                spec: [
                                    {
                                        isEdit: false,
                                        text: '规格1',
                                    },
                                    {
                                        isEdit: false,
                                        text: '规格2',
                                    },
                                ],
                                goods_info: '',
                                depot: {
                                    depot_id: '',
                                    depot_title: ''
                                },
                            },

                        },
                        btn: {
                            selectHeadImg: {
                                title: '选择',
                                //关闭状态
                                off: '选择',
                                //打开状态
                                on: '关闭选择',
                            },
                            imglistSelect: {
                                is: false,
                                title: '展开产品配图选择',
                                //关闭状态
                                off: '展开产品配图选择',
                                //打开状态
                                on: '关闭产品配图选择',
                            },
                            spec: {
                                is: false,
                                title: '展开产品规格选择',
                                //关闭状态
                                off: '展开产品规格选择',
                                //打开状态
                                on: '关闭产品规格选择',
                            },
                            goodsInfo: {
                                is: false,
                                title: '展开产品详情',
                                //关闭状态
                                off: '展开产品详情',
                                //打开状态
                                on: '关闭产品详情',
                            }
                        }
                    };
                },
                methods: {

                    cancel: function () {
                        this.$emit('cancel');
                    },
                    /**
                     * 设置某个的标题文本
                     */
                    setTitle: function (item, is) {
                        if (is) {
                            item.title = item.on;
                        } else {
                            item.title = item.off;
                        }
                    },
                    getUrl: function (url) {

                        if (url) {
                            if (url.indexOf('http') == -1) {
                                return serverRoot + url;
                            } else {
                                return url;
                            }
                        }

                    },
                    update: function (item) {

                        this.$nextTick(_ => {

                            if (item == null) {
                                item = this.item;
                            }
                            this.builderlist(item);
                        })

                    },
                    //构建基本数据
                    builderlist: function (item) {
                        //配置头像
                        this.head_img.url = item.head_img;

                        this.add.data.goods_title = item.goods_title;
                        this.add.data.goods_count = item.goods_count;
                        this.add.data.money = item.money;
                        this.add.data.max = item.max;
                        this.add.data.goods_info = item.goods_info;

                        this.add.data.depot.depot_name = item.depot_name;
                        this.add.data.depot.depot_id = item.depot_id;

                        //找仓库
                        // var ajax = new Ajax({
                        //     url: serverRootAdmin + 'depot/getList',
                        //     data: {
                        //         table: 'depot',
                        //         where: {
                        //             depot_id: item.depot_id
                        //         }
                        //     },
                        //     success: (res) => {
                        //         console.log(res);
                        //         if (res.res == 1) {
                        //             this.add.data.depot.depot_name = res.msg[0].depot_name;
                        //             this.add.data.depot.depot_id = item.depot_id;
                        //         }
                        //     }
                        // });

                        // ajax.get();


                        var specList = [];
                        for (var i = 0; i < item.spec.length; i++) {
                            specList.push({
                                text: item.spec[i].text,
                                isEdit: false,
                            })
                        }

                        var imglist = [];

                        for (var i = 0; i < item.imglist.length; i++) {
                            imglist.push({
                                url: item.imglist[i],
                                btn: {
                                    title: '选择',
                                    //关闭状态
                                    off: '选择',
                                    //打开状态
                                    on: '关闭选择',
                                },
                                is_select: false,
                            })
                        }

                        this.add.data.spec = specList;
                        this.add.data.imglist = imglist;


                    },
                    selectImg: function (imgItem, btn) {
                        imgItem.is_select = !imgItem.is_select;
                        this.setTitle(btn, imgItem.is_select)
                    },
                    addFormItem: function () {

                        this.add.data.imglist.push({
                            url: '',
                            btn: {
                                title: '选择',
                                //关闭状态
                                off: '选择',
                                //打开状态
                                on: '关闭选择',
                            },
                            is_select: false,
                        });

                    },
                    remove: function (item, index, list) {
                        list.splice(index, 1);
                    },
                    moneyFormat: function (n) {

                        n = n.replace(/,/g, '');
                        var pattern = /(?=((?!\b)\d{3})+$)/g;
                        return n.replace(pattern, ',');

                    },
                    editSpec: function (item, index) {
                        item.isEdit = false;
                    },
                    showSpecEdit: function (item, index) {
                        item.isEdit = true;
                        this.$nextTick(_ => {

                        });

                    },
                    addSpec: function () {
                        this.add.data.spec.push({
                            isEdit: true,
                            text: '规格',
                        });
                    },
                    delSpec: function (item, index, list) {
                        list.splice(index, 1);
                    },

                    saveGoods: function () {

                        var goods_info = window[this.type + 'sum'].summernote('code');
                        var _add = this.add.data;
                        _add.goods_info = goods_info;


                        //处理配图列表
                        var imglist = [];
                        for (var i = 0; i < this.add.data.imglist.length; i++) {
                            var item = this.add.data.imglist[i];
                            imglist.push(item.url);
                        }

                        //处理规格列表

                        var specList = [];

                        for (var i = 0; i < this.add.data.spec.length; i++) {
                            var item = this.add.data.spec[i];
                            specList.push({
                                text: item.text,
                                value: item.text
                            });
                        }


                        //组装要保存的数据
                        var add = {
                            //产品标题
                            goods_title: _add.goods_title,
                            goods_count: _add.goods_count,
                            //产品详情
                            goods_info: _add.goods_info,
                            //费用
                            money: _add.money,
                            max: _add.max,
                            //头像
                            head_img: this.head_img.url,
                            imglist: JSON.stringify(imglist),
                            spec: JSON.stringify(specList),
                            depot_id: _add.depot.depot_id
                        }
                        var data;
                        var url;

                        if (this.type == 'add') {
                            url = 'goods/add';
                            data = {
                                table: 'goods',
                                add: add
                            }
                        }

                        if (this.type == 'save') {
                            url = 'goods/save';
                            data = {
                                table: 'goods',
                                id: this.item.goods_id,
                                save: add
                            }
                        }

                        var ajax = new Ajax({
                            url: serverRootAdmin + url,
                            data: data,
                            success: (res) => {

                                if (res.res == 1) {
                                    this.$message({
                                        message: this.type == 'add' ? '添加成功！' : '保存成功',
                                        type: 'success'
                                    });
                                    this.$emit('on-success', res);
                                    // form
                                    //清空数据
                                    this.head_img.url = '';
                                    this.add.data.goods_title = '';
                                    this.add.data.goods_count = '';
                                    this.add.data.money = '';
                                    this.add.data.max = '';
                                    this.add.data.imglist = [{
                                        url: '',
                                        btn: {
                                            title: '选择',
                                            //关闭状态
                                            off: '选择',
                                            //打开状态
                                            on: '关闭选择',
                                        },
                                        is_select: false,
                                    }];
                                    this.add.data.spec = [
                                        {
                                            isEdit: false,
                                            text: '规格1',
                                        },
                                        {
                                            isEdit: false,
                                            text: '规格2',
                                        },
                                    ];
                                    this.add.data.goods_info = '';


                                }

                                if (res.res < 0) {
                                    this.$message({
                                        message: this.type == 'add' ? '添加失败！' : '保存失败',
                                        type: 'error'
                                    });
                                }

                            }
                        });
                        ajax.post();


                    },

                    querySearchAsync(queryString, cb) {

                        // var restaurants = this.restaurants;
                        // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                        console.log(queryString);

                        var ajax = new Ajax({
                            url: serverRootAdmin + 'depot/getList',
                            data: {
                                table: 'depot',
                                key: queryString,
                                key_where: 'depot_name|depot_id',
                            },
                            success: function (res) {

                                if (res.res == 1) {


                                    var list = [];

                                    for (var i = 0; i < res.msg.length; i++) {
                                        list.push({
                                            value: res.msg[i].depot_name,
                                            depot_id: res.msg[i].depot_id,
                                        })
                                    }
                                    cb(list);
                                }

                            }
                        });
                        ajax.get();



                    },
                    createStateFilter(queryString) {
                        return (state) => {
                            return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                        };
                    },
                    handleSelect(item) {


                        // this.add.data.depot.depot_name = item.value;
                        this.add.data.depot.depot_id = item.depot_id;
                    }


                },
                computed: {},

                watch: {
                    'head_img.url': function (val) {
                        // this.head_img._url = this.getUrl(val);
                    },

                }

            });
        })

    });

    //注册产品列表组件
    Vue.component('goods-list-comp', function (resolve, rejpagesect) {
        //获得组件的html代码
        getComponent('goods/goods-list', function (comp) {
            //注册组件的回调函数
            resolve({
                //设置组件的模板
                template: comp,
                //设置组件的属性
                props: {
                    showItem: Object,
                },
                //设置组件的data
                data: function () {
                    return {
                        conf: {
                            url: serverRootAdmin + 'goods/getList',
                            data: {
                                table: 'goods'
                            },
                            table: {
                                //数据
                                data: [],
                                //最大高度
                                maxHeight: 700,
                                //加载控制
                                loading: false,
                                //选中的项
                                selectList: [],
                                //标签分类
                                // type: [{ text: 'BUG', value: 'BUG' }, { text: 'UI', value: 'UI' }],
                                key: ''
                            },
                            page: {
                                //当前页数
                                currentPage: 1,
                                //每页显示条数
                                pageSize: 5,
                                //分页条数选择
                                pageSizes: [5, 10],
                                //总条数
                                total: 0,
                                disabled: false,

                            },

                        },
                        tool: {
                            //刷新
                            isRefreshLoading: false,
                            //搜索
                            isSearchLoading: false,
                        },
                        depotList: [
                            { text: '北京仓库', value: '1' },
                            { text: '上海仓库', value: '2' }
                        ],

                    }
                },
                methods: {
                    editItem: function (item, name) {

                        var data = {
                            table: 'goods',
                            id: item.goods_id,
                            save: {}
                        }
                        data.save[name] = item[name];

                        var ajax = new Ajax({
                            url: 'goods/save',
                            data: data,
                            success: (res) => {

                                if (res.res == 1) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                }
                                if (res.res < 0) {
                                    this.$message({
                                        message: '修改失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });

                        ajax.post();

                    },
                    getShowItem: function (name) {

                        if (!name) return true;

                        if (this.showItem == null) {
                            return true;
                        }

                        if (this.showItem[name] == null) {
                            return true;
                        }

                        if (this.showItem[name] === true) {
                            return true;
                        }

                        return false;

                    },
                    filterTag(value, row) {
                        return row.depot_id === value;
                    },
                    onLoadPage: function () {

                        //当前页   
                        this.conf.page.currentPage = localStorage[pagesName + '_tableCurrentPage'] ? parseInt(localStorage[pagesName + '_tableCurrentPage']) + 0 : 1;
                        //每页显示条数
                        this.conf.page.pageSize = localStorage[pagesName + '_tablePageSize'] ? parseInt(localStorage[pagesName + '_tablePageSize']) + 0 : 10;
                        //加载仓库
                        var ajax = new Ajax({
                            url: serverRootAdmin + 'depot/getList',
                            data: {
                                table: 'depot',
                            },
                            success: (res) => {
                                if (res.res == 1) {
                                    var list = [];
                                    for (let i = 0; i < res.msg.length; i++) {

                                        list.push({
                                            text: res.msg[i].depot_name,
                                            value: res.msg[i].depot_id,
                                        })

                                    }
                                    this.depotList = list;
                                }
                            }
                        });
                        ajax.get();
                    },
                    search: function () {
                        //搜索 
                        this.tool.isSearchLoading = true;
                        this.$refs['table'].refresh({

                            data: {
                                table: 'goods',
                                key_where: 'goods_id|goods_title',
                                key: this.conf.table.key
                            }

                        }, (res) => {

                            this.tool.isSearchLoading = false;

                            this.$message({
                                type: 'success',
                                message: `查找完成！找到了${res.count !== undefined ? res.count : 0}条数据`
                            });

                        });


                    },
                    refresh: function (isMsg) {
                        //刷新
                        this.$refs['table'].refresh(() => {

                            this.tool.isRefreshLoading = false;
                            if (isMsg) {
                                this.$message({
                                    type: 'success',
                                    message: typeof (isMsg) == 'string' ? isMsg : '表格已刷新~'
                                });
                            }

                        });

                    },
                    del: function (index, row) {

                        //删除单个
                        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            var ajax = {
                                url: serverRootAdmin + 'goods/del',
                                data: {
                                    id: row.goods_id,
                                    table: 'goods',
                                },
                                success: (res) => {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功~'
                                    });
                                },
                                error: (res) => {
                                    if (res === false) {
                                        this.$message({
                                            type: 'error',
                                            message: '删除接口出现错误！'
                                        });
                                        return false;
                                    }
                                    if (res.res == -1) {
                                        //删除失败
                                        this.$message({
                                            type: 'error',
                                            message: '删除失败！'
                                        });
                                    }
                                }
                            }
                            this.$refs['table'].del(index, row, ajax);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });

                    },
                    batchDeleting: function () {
                        serverRootAdmin
                        //批量删除 
                        if (this.conf.table.selectList.length <= 0) {
                            this.$message({
                                type: 'info',
                                message: '未选中任何项'
                            });
                            return false;
                        }
                        this.$confirm('此操作将永久删除选中的数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            //选中的
                            var list = this.conf.table.selectList;
                            //要删除的id数组
                            var ids = [];
                            for (let i = 0; i < list.length; i++) {
                                ids.push(list[i].goods_id);
                            }
                            this.$refs['table'].batchDeleting(null, {
                                url: serverRootAdmin + 'goods/dels',
                                data: {
                                    table: 'goods',
                                    ids: ids,
                                },
                                success: (res) => {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功~'
                                    });
                                },
                                error: (res) => {
                                    if (res === false) {
                                        this.$message({
                                            type: 'error',
                                            message: '删除接口出现错误！'
                                        });
                                        return false;
                                    }
                                    if (res.res == -1) {
                                        //删除失败
                                        this.$message({
                                            type: 'error',
                                            message: '删除失败！'
                                        });
                                    }
                                }
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });

                    },
                    add: function () {
                        this.$emit('add');
                    },
                    edit: function (index, row) {
                        this.$emit('edit', row, index)
                    },

                },
                computed: {},
                watch: {},
                mounted: function () {

                    this.$nextTick(_ => {
                        this.onLoadPage();
                    })
                }
            });
        })

    });

}
regComp();

//注册指令
function regBind() {

    showFocus = function (el, binding) {
        if (binding.value) {
            $(el).find('input').focus();
        }
    }

    Vue.directive('show-focus', {
        inserted: showFocus,
        componentUpdated: showFocus,
    })

    //编辑器指令
    Vue.directive('summernote', {
        inserted: function (el, binding) {
            var sumName;
            var value;

            if (typeof (binding.value) == 'string') {
                sumName = binding.arg;
                value = binding.value;
            } else {
                sumName = binding.value.name;
                value = binding.value.value;
            }

            pageApp[sumName] = $(el).summernote({
                height: 1000,
            });
            pageApp[sumName].summernote('code', value);

            window[sumName] = pageApp[sumName];

        },
        update: function (el, binding) {
            var sumName;
            var value;

            if (typeof (binding.value) == 'string') {
                sumName = binding.arg;
                value = binding.value;
            } else {
                sumName = binding.value.name;
                value = binding.value.value;
            }
            window[sumName].summernote('code', value);

        }
    })

}
regBind();

//注册插件
function regPlugin() {
    var MyPlugin = {};
    MyPlugin.install = function (Vue, options) {
        //取得一个随机数
        Vue.prototype.$getRand = function () {
            return Math.random();
        }
        //取得一个地址
        Vue.prototype.$getUrl = function (url) {

            //取出index.php

            var _url


            if (url.indexOf('http') == -1) {
                _url = serverRoot + url;
            } else {
                _url = url;
            }

            _url = _url.replace('index.php/', '');
            return _url;
        }
    };
    Vue.use(MyPlugin);

}
regPlugin();