// @ts-nocheck
pages({
    data: {
        list: {
            isShow: true,
        },
        addComp: {
            isShow: false,
        },
        editComp: {
            isShow: false,
        },
    },
    methods: {
        add: function () {
            this.list.isShow = false;
            this.addComp.isShow = true;
        },
        edit: function (item, index) {

            this.editComp.isShow = true;
            this.list.isShow = false;

            setTimeout(() => {
                var is = true;
                while (is) {
                    if (this.$refs.editDealer != null) {
                        is = false;
                        this.$refs.editDealer.setData(item);
                        return false;
                    }
                }

            }, 1);

        },
        addSuccess: function (res) {
            this.$refs.dealerList.refresh(false);
            this.cancel();
        },
        editSuccess: function (res) {
            this.$refs.dealerList.refresh(false);
            this.cancel();
        },
        cancel: function () {
            this.list.isShow = true;
            this.editComp.isShow = false;
            this.addComp.isShow = false;
        }

    },
});