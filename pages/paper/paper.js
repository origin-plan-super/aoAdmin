// @ts-nocheck

Vue.component('img-list-comp', function (resolve, reject) {
    //获得组件的html代码
    getComponent('img-list-comp/img-list-comp', function (comp) {

        //注册组件的回调函数
        resolve({
            //设置组件的模板
            template: comp,
            //设置组件的属性
            props: ['activeimg'],
            //设置组件的data
            data: function () {
                return {
                    //栏目列表，需要使用配置文件获得
                    loading: true,
                    list: [],
                    page: {
                        //当前页
                        indexPage: 1,
                        //总条数
                        total: 0,
                        sizes: [8, 16],
                        size: 8,
                    },

                }
            },
            methods: {

                builderlist: function (list) {

                    for (let i = 0; i < list.length; i++) {
                        list[i].isActive = false;
                        list[i].isLoading = true;
                        list[i].isError = false;
                    }
                    return list;
                },

                refresh: function () {

                    this.loading = true;
                    var data = {};
                    data.page = this.page.indexPage;
                    //每页显示条数
                    data.limit = this.page.size;
                    data.table = 'assets';
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
                open: function (key, keyPath) {
                },

                setActive: function () {
                },
                handleSizeChange: function (val) {
                    // 每页显示数量被改变
                    this.page.size = val;
                    this.refresh();
                },
                handleCurrentChange: function (val) {
                    // 当前页被改变
                    this.page.indexPage = val;
                    this.refresh();
                },
                getImg: function (index, item, img) {

                    if (img.indexOf('http') == -1) {
                        return serverRoot + img;
                    } else {
                        return img;
                    }

                },

                setActive: function (index, item, list) {
                    // 设置选中
                    for (let i = 0; i < list.length; i++) {
                        list[i].isActive = false;
                    }

                    item.isActive = true;

                    this.activeimg = this.getImg(null, null, item.url);

                    this.$emit('update:activeimg', this.activeimg);

                },
            },
            computed: {
                init: function () {
                    this.refresh();
                }
            }
        });

    })

});


pages({
    data: {

        edit: {
            isShow: false,
            item: {},
            item_: {},
            title: '编辑'
        },
        addDialog: {
            isShow: false,
            item: {},
            item_: {},
            title: '新增图文消息',
            data: {},
        },
        page: {
            //当前页
            indexPage: 1,
            //总条数
            total: 0,
            sizes: [8, 16, 24],
            size: 8,
        },
        paper: {
            list: [],
            select: [],
            types: [
                '新闻详情',
                '新品推荐',
            ]
        },
        addsum: null,
        editSum: null,

    },
    methods: {
        /**
    * 每页显示数量被改变
    */
        openDialog: function (dialog, refName) {

            setTimeout(() => {
                if (this.$refs[refName] != null) {
                    this.$refs[refName].refresh();
                }
            }, 400);

        },
        onLoadPage: function () {

            //当前页   
            this.page.indexPage = localStorage[pagesName + '_page_index'] ? parseInt(localStorage[pagesName + '_page_index']) + 0 : 1;
            //每页显示条数
            this.page.size = localStorage[pagesName + '_page_size'] ? parseInt(localStorage[pagesName + '_page_size']) + 0 : 12;

            this.refresh();


            this.$nextTick(() => {

                setTimeout(() => {

                    // this.$refs["imgList"].refresh();

                }, 100);
            })

        },
        //大小被改变
        handleSizeChange: function (val) {
            this.page.size = val;
            localStorage[pagesName + '_page_size'] = this.page.size;
            this.refresh();
        },
        /**
         * 当前页被改变
         */
        handleCurrentChange: function (val) {
            this.page.indexPage = val;
            localStorage[pagesName + '_page_index'] = this.page.indexPage;
            this.refresh();
        },
        builderlist: function (list) {

            for (let i = 0; i < list.length; i++) {
                list[i].isActive = false;
                list[i].isError = false;
            }

            return list;
        },
        refresh: function () {


            var data = {};
            //当前页数
            data.page = this.page.indexPage;
            //每页显示条数
            data.limit = this.page.size;
            data.table = 'paper';

            var ajax = new Ajax({
                url: "paper/getList",
                data: data,
                success: (res) => {
                    this.page.total = res.count;
                    this.paper.list = this.builderlist(res.msg);
                }
            });
            ajax.get();



        },

        /**
       * 设置选中
       */
        setActive: function (index, item, list) {
            item.isActive = !item.isActive;

            if (item.isActive) {
                this.paper.select.push(item);
            } else {
                var indexOf = this.paper.select.indexOf(item);
                this.paper.select.splice(indexOf, 1);
            }

        },
        show: function (index, item, list) {

            this.edit.item = item;
            this.edit.item_ = $.extend({}, item);
            if (this.editsum) {
                this.editsum.summernote('code', this.edit.item_.paper_content);
            }

            this.edit.isShow = true;

        },
        save: function (item, item_) {
            item_.paper_content = this.editsum.summernote('code');

            var save = {
                paper_title: item_.paper_title,
                paper_content: item_.paper_content,
                paper_info: item_.paper_info,
                head_img: item_.head_img,
                paper_type: item_.paper_type,
            }

            var ajax = new Ajax({
                url: serverRootAdmin + 'paper/save',
                data: {
                    table: 'paper',
                    id: item.paper_id,
                    save: save,
                },
                success: (res) => {

                    if (res.res == 1) {

                        this.edit.isShow = false;
                        this.editsum.summernote('code', '');
                        extend(item, item_);

                        this.$message({
                            type: 'success',
                            message: '保存成功！'
                        });
                    }

                    if (res.rse < 0) {
                        this.$message({
                            type: 'error',
                            message: '保存失败！'
                        });
                    }

                }
            });
            ajax.post();

        },

        del: function (index, item, list) {

            this.$confirm('确定删除此文章？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //删除ajax
                var ajax = new Ajax({
                    url: 'paper/del',
                    data: {
                        id: item.paper_id,
                        table: 'paper',
                    },
                    success: (res) => {

                        if (res.res == 1) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            list.splice(index, 1);

                            this.page.total--;

                            if (dialog) {
                                dialog.isShow = false;
                            }

                        }
                        if (res.res <= 0) {

                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            });

                        }

                    }
                });
                ajax.post();


            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },
        dels: function () {

            if (this.paper.select.length <= 0) {
                this.$message({
                    type: 'info',
                    message: '没有文件被选中'
                });
                return;
            }
            this.$confirm('确定删除这些文章吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                //删除循环
                var delList = this.paper.select;
                var list = this.paper.list;
                var arr = [];
                var is = true;
                var ids = [];

                for (var i = 0; i < list.length; i++) {
                    is = true;
                    for (var j = 0; j < delList.length; j++) {
                        if (list[i].paper_id === delList[j].paper_id) {
                            is = false;
                            continue;
                        }
                    }
                    if (is) {
                        arr.push(list[i]);
                    } else {
                        ids.push(list[i].paper_id);
                    }
                }


                //ajax请求
                var ajax = new Ajax({
                    url: 'paper/dels',
                    data: {
                        ids: ids,
                        table: 'paper',
                    },
                    success: (res) => {

                        if (res.res == 1) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.paper.list = arr;
                            this.paper.select = [];
                            this.page.total -= delList.length;
                        }

                        if (res.res < 0) {
                            this.$message({
                                type: 'error',
                                message: '删除失败'
                            });
                        }

                    }
                });

                ajax.post();


            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },

        add: function (data) {

            var paper_content = this.addsum.summernote('code');
            data.paper_content = paper_content;

            var ajax = new Ajax({
                url: serverRootAdmin + 'paper/add',
                data: {
                    table: 'paper',
                    add: data,
                },
                success: (res) => {

                    if (res.res == 1) {

                        this.addDialog.isShow = false;
                        this.addDialog.data = {

                            paper_title: '',
                            paper_info: '',
                            paper_content: '',

                        };
                        this.addsum.summernote('code', '');

                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.refresh();
                    }

                    if (res.rse < 0) {
                        this.$message({
                            type: 'error',
                            message: '添加失败!'
                        });
                    }



                }
            });
            ajax.post();

        },
        getImg: function (index, item, img) {

            if (img.indexOf('http') == -1) {
                return serverRoot + img;
            } else {
                return img;
            }


        },

        push: function (item, index) {
            var ispush = item.is_push == 1 ? 0 : 1;

            var save = {
                is_push: ispush,
            }

            var ajax = new Ajax({
                url: serverRootAdmin + 'paper/save',
                data: {
                    table: 'paper',
                    id: item.paper_id,
                    save: save,
                },
                success: (res) => {

                    if (res.res == 1) {
                        item.is_push = ispush;
                    }

                    if (res.rse < 0) {
                        this.$message({
                            type: 'error',
                            message: '操作失败'
                        });
                    }

                }
            });
            ajax.post();

        },
        pushs: function () {

            var list = this.paper.select;

            setTimeout(() => {


            }, 1000);

            for (let i = 0; i < list.length; i++) {
                this.push(list[i]);
            }

        }
    },


})