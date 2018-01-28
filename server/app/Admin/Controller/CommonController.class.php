<?php
/**
* +----------------------------------------------------------------------
* 创建日期：2017年11月17日
* +----------------------------------------------------------------------
* https：//github.com/ALNY-AC
* +----------------------------------------------------------------------
* 微信：AJS0314
* +----------------------------------------------------------------------
* QQ:1173197065
* +----------------------------------------------------------------------
* #####需要登录权限的继承本控制器#####
* @author 代码狮
*
*/
namespace Admin\Controller;
use Think\Controller;
class CommonController extends Controller {
    
    //ThinkPHP提供的构造方法
    public function _initialize() {
        
        //先判断是否有session
        $isSession = check(session('admin_id'));
        $res=[];
        
        if($isSession){
            //有本地session
            //判断session的密码是否正确
            $result= login('admin',session('admin_id'),session('admin_pwd'),false);
            
            if(!$result){
                //密码不正确
                $res['res']=-992;
                echo json_encode($res);
                exit;
            }
            
        }else{
            //没有本地session
            $res['res']=-991;
            echo json_encode($res);
            exit;
        }
        
    }
    
}