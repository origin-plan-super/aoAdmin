// @ts-nocheck
//注册仓库列表组件
Vue.component('depot-list-comp', function (resolve, rejpagesect) {
    //获得组件的html代码
    getComponent('depot/depot-list', function (comp) {
        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            // props: ['edit'],
            //设置组件的data
            data: function () {
                return {
                    conf: {
                        url: serverRootAdmin + 'depot/getList',
                        data: {
                            table: 'depot'
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
                            table: 'depot',
                            key_where: 'depot_id|depot_name',
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
                            url: serverRootAdmin + 'depot/del',
                            data: {
                                id: row.depot_id,
                                table: 'depot',
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
                            ids.push(list[i].depot_id);
                        }
                        this.$refs['table'].batchDeleting(null, {
                            url: serverRootAdmin + 'depot/dels',
                            data: {
                                table: 'depot',
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
                    this.onLoadPage();
                })
            }
        });
    })

});
//注册添加仓库组件
Vue.component('depot-comp', function (resolve, rejpagesect) {
    //获得组件的html代码
    getComponent('depot/depot', function (comp) {
        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            props: ['type', 'title'],
            //设置组件的data
            data: function () {
                return {
                    depot: {
                        data: {
                            depot_name: ''
                        }
                    }
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
                        this.depot.data = data;
                    })
                },
                onSubmit: function () {
                    var url;
                    var data = {};
                    data.table = 'depot';

                    if (this.type == 'add' || this.type == null) {
                        url = serverRootAdmin + 'depot/add';
                        data.add = this.depot.data;
                        this.type = 'add';
                    }

                    if (this.type == 'edit') {
                        url = serverRootAdmin + 'depot/save';
                        data.id = this.depot.data.depot_id;
                        data.save = this.depot.data;
                    }

                    var ajax = new Ajax({
                        url: url,
                        data: data,
                        success: (res) => {
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

