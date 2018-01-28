<?php
namespace Admin\Controller;
use Think\Controller;
class FeedbackController extends CommonController{
    
    /**
    * 获得
    */
    public function getList(){
        
        $conf=initGetList();
        
        $model=$conf['model'];
        $where=$conf['where'];
        
        //生成数据
        $result=$model
        ->field('t1.*,t2.user_id,t2.user_name')
        ->table('ao_feedback as t1,ao_user as t2')
        ->order('t1.add_time desc')
        ->where('t1.user_id = t2.user_id')
        ->where($where)
        ->select();
        
        //=========判断=========
        if($result){
            //总条数
            $res['count']=count($result);
            
            $result=getPageList($conf,$result);
            $result=toTime($result);
            
            $res['res']=1;
            $res['msg']=$result;
            
        }else{
            $res['res']=-1;
        }
        //=========判断end=========
        
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    /**
    * 保存
    */
    public function save(){
        $res=save();
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    /**
    * 删除
    */
    public function del(){
        $res=del();
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    
    /**
    * 批量删除
    */
    public function dels(){
        $res=dels();
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    /**
    * 添加一项
    */
    public function add(){
        $res=add();
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    
}