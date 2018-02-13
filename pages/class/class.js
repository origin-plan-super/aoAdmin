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

    },
    mounted: function () {
        this.$nextTick(_ => {
            if (this.onLoadPage) {
                this.onLoadPage();
            }
        })
    }
});