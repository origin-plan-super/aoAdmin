// @ts-nocheck
pages({
    data: {

        add: {
            isShow: false,
            item: null,
        },
        edit: {
            isShow: false,
            item: null,
        },
        list: {
            isShow: true,
        }

    },
    methods: {
        onLoadPage: function () {

        },
        editGoods: function (item, index) {

            this.edit.isShow = true;
            this.list.isShow = false;

            if (typeof (item.spec) == 'string') {
                item.spec = JSON.parse(item.spec);
                item.imglist = JSON.parse(item.imglist);
            }

            this.edit.item = item;
            this.$refs.editGoods.update();

        },
        addGoods: function () {
            this.add.isShow = true;
            this.list.isShow = false;
        },
        saveSuccess: function (res) {
            this.$refs.goodsList.refresh('保存成功~表格已刷新~');
            this.cancel();
        },
        addSuccess: function (res) {
            this.$refs.goodsList.refresh('添加成功~表格已刷新~');
            this.cancel();
        },
        cancel: function () {
            this.edit.isShow = false;
            this.add.isShow = false;
            this.list.isShow = true;
        }
    }
})