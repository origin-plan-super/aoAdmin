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
        
        $user_id=I('post.user_id','false');
        $user_pwd=I('post.user_pwd','false');
        $res=[];
        
        //验证账户密码
        //验证用户的账户需要多种类型的判断
        $result= login('user',$user_id,$user_pwd,false);
        
        if($result){
            
            //账户和密码正确
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
                $res['userInfo']=[];
                $res['userInfo']['user_name']=$result['user_name'];
            }else{
                //添加token的时候失败
                $res['res']=-2;
            }
            
        }else{
            //账户和密码不正确
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
        getCode();
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
    
}