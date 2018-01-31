// @ts-nocheck
pages({
    data: {
        assets: {
            list: [],
            select: [],
            loading: false,
        },
        dialog: {
            file: {
                title: '查看文件',
                url: '',
                isShow: false,
                item: {},
                item_: {},
                index: 0,
                szie: 0
            },
            upload: {
                url: serverRootAdmin + 'use/upFile',
                img: {
                    title: '上传图片素材',
                    isShow: false,
                    accept: 'image/*',
                    data: {
                        type: 'img',
                        src: 'img/'
                    },
                    list: []
                },
                video: {
                    title: '上传视频素材',
                    isShow: false,
                    accept: 'video/*',
                    data: {
                        type: 'video',
                        src: 'video/'
                    },
                    list: []
                },
                audio: {
                    title: '上传音频素材',
                    isShow: false,
                    accept: 'audio/*',
                    data: {
                        type: 'audio',
                        src: 'audio/'
                    },
                    list: []
                }
            }
        },
        page: {
            //当前页
            indexPage: 1,
            //总条数
            total: 0,
            sizes: [8, 16, 24],
            size: 8,

        },

        conf: {
            refresh: {
                //是否找回收站的内容
                is_recycle: 0,
                //文件类型
                type: ''

            },

        },

    },


    methods: {

        onLoadPage: function () {

            //当前页   
            this.page.indexPage = localStorage[pagesName + '_page_index'] ? parseInt(localStorage[pagesName + '_page_index']) + 0 : 1;
            //每页显示条数
            this.page.size = localStorage[pagesName + '_page_size'] ? parseInt(localStorage[pagesName + '_page_size']) + 0 : 12;

            this.refresh(false);
        },
        /**
         * 构建图片列表
         */
        builderlist: function (list) {

            for (let i = 0; i < list.length; i++) {
                list[i].isActive = false;
                list[i].isLoading = true;
                list[i].isError = false;
            }

            return list;

        },
        /**
         * 显示单个
         */
        show: function (index, item, list) {


            this.dialog.file.item = item;
            this.dialog.file.item_ = $.extend({}, item);

            this.dialog.file.item_.size = (this.dialog.file.item_.size / 1024 / 1024).toFixed(2);

            this.dialog.file.index = index;
            this.dialog.file.isShow = true;

        },
        /**
         * 删除单个
         */
        del: function (index, item, list, dialog) {



            if (item.is_recycle == 0) {
                //字段隐藏
                delType = 1;
            }

            if (item.is_recycle == 1) {
                //真实删除
                delType = 0;
            }


            var title = '确定删除此文件？删除的文件将会被移入回收站。'
            if (item.is_recycle == 1) {
                //在回收站中
                title = '确定彻底删除此文件？';
            }
            this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //删除ajax
                var ajax = new Ajax({
                    url: 'assets/del',
                    data: {
                        id: item.assets_id,
                        table: 'assets',
                        delType: delType//字段隐藏
                    },
                    success: (res) => {

                        console.log(res);

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
        save: function (index, item, item_, dialog) {
            item.name = item_.name;
            // item.tag = item_.tag;
            item.type = item_.type;

            var ajax = new Ajax({
                url: 'assets/save',
                data: {
                    id: item.assets_id,
                    table: 'assets',
                    save: {
                        name: item_.name,
                    }
                },
                success: (res) => {
                    if (res.res == 1) {
                        this.$message({
                            type: 'success',
                            message: '保存成功！'
                        });
                        item.name = item_.name;
                    }
                    if (res.res < 0) {

                        this.$message({
                            type: 'error',
                            message: '保存失败！'
                        });
                    }

                }
            });
            ajax.post();

        },
        /**
         * 设置选中
         */
        setActive: function (index, item, list) {
            item.isActive = !item.isActive;

            if (item.isActive) {
                this.assets.select.push(item);
            } else {
                var indexOf = this.assets.select.indexOf(item);
                this.assets.select.splice(indexOf, 1);
            }

        },
        /**
         * 批量删除
         */
        dels: function () {

            if (this.assets.select.length <= 0) {
                this.$message({
                    type: 'info',
                    message: '没有文件被选中'
                });
                return;
            }

            var title = '确定删除这些文件吗？被删除的文件可以在回收站找回。';
            if (this.assets.select[0].is_recycle == 1) {
                //现在在回收站里面
                title = '确定彻底删除这些文件吗';
            }
            if (this.assets.select[0].is_recycle == 0) {
                //字段隐藏
                delType = 1;
            }

            if (this.assets.select[0].is_recycle == 1) {
                //真实删除
                delType = 0;
            }

            this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                //删除循环

                var delList = this.assets.select;
                var list = this.assets.list;
                var arr = [];

                var is = true;

                var ids = [];

                for (var i = 0; i < list.length; i++) {
                    is = true;
                    for (var j = 0; j < delList.length; j++) {
                        if (list[i].assets_id === delList[j].assets_id) {
                            is = false;
                            continue;
                        }
                    }
                    if (is) {
                        arr.push(list[i]);
                    } else {
                        ids.push(list[i].assets_id);
                    }
                }


                //ajax请求
                var ajax = new Ajax({
                    url: 'assets/dels',
                    data: {
                        ids: ids,
                        table: 'assets',
                        delType: delType//字段隐藏
                    },
                    success: (res) => {

                        if (res.res == 1) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.assets.list = arr;
                            this.assets.select = [];
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
        /**
         * 每页显示数量被改变
         */
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
        /**
         * 刷新
         */
        refresh: function (is_recycle, type) {

            if (is_recycle === false) {
                //重置搜索
                this.conf.refresh.is_recycle = 0;
                this.conf.refresh.type = '';
            } else {
                //设置条件
                if (is_recycle != null) {
                    this.conf.refresh.is_recycle = is_recycle;
                }
                if (type != null) {
                    this.conf.refresh.type = type;
                }

            }

            this.assets.loading = true;
            var data = {};
            //当前页数
            data.page = this.page.indexPage;
            //每页显示条数
            data.limit = this.page.size;
            data.table = 'assets';
            data.where = {
                is_recycle: this.conf.refresh.is_recycle != null ? this.conf.refresh.is_recycle : 0,
            };
            if (this.conf.refresh.type.length > 0) {
                data.where.type = this.conf.refresh.type;
            }

            var ajax = new Ajax({
                url: "assets/getList",
                data: data,
                success: (res) => {
                    this.page.total = res.count;
                    this.assets.list = this.builderlist(res.msg);
                    this.assets.size = (res.size / 1024 / 1024).toFixed(2);
                    this.assets.loading = false;
                }
            });
            ajax.get();
        },
        getImg: function (index, item) {
            console.error('请使用$getUrl！', index, item);
            return;
            if (index % 3 == 0) {
                // return '../../assets/ ' + item.url;
            }

            return serverRoot + item.url;
        },
        getUrl: function (url, item, index) {
            if (url != null) {



                if (url.indexOf('http') == -1) {

                    console.log(serverRoot + url);
                    return serverRoot + url;

                } else {
                    console.log(url);
                    return url;
                }
            }

        },
        removeRecycle: function (index, item, list) {
            this.assets.select = [];
            var ajax = new Ajax({
                url: 'assets/save',
                data: {
                    id: item.assets_id,
                    table: 'assets',
                    save: {
                        is_recycle: 0,
                    }
                },
                success: (res) => {
                    if (res.res == 1) {
                        this.$message({
                            type: 'success',
                            message: '移出成功'
                        });
                        list.splice(index, 1);
                    }

                    if (res.res < 0) {

                        this.$message({
                            type: 'error',
                            message: '移出失败'
                        });
                    }

                }
            });
            ajax.post();

        },
        upload: function (type, name) {
            this.$refs[name].submit();
        },
        uploadSuccess: function (resa, file, fileList) {

            var ajax = new Ajax({
                url: serverRootAdmin + 'assets/add',
                data: {
                    table: 'assets',
                    add: {
                        url: resa.msg.src,
                        type: resa.msg.data.type,
                        name: resa.msg.file.savename,
                        size: resa.msg.file.size
                    }
                },
                success: (res) => {

                    if (res.res == 1) {
                        this.$message({
                            type: 'success',
                            message: '上传成功！'
                        });

                        this.dialog.upload.img.isShow = false;
                        this.dialog.upload.audio.isShow = false;
                        this.dialog.upload.video.isShow = false;

                        this.refresh();

                        fileList.splice(fileList.indexOf(file), 1);

                    }
                    if (res.res < 0) {


                        this.$message({
                            type: 'error',
                            message: '上传失败！'
                        });
                    }

                }
            });

            ajax.post();


        },
        remove: function () {
            console.log('remove');

        }
    },


});