<?php
namespace Admin\Controller;
use Think\Controller;
class ClassController extends Controller {
    
    public function getList(){
        $conf=initGetList();
        
        $model=$conf['model'];
        $where=$conf['where'];
        
        $result=$model
        ->where($where)
        ->order('add_time desc')
        ->select();
        
        //=========判断=========
        if($result!==false && $result !== null){
            //总条数
            $res['count']=count($result);
            
            
            $result=getPageList($conf,$result);
            $result=toTime($result);
            $res['res']=1;
            $res['msg']=$result;
            
            
        }else{
            $res['res']=0;
        }
        
        echo json_encode($res);
        
    }
    
    
    
    /**
    * 添加一项
    */
    public function add(){
        
        // $id='goods_'.rand();
        
        $res=add(false,'md5');
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    /**
    * 删除
    */
    public function del(){
        $res=[];
        
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
    * 保存
    */
    public function save(){
        $res=save();
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    
}