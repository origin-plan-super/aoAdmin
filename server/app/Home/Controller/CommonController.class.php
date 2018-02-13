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
namespace Home\Controller;
use Think\Controller;
class CommonController extends Controller {
    
    //ThinkPHP提供的构造方法
    public function _initialize() {
        
        if(I('debug')){
            session('user_id','12138');
            session('is_debug',true);
            return;
        }
        
        $is=isUserLogin();
        
        if($is==1){
            $model=M('user');
            $where['user_id']=session('user_id');
            $user_info=$model->where($where)->find();
            session('user_info',$user_info);
            
            //登录成功，继续操作
        }
        if($is==-991){
            //令牌过期了
            $res['res']=$is;
            $res['msg']='令牌过期了';
            //=========输出json=========
            echo json_encode($res);
            //=========输出json=========
            exit;
        }
        if($is==-992){
            //未登录
            $res['res']=$is;
            $res['msg']='未登录';
            //=========输出json=========
            echo json_encode($res);
            //=========输出json=========
            exit;
        }
        
        
        
    }
    
}