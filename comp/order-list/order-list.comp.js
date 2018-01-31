// @ts-nocheck
Vue.component('order-list-comp', function (resolve, reject) {
    //获得组件的html代码
    getComponent('order-list/order-list', function (comp) {
        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            // props: [],
            //设置组件的data
            data: function () {
                return {
                    conf: {
                        url: 'order/getList',
                        data: {
                            table: 'order',
                            where: {
                                is_recycle: 0,
                            }
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
                    stateList: {
                        1: {
                            text: '等待支付',
                            type: 'info'
                        },
                        2: {
                            text: '已支付',
                            type: 'danger'
                        },
                        3: {
                            text: '已发货 / 待收货',
                            type: 'warning'
                        },
                        4: {
                            text: '已签收 / 完成',
                            type: 'success'
                        },
                        5: {
                            text: '退款 / 售后',
                            type: 'info'
                        }
                    },
                    stateListValidate: [
                        { text: '等待支付', value: 1 },
                        { text: '已支付', value: 2 },
                        { text: '已发货/待收货', value: 3 },
                        { text: '已签收/完成', value: 4 },
                        { text: '退款/售后', value: 5 },
                    ],
                    order: {

                    },
                    isShowInfo: false,
                }
            },
            methods: {
                onLoadPage: function () {
                    //当前页   
                    this.conf.page.currentPage = localStorage[pagesName + '_tableCurrentPage'] ? parseInt(localStorage[pagesName + '_tableCurrentPage']) + 0 : 1;
                    //每页显示条数
                    this.conf.page.pageSize = localStorage[pagesName + '_tablePageSize'] ? parseInt(localStorage[pagesName + '_tablePageSize']) + 0 : 10;
                },
                filterTag(value, row) {
                    return row.state == value;
                },
                getState: function (item) {

                    if (this.stateList[item.state] == null) {
                        return this.stateList[1];
                    }
                    return this.stateList[item.state];

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
                search: function () {
                    //搜索 
                    this.tool.isSearchLoading = true;

                    this.$refs['table'].refresh({
                        data: {
                            table: 'order',
                            where: {
                                is_recycle: 0,
                            },
                            key_where: 'order_id',
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
                    this.$refs['table'].refresh({
                        data: {
                            table: 'order',
                            where: {
                                is_recycle: 0,
                            },
                        }
                    }, () => {

                        this.tool.isRefreshLoading = false;
                        if (isMsg == null || isMsg === true) {
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
                            url: 'order/del',
                            data: {
                                id: row.order_id,
                                table: 'order',
                                delType: '1'
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
                            ids.push(list[i].order_id);
                        }
                        this.$refs['table'].batchDeleting(null, {
                            url: 'order/dels',
                            data: {
                                table: 'order',
                                ids: ids,
                                delType: '1'
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
                //去发货
                deliverGoods: function (row, index) {
                    console.log(row);
                    //让用户输入快递号
                    this.$prompt('请输入快递单号', '发货', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                    }).then((value) => {
                        //发货的ajax
                        value = value.value;
                        console.log(value);

                        var ajax = new Ajax({
                            url: 'order/deliverGoods',
                            data: {
                                courier_nmumber: value,
                                order_id: row.order_id,
                            },
                            success: (res) => {
                                console.log(res);

                                if (res.res == 1) {
                                    this.$message({
                                        message: '操作成功！',
                                        type: 'success',
                                    });
                                    //刷新表格
                                    this.refresh();

                                }
                                if (res.res < 0) {
                                    this.$message({
                                        message: '操作失败！',
                                        type: 'error',
                                    });
                                }

                            }
                        });
                        ajax.post();

                    }).catch(() => {

                        this.$message({
                            message: '发货已取消',
                            type: 'info',
                        });
                    });




                },
                show: function (row, index) {

                    var order_id = row.order_id;

                    if (this.order.order_id == order_id) {
                        //直接显示
                        this.isShowInfo = true;
                    } else {
                        //查询信息

                        var ajax = new Ajax({
                            url: 'order/getOrder',
                            data: {
                                order_id: order_id,
                            },
                            success: (res) => {


                                if (res.res == 1) {
                                    //成功
                                    this.order = res.msg;
                                    console.log(this.order);

                                    this.isShowInfo = true;
                                }
                                if (res.res < 0) {
                                    //查询失败
                                    this.$message({
                                        message: '订单查询失败！',
                                        type: 'error'
                                    })
                                }

                            }
                        });
                        ajax.get();
                    }


                }
            },
            watch: {},
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