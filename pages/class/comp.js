// @ts-nocheck
//注册产品列表组件
Vue.component('class-list-comp', function (resolve, rejpagesect) {
    //获得组件的html代码
    getComponent('class/class-list', function (comp) {
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
                        url: serverRootAdmin + 'class/getList',
                        data: {
                            table: 'class'
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
                    addClass: {
                        title: ''
                    }

                }
            },
            methods: {
                editItem: function (item, name) {

                    var data = {
                        table: 'class',
                        id: item.class_id,
                        save: {}
                    }
                    data.save[name] = item[name];

                    var ajax = new Ajax({
                        url: 'class/save',
                        data: data,
                        success: (res) => {
                            console.log(res);

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
                onLoadPage: function () {
                    //当前页   
                    this.conf.page.currentPage = localStorage[pagesName + '_tableCurrentPage'] ? parseInt(localStorage[pagesName + '_tableCurrentPage']) + 0 : 1;
                    //每页显示条数
                    this.conf.page.pageSize = localStorage[pagesName + '_tablePageSize'] ? parseInt(localStorage[pagesName + '_tablePageSize']) + 0 : 10;
                    //加载仓库
                },
                search: function () {
                    //搜索 
                    this.tool.isSearchLoading = true;
                    this.$refs['table'].refresh({

                        data: {
                            table: 'class',
                            key_where: 'class_id|class_title',
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
                            url: serverRootAdmin + 'class/del',
                            data: {
                                id: row.class_id,
                                table: 'class',
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
                            ids.push(list[i].class_id);
                        }
                        this.$refs['table'].batchDeleting(null, {
                            url: serverRootAdmin + 'class/dels',
                            data: {
                                table: 'class',
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

                    if (this.addClass.title.length <= 0) {
                        this.$message({
                            type: 'warning',
                            message: '标题不能为空！'
                        });
                        return;
                    }

                    var ajax = new Ajax({
                        url: 'class/add',
                        data: {
                            table: 'class',
                            add: {
                                class_title: this.addClass.title
                            }
                        },
                        success: (res) => {

                            if (res.res == 1) {

                                this.$message({
                                    type: 'success',
                                    message: '添加成功！'
                                });
                                this.refresh();
                            }

                            if (res.res < 0) {
                                this.$message({
                                    type: 'error',
                                    message: '添加失败！'
                                });
                            }
                            this.addClass.title = '';
                        },
                    });
                    ajax.post();

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