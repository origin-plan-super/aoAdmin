// @ts-nocheck
pages({
    data: {
        conf: {
            url: serverRootAdmin + 'order/getList',
            data: {
                table: 'order'
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
    }
})