<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    
    public function index(){
        
        echo '<h1>CTOS检测中心</h1>';
        dump(session());
        dump(F());
        
    }
    
    public function get(){
        
        $res['res']=1;
        $res['get']=I('get.');
        $res['post']=I('post.');
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    public function test(){
        echo '<h1>CTOS控制中心</h1>';
        die;
        $model=M('feedback');
        
        $data=$model->select();
        
        for ($i=0; $i < count($data); $i++) {
            $where=[];
            $save['info']='lorem '.($i+1);
            $where['feedback_id']=$data[$i]['feedback_id'];
            $model->where($where)->save($save);
            dump($model->_sql());
        }
        
    }
    
    public function login(){
        
        $user_id=I('post.user_id');
        $user_pwd=I('post.user_pwd');
        $user_code=I('post.user_code');
        $isLogin=false;
        $res=[];
        
        if($user_code){
            
            //验证码登录
            $user_code=md5($user_id.$user_code.__KEY__);
            
            $where=[];
            $where['user_id']=$user_id;
            $model=M('user_code');
            $result=$model->where($where)->find();
            //取出后立刻删除
            $model->where($where)->delete();
            
            if($result['user_code']===$user_code){
                //验证码正确，开始添加token
                $isLogin=true;
            }else{
                $res['msg']="验证码错误！";
            }
            
        }
        
        if($user_pwd){
            //账号密码登录
            //验证账户密码
            //验证用户的账户需要多种类型的判断
            //验证用户名和密码是否匹配
            $result= login('user',$user_id,$user_pwd,true);
            if($result){
                //账户和密码正确
                $isLogin=true;
            }else{
                $res['msg']="账号或密码错误！";
            }
        }
        //不管哪样登录，都添加token
        
        if($isLogin){
            //换取token
            $token=md5($user_id.time().rand());
            $model=M('token');
            $add['user_id']=$user_id;
            $add['token']=$token;
            $add['add_time']=time();
            $add['edit_time']=time();
            $tokenResult=$model->add($add,null,true);
            
            if($tokenResult!==false){
                $res['res']=1;
                $res['token']=$token;
                $res['user_id']=$user_id;
            }else{
                //添加token的时候失败
            }
            
        }else{
            //登录失败
            $res['res']=-1;
        }
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    
    /**
    * 获得验证码
    */
    public function getCode(){
        
        $user_id=I('user_id');
        
        $model=M('user_code');
        $code=rand(1000,9999)."";
        $md5Code=md5($user_id.$code.__KEY__);
        $add=[];
        $add['user_code']=$md5Code;
        $add['user_id']=$user_id;
        $add['add_time']=time();
        
        $result=$model->add($add,null,true);
        
        if($result){
            $res['res']=1;
            $res['msg']=$code;
            $res['add']=$add;
        }else{
            $res['res']=-1;
            $res['msg']=$result;
        }
        
        echo json_encode($res);
        
    }
    
    public function reg(){
        
        $user_id=I('user_id');
        //检查是否已经注册
        $model=M('user');
        $where=[];
        $where['user_id']=$user_id;
        if($model->where()->find()==null){
            //未注册
            
            $user_code=I('user_code');
            $user_code=md5($user_id.$user_code.__KEY__);
            
            $where=[];
            $where['user_id']=$user_id;
            $model=M('user_code');
            $result=$model->where($where)->find();
            //取出后立刻删除
            $model->where($where)->delete();
            
            if($result['user_code']===$user_code){
                //验证码正确
                //生成用户
                $user_count=$model->count();
                $model=M('user');
                $add=[];
                $add['user_id']=$user_id;
                $add['user_phone']=$user_id;
                $add['level']=1;
                $add['user_name']='用户'.$user_count.rand(1000,9999);
                $add['user_type']='经销商';
                $add['add_time']=time();
                $add['edit_time']=time();
                $result=$model->add($add);
                //=========判断=========
                if($result){
                    $res['res']=1;
                    $res['msg']=$add;
                }else{
                    $res['res']=-1;
                    $res['msg']=$result;
                }
                //=========判断end=========
                
            }else{
                //验证码不正确
                $res['res']=-2;
            }
            
        }else{
            //已经注册
            $res['res']=-3;
        }
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    
    /**
    * 判断是否登录
    */
    public function islogin(){
        
        $is=isUserLogin();
        
        if($is==1){
            //登录成功，继续操作
            $res['res']=$is;
            $res['msg']='登录成功！';
            //=========输出json=========
            echo json_encode($res);
            //=========输出json=========
        }
        
        if($is==-991){
            //令牌过期了
            $res['res']=$is;
            $res['msg']='令牌过期了！';
            //=========输出json=========
            echo json_encode($res);
            //=========输出json=========
        }
        if($is==-992){
            //未登录
            $res['res']=$is;
            $res['msg']='未登录！';
            //=========输出json=========
            echo json_encode($res);
            //=========输出json=========
        }
        
        
    }
    public function sinOut(){
        session(null);
        $token=I('token');
        $user_id=I('user_id');
        $model=M('token');
        $where=[];
        $where['user_id']=$user_id;
        $where['token']=$token;
        $result= $model->where($where)->delete();
        if($result){
            $res['res']=$result;
            $res['msg']=$result;
        }else{
            $res['res']=-1;
            $res['msg']=$result;
        }
        echo json_encode($res);
    }
}