// @ts-nocheck

pages({

    data: {
        visible: false,
        isShowLoginForm: false,
        appName: "澳洲物流",
        code: '',
        adminInfo: {
            admin_id: '',
            admin_pwd: '',
            admin_code: '',
        },
        rules: {
            admin_id: [
                { required: true, message: '请输入登录账号！', trigger: 'change' },
            ],
            admin_pwd: [
                { required: true, message: '请输入密码', trigger: 'change' },
                { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'change' }
            ],
            admin_code: [
                { required: true, message: '请输入验证码', trigger: 'change' },
                { min: 4, max: 4, message: '验证码长度不正确', trigger: 'change' }
            ],
        },
        alertInfo: '',
        alertType: '',
        alertClosable: false,
        isShowAlert: false,
    },

    methods: {
        onLoadPage: function () {
            this.isShowLoginForm = true;
            this.getCode();
        },
        getCode: function () {
            this.code = serverRootAdmin + 'index/getCode/' + Math.random();
        },
        onSubmit(formName) {
            this.getCode();

            var _this = this;

            _this.isShowAlert = false;

            this.$refs[formName].validate(function (valid) {


                if (valid) {
                    //验证没有问题
                    $.post(serverRootAdmin + 'index/login', _this.adminInfo, function (res) {

                        res = JSON.parse(res);
                        _this.isShowAlert = true;

                        if (res.res == 1) {
                            //登录成功
                            _this.alertType = 'success';
                            _this.alertInfo = '登录成功~正在为您跳转';
                            setTimeout(function () {
                                window.location.href = '../../pages/goods/goods.html';
                            }, 500);

                        }
                        if (res.res == -1) {
                            //账户和密码不正确
                            _this.alertType = 'error';
                            _this.alertInfo = '账户或密码不正确';

                        }
                        if (res.res == -2) {
                            //验证码不正确
                            _this.alertType = 'error';
                            _this.alertInfo = '验证码错误';
                        }


                    })

                } else {
                    console.log('error submit!!');
                    return false;
                }

            });

        }
    }

})