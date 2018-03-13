<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends Controller {
    
    public function index(){
        
        echo '<h1>CTOS检测中心s</h1>';
        dump(session());
        dump(F());
        
    }
    
    public function get(){
        
        
    }
    
    public function test(){
        
        echo '<h1>CTOS控制中心</h1>';
        
        $model=M('user');
        $result=  $model->select();
        dump($result);
        // $model->execute('truncate table `ao_user`');
        echo '清空完成';
        
        die;
        $arr=[];
        for ($i=1; $i <=14; $i++) {
            $arr[$i]="test/$i.jpg";
        }
        
        $model=M('assets');
        $model->execute('truncate table `ao_assets`');
        
        $list=[];
        for ($i=0; $i < 50; $i++) {
            
            $rand=rand(1,14);
            
            $item=[];
            $item['name']='文件'.$i;
            $item['url']=$arr[$rand];
            $item['add_time']=time();
            $item['edit_time']=time();
            
            $type='img';
            
            
            if($i % 2 ==0){
                $type='video';
            }
            
            if($i % 3 ==0){
                $type='audio';
            }
            
            $item['type']=$type;
            $item['size']=$i+1*10;
            
            $tag=[];
            $tag[]='图片';
            
            $item['tag']=json_encode($tag);
            $item['assets_id']=date('YmdHis',time()).rand(1000,9999);
            // $model->add($item);
            
        }
        
        $result=$model->select();
        dump($result);
        
    }
    
    public function login(){
        
        $admin_code=I('post.admin_code','false');
        $admin_pwd=I('post.admin_pwd','false');
        $admin_id=I('post.admin_id','false');
        $res=[];
        
        if(isCode($admin_code)){
            //正确
            //验证账户密码
            $result= login('admin',$admin_id,$admin_pwd);
            if($result){
                //账户和密码正确
                //留存用户信息
                session('admin_id',$admin_id);
                session('admin_name',$result['admin_name']);
                session('admin_head_img',$result['admin_head_img']);
                session('admin_pwd',$result['admin_pwd']);
                
                $res['res']=1;
                
            }else{
                //账户和密码不正确
                $res['res']=-1;
            }
            
        }else{
            //验证码不正确
            $res['res']=-2;
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
        
        //先判断是否有session
        $isSession = check(session('admin_id'));
        $res=[];
        
        if($isSession){
            //有本地session
            //判断session的密码是否正确
            $result= login('admin',session('admin_id'),session('admin_pwd'),false);
            
            if($result){
                //密码正确
                $res['res']=1;
                
            }else{
                //密码不正确
                $res['res']=-2;
            }
            
            
        }else{
            //没有本地session
            $res['res']=-1;
        }
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    public function sinOut(){
        session(null);
        // $token=I('token');
        // $admin_id=I('admin_id');
        // $model=M('admin');
        // $where['admin_id']=$admin_id;
        // $save['token']='';
        // $result=$model->where($where)->save($save);
        // //=========判断=========
        // if($result){
        //     $res['res']=$result;
        //     $res['msg']=$result;
        // }else{
        //     $res['res']=-1;
        //     $res['msg']=$result;
        // }
        // //=========判断end=========
        // //=========输出json=========
        // echo json_encode($res);
        // //=========输出json=========
    }
    
}