// @ts-nocheck
//注册经销商组件
Vue.component('dealer-comp', function (resolve, rejpagesect) {
    //获得组件的html代码
    getComponent('dealer/dealer', function (comp) {
        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            props: ['type', 'title'],
            //设置组件的data
            data: function () {
                return {
                    dealer: {
                        data: {
                            user_name: '',
                            user_id: '',
                            user_type: '经销商'
                        }
                    },
                    goods: {
                        isShow: true,
                    },

                }
            },
            methods: {
                update: function (item) {

                    this.$nextTick(_ => {

                        if (item == null) {
                            item = this.item;
                        }
                        this.builderlist(item);

                    })

                },
                setData: function (data) {
                    this.$nextTick(_ => {
                        this.dealer.data = data;
                        setTimeout(() => {
                            if (this.goods.isShow) {
                                this.$refs['dealer-goods'].refresh();

                            }
                        }, 100);

                    })
                },
                onSubmit: function () {
                    var url;
                    var data = {};
                    data.table = 'user';
                    if (this.type == 'add' || this.type == null) {
                        url = serverRootAdmin + 'dealer/add';
                        data.add = this.dealer.data;
                        // data.add.user_id = this.dealer.data.user_phone;
                        this.type = 'add';
                    }
                    if (this.type == 'edit') {
                        url = serverRootAdmin + 'dealer/save';
                        data.id = this.dealer.data.user_id;
                        data.save = this.dealer.data;
                    }
                    var ajax = new Ajax({
                        url: url,
                        data: data,
                        success: (res) => {
                            console.log(res);

                            if (res.res == 1) {
                                this.$message({
                                    type: 'success',
                                    message: this.type == 'add' ? '添加成功！' : '保存成功',
                                });
                                this.$emit('on-success', res);
                            }
                            if (res.res < 0) {
                                this.$message({
                                    type: 'error',
                                    message: this.type == 'add' ? '添加失败！' : '保存失败',
                                });
                            }
                        }
                    });
                    ajax.post();

                },
                cancel: function () {
                    this.$emit('cancel');
                }
            },
            computed: {},
            watch: {},
            mounted: function () {
                this.$nextTick(_ => {
                    if (this.onLoadPage) {
                        this.onLoadPage();
                    }
                })
            }
        });
    })
});


//注册经销商列表组件
Vue.component('dealer-list-comp', function (resolve, rejpagesect) {
    //获得组件的html代码
    getComponent('dealer/dealer-list', function (comp) {
        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            // props: ['type', 'title'],
            //设置组件的data
            data: function () {
                return {
                    conf: {
                        url: serverRootAdmin + 'dealer/getList',
                        data: {
                            table: 'user',
                            where: {
                                user_type: '经销商'
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


                }
            },
            methods: {
                onLoadPage: function () {
                    //当前页   
                    this.conf.page.currentPage = localStorage[pagesName + '_tableCurrentPage'] ? parseInt(localStorage[pagesName + '_tableCurrentPage']) + 0 : 1;
                    //每页显示条数
                    this.conf.page.pageSize = localStorage[pagesName + '_tablePageSize'] ? parseInt(localStorage[pagesName + '_tablePageSize']) + 0 : 10;

                },
                search: function () {
                    //搜索 
                    this.tool.isSearchLoading = true;
                    this.$refs['table'].refresh({

                        data: {
                            table: 'user',
                            key_where: 'dealer_id|dealer_name',
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
                            url: serverRootAdmin + 'dealer/del',
                            data: {
                                id: row.user_id,
                                table: 'user',
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
                            ids.push(list[i].user_id);
                        }
                        this.$refs['table'].batchDeleting(null, {
                            url: serverRootAdmin + 'dealer/dels',
                            data: {
                                table: 'user',
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
                filterTag(value, row) {
                    return row.type === value;
                },


            },
            computed: {},
            watch: {},
            mounted: function () {
                this.$nextTick(_ => {
                    if (this.onLoadPage) {
                        this.onLoadPage();
                    }
                })
            }
        });
    })
});


//注册经销商商品管理组件
Vue.component('dealer-goods-comp', function (resolve, rejpagesect) {
    //获得组件的html代码
    getComponent('dealer/dealer-goods', function (comp) {
        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            // props: ['type', 'title'],
            props: {
                userInfo: Object,
                title: String
            },
            //设置组件的data
            data: function () {
                return {
                    conf: {
                        url: serverRootAdmin + 'dealer/getGoodsList',
                        data: {
                            table: 'dealer_goods',
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
                    tableShowItem: {
                        add: false,
                        dels: false,
                        tool: false,
                        select: false,
                    },
                    tool: {
                        //刷新
                        isRefreshLoading: false,
                        //搜索
                        isSearchLoading: false,
                    },
                    edit: {
                        isShow: false,
                        item: {
                            money: 0
                        },
                    },
                }
            },
            methods: {
                //改价
                editGoods: function (item, index) {

                    var money = item.money;


                    var ajax = new Ajax({
                        url: 'dealer/saveGoods',
                        data: {
                            where: {
                                goods_id: item.goods_id,
                                user_id: this.userInfo.user_id,
                            },
                            save: {
                                money: money
                            }
                        },
                        success: (res) => {
                            console.log(res);

                            if (res.res == 1) {
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success',
                                });
                            }
                            if (res.res < 0) {
                                this.$message({
                                    message: '修改失败！',
                                    type: 'error',
                                });
                            }

                        },
                    });
                    ajax.get();

                },
                saveSuccess: function (res) {
                    this.$refs.goodsList.refresh('保存成功~表格已刷新~');
                    this.cancel();
                },
                cancel: function () {
                    this.edit.isShow = false;
                },
                addGoods: function (item, index) {
                    var add = item;

                    add.user_id = this.userInfo.user_id;

                    var ajax = new Ajax({
                        url: serverRootAdmin + 'dealer/addGoods',
                        data: {
                            add: item
                        },
                        success: (res) => {
                            if (res.res == 2) {
                                this.$message({
                                    message: '已经指派过了~',
                                    type: 'info'
                                })
                            }
                            if (res.res == 1) {
                                this.$message({
                                    message: '指派成功!',
                                    type: 'success'
                                });
                                this.refresh();
                            }
                            if (res.res < 0) {
                                this.$message({
                                    message: '指派失败!',
                                    type: 'error'
                                })
                            }
                        }
                    });
                    ajax.post();



                },
                onLoadPage: function () {
                    //当前页   
                    this.conf.page.currentPage = localStorage[pagesName + '_tableCurrentPage'] ? parseInt(localStorage[pagesName + '_tableCurrentPage']) + 0 : 1;
                    //每页显示条数
                    this.conf.page.pageSize = localStorage[pagesName + '_tablePageSize'] ? parseInt(localStorage[pagesName + '_tablePageSize']) + 0 : 10;


                    this.interval = setInterval(() => {
                        console.log(1);
                        if (this.userInfo) {
                            this.refresh();
                            clearInterval(this.interval);
                        }
                    }, 100)

                },
                search: function () {
                    //搜索 
                    this.tool.isSearchLoading = true;
                    this.$refs['table'].refresh({
                        data: {
                            table: 'dealer_goods',
                            key_where: 't1.goods_title',
                            key: this.conf.table.key,
                            where: {
                                't3.user_id': this.userInfo.user_id,
                            }
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
                    this.$refs['table'].refresh(
                        {
                            data: {
                                table: 'dealer_goods',
                                where: {
                                    't3.user_id': this.userInfo.user_id,
                                }
                            }
                        },
                        (res) => {
                            console.log(res);

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
                            url: serverRootAdmin + 'dealer/delGoods',
                            data: {
                                user_id: this.userInfo.user_id,
                                goods_id: row.goods_id,
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
                            ids.push(list[i].user_id);
                        }
                        this.$refs['table'].batchDeleting(null, {
                            url: serverRootAdmin + 'dealer/dels',
                            data: {
                                table: 'user',
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
                filterTag(value, row) {
                    return row.type === value;
                },
            },
            computed: {},
            watch: {},
            mounted: function () {
                this.$nextTick(_ => {
                    if (this.onLoadPage) {
                        this.onLoadPage();
                    }
                })
            }
        });
    })
});




