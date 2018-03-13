<?php
return array(
/* 数据库设置 */
'DB_TYPE' => 'mysql', // 数据库类型
'DB_HOST' => '127.0.0.1', // 服务器地址
'DB_NAME' => 'ao', // 数据库名
'DB_USER' => 'root', // 用户名
'DB_PWD' => 'mysqlyh12138..', // 密码
'DB_PORT' => '3306', // 端口
'DB_PREFIX' => 'ao_', // 数据库表前缀,
//支付宝配置参数
'alipay'=>array(

// 'partner' =>'2088811669460032',   //这里是你在成功申请支付宝接口后获取到的PID；
// 'key'=>'wmml15pjbk8pd3su7jwwwpx94pfwsorc',//这里是你在成功申请支付宝接口后获取到的Key
// 'sign_type'=>strtoupper('MD5'),
// 'input_charset'=> strtolower('utf-8'),
// 'cacert'=> getcwd().'\\cacert.pem',
// 'transport'=> 'http',//访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http

//应用ID,您的APPID。
'app_id' => "2016032401239787",

//商户私钥，您的原始格式RSA私钥
'merchant_private_key' => "ln6kj3w8fff74vl1p77tidminf8swihq",

//异步通知地址
'notify_url' => "http://工程公网访问地址/alipay.trade.wap.pay-PHP-UTF-8/notify_url.php",

//同步跳转
'return_url' => "http://mitsein.com/alipay.trade.wap.pay-PHP-UTF-8/return_url.php",

//编码格式
'charset' => "UTF-8",

//签名方式
'sign_type'=>"RSA2",

//支付宝网关
'gatewayUrl' => "https://openapi.alipay.com/gateway.do",

//支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
'alipay_public_key' => "",

),

);