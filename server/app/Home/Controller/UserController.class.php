<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends CommonController {
    
    public function setUserInfo(){
        
        
        
        $model=M('user');
        
        $save=I('save');
        $where['user_id']=session('user_id');
        $result=$model->where($where)->save($save);
        
        //=========判断=========
        if($result!==false){
            $res['res']=1;
            $res['msg']=$result;
        }else{
            $res['res']=-1;
            $res['msg']=$result;
        }
        //=========判断end=========
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
}