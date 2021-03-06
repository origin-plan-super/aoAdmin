<?php
namespace Admin\Controller;
use Think\Controller;
class GoodsController extends Controller {
    
    public function getList(){
        $conf=initGetList();
        
        $model=$conf['model'];
        $where=$conf['where'];
        
        $result=$model
        ->where($where)
        ->order('goods_id desc,add_time desc')
        ->select();
        
        //=========判断=========
        if($result!==false && $result !== null){
            //总条数S
            
            $res['count']=count($result);
            
            $result=getPageList($conf,$result);
            $result=toTime($result);
            $result=toHtml($result,'depot_list');
            $result=toHtml($result,'level_list');
            $result=toHtml($result,'goods_info');
            $result=toHtml($result,'imglist');
            $result=toHtml($result,'spec');
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
        
        $res=add(false,'auto');
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    /**
    * 删除
    */
    public function del(){
        $res=[];
        
        $delType=I('delType',null);
        
        if($delType==='1'){
            //字段隐藏
            $res=del(true,'is_recycle',1);
        }
        if($delType==='0'){
            //真实删除
            $res=del();
        }
        
        if($delType === null ){
            //真实删除
            $res=del();
        }
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    
    /**
    * 批量删除
    */
    public function dels(){
        
        $delType=I('delType',null);
        $res=I();
        if($delType==='1'){
            //字段隐藏
            $res=dels(true,'is_recycle',1);
            
        }
        if($delType==='0'){
            //真实删除
            $res=dels();
        }
        
        if($delType === null ){
            //真实删除
            $res=dels();
        }
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