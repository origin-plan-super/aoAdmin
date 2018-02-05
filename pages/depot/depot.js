// @ts-nocheck
pages({
    data: {
        list: {
            isShow: true,
        },
        add: {
            isShow: false,
        },
        edit: {
            isShow: false,
        },

    },
    methods: {
        addDepot: function () {
            this.list.isShow = false;
            this.add.isShow = true;
        },
        editDepot: function (item, index) {


            this.edit.isShow = true;
            this.list.isShow = false;

            var intV = setInterval(() => {
                if (this.$refs.editDepot != null) {
                    this.$refs.editDepot.setData(item);
                    clearInterval(intV);
                }
            }, 200)


        },
        addSuccess: function (res) {
            this.$refs.depotList.refresh(false);
            this.cancel();
        },
        editSuccess: function (res) {
            this.$refs.depotList.refresh(false);
            this.cancel();
        },
        cancel: function () {
            this.list.isShow = true;
            this.edit.isShow = false;
            this.add.isShow = false;
        }

    }
})