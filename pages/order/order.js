// @ts-nocheck
pages({
    data: {
        list: [],
    },

    methods: {
        onLoadPage: function () {

            var ajax1 = new Ajax({
                url: 'order/add',
                data: {
                    table: 'order',
                    add: {
                        user_id: 12138,
                    },
                    returnData: true,
                    field: '*'
                },
                success: (res) => {

                    this.list.push(res.msg);

                    var ajax2 = new Ajax({
                        url: 'order/add',
                        data: {
                            table: 'order_info',
                            add: {
                                order_id: res.msg.order_id,
                            }
                        },
                        success: function (res) {
                            console.log(res);
                        }
                    });

                }
            });
            for (let i = 0; i < 30; i++) {
            }

        }
    }
})