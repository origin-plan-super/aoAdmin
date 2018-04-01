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
    public function setPwd(){
        
        $model=M('user');
        $user_pwd=I('user_pwd');
        $user_pwd2=I('user_pwd2');
        
        
        if($user_pwd!==$user_pwd2){
            //密码不对
            $res['res']=-3;
            echo json_encode($res);
            exit;
        }
        
        //密码正确继续
        $where['user_id']=session('user_id');
        $save=[];
        $save['user_pwd']=md5($user_pwd2.__KEY__);
        $result=$model->where($where)->save($save);
        
        if($result){
            $res['res']=$result;
            $res['msg']=$result;
        }else{
            $res['res']=-1;
            $res['msg']=$result;
        }
        
        echo json_encode($res);
        
    }
    
    
    public function getUserInfo(){
        
        $field=I('field')?I('field'):"user_id,user_name,user_phone,level,user_type,user_money,add_time";
        $model=M('user');
        $where=[];
        $where['user_id']=session('user_id');
        $result=$model
        ->where($where)
        ->field($field)
        ->find();
        if($result){
            $res['res']=1;
            $res['userInfo']=$result;
        }else{
            $res['res']=-1;
            $res['msg']=$result;
        }
        echo json_encode($res);
    }
}