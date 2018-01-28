// @ts-nocheck

var getList = function (fun) {

    var list = [];

    for (var i = 0; i < 20; i++) {

        var item = {
            feedback_id: `${i + 1}`,
            user_id: `user_${i + 1}`,
            add_time: '2018年1月19日17:42:20',
            user_name: '王小虎' + (i + 1),
            info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum deleniti voluptas error optio minima aut. Quae eaque animi distinctio molestias error similique quis architecto ab, quasi, quos ipsum corporis ut.',
            tag: i % 2 == 0 ? '家' : '公司'
        }
        list.push(item);
    }
    fun(list);

}

pages({
    data: {
        dialog: {
            info: {
                isShow: false,
                title: '',
                info: ''
            },
            userInfo: {
                isShow: false,
                title: '',
                user_id: '',
                user_name: '',
            },
            edit: {
                isShow: false,
                title: '',
                info: '',
                item: {},
                edit_item: {}
            },
            add: {
                isShow: false,
                title: '新增反馈详情',
                data: {
                    user_id: '',
                    info: '',
                    type: ''
                },
                count: 0,
                maxCount: 255,
            }
        },
        rules: {
            type: [
                { required: true, message: '请选择类别！', trigger: 'change' },
            ],
            user_id: [
                { required: true, message: '请输入用户ID！', trigger: 'change' },
            ],
            info: [
                { required: true, message: '请输入反馈详情！', trigger: 'change' },
                { min: 0, max: 255, message: '长度在255以内！', trigger: 'change' }
            ],
        },
        tool: {
            //刷新
            isRefreshLoading: false,
            //搜索
            isSearchLoading: false,
        },
        conf: {
            url: serverRootAdmin + 'feedback/getList',
            data: {
                table: 'feedback'
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
                type: [{ text: 'BUG', value: 'BUG' }, { text: 'UI', value: 'UI' }],
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

        }
    },
    methods: {

        onLoadPage: function () {
            //当前页   
            this.conf.page.currentPage = localStorage[pagesName + '_tableCurrentPage'] ? parseInt(localStorage[pagesName + '_tableCurrentPage']) + 0 : 1;
            //每页显示条数
            this.conf.page.pageSize = localStorage[pagesName + '_tablePageSize'] ? parseInt(localStorage[pagesName + '_tablePageSize']) + 0 : 10;

        },
        show: function (index, row) {
            //显示反馈信息

            var dialog = this.dialog.info;
            dialog.info = row.info;
            dialog.title = row.user_name + ' 的 反馈详情';
            dialog.isShow = true;

        },
        edit: function (index, row) {
            //编辑
            var dialog = this.dialog.edit;
            dialog.item = row;
            dialog.edit_item = $.extend({}, row);
            dialog.title = '编辑';
            dialog.isShow = true;

        },
        save: function (edit_item, item) {
            //保存
            //初始化ajax数据
            var url = serverRootAdmin + 'feedback/save';
            var obj = {
                id: edit_item.feedback_id,
                table: 'feedback',
                save: {
                    info: edit_item.info
                }
            };
            var fun = (res) => {
                try {
                    res = JSON.parse(res);
                } catch (error) {
                    //接口错误
                    this.$message({
                        type: 'error',
                        message: '保存接口出现错误!'
                    });
                    console.error('保存接口出现错误');
                    return;
                }
                if (res.res == 1) {
                    for (var x in item) {
                        item[x] = edit_item[x];
                    }
                    this.$message({
                        type: 'success',
                        message: '保存成功！!'
                    });
                }
                if (res.res == -1) {
                    this.$message({
                        type: 'error',
                        message: '保存失败!'
                    });
                }
            };
            //初始化ajax数据 end
            this.$confirm('确定修改此条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确定
                $.post(url, obj, fun);
            }).catch(() => {
                //取消
            });
        },
        showUser: function (index, row) {
            //显示用户信息
            var dialog = this.dialog.userInfo;
            dialog.user_id = row.user_id;
            dialog.user_name = row.user_name;
            dialog.title = '用户 ' + row.user_name + ' 的 信息';
            dialog.isShow = true;

        },
        refresh: function () {
            //刷新
            this.$refs['table'].refresh(() => {

                this.tool.isRefreshLoading = false;
                this.$message({
                    type: 'success',
                    message: '表格已刷新~'
                });

            });

        },
        search: function () {
            //搜索 
            this.tool.isSearchLoading = true;
            this.$refs['table'].refresh({

                data: {
                    key_where: 't1.feedback_id|t2.user_id|t2.user_name',
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
        del: function (index, row) {

            //删除单个
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var ajax = {
                    url: serverRootAdmin + 'feedback/del',
                    data: {
                        id: row.feedback_id,
                        table: 'feedback',
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
                    ids.push(list[i].feedback_id);
                }
                this.$refs['table'].batchDeleting(null, {
                    url: serverRootAdmin + 'feedback/dels',
                    data: {
                        table: 'feedback',
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
        /**
         * 新增
         */
        add: function (data) {
            serverRootAdmin
            serverRootAdmin
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    //验证没有问题
                    //添加数据
                    var ajax = new Ajax({
                        url: serverRootAdmin + 'feedback/add',
                        data: {
                            table: 'feedback',
                            add: data,
                            idType: 'auto'
                        },
                        success: (res) => {
                            if (res.res == 1) {

                                if (this._notify != null) {
                                    // this._notify.close();
                                }
                                this._notify = this.$notify({
                                    title: '成功',
                                    message: '数据添加成功',
                                    type: 'success'
                                });
                                this.refresh();
                                //重置表单
                                this.$refs['addForm'].resetFields();
                                this.dialog.add.isShow = false;

                            }
                            if (res.res == -1) {
                                this.$message({
                                    type: 'error',
                                    message: '添加失败！'
                                });
                            }
                        }
                    });

                    ajax.post();

                } else {
                    //表单不正确
                    return false;
                }
            });

        },
        getRand: function () {
            return Math.random();
        },
        filterTag(value, row) {
            return row.type === value;
        },
        resetFields: function (name) {
            this.$refs[name].resetFields();
        }


    },
    watch: {
        'dialog.add.data.info': function (val) {
            this.dialog.add.count = val.length;
        }
    }
})