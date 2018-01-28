<?php
namespace Admin\Controller;
use Think\Controller;
class OrderController extends CommonController {
    
    public function getList(){
        $conf=initGetList();
        
        $model=$conf['model'];
        $where=$conf['where'];
        
        $result=$model
        ->where($where)
        ->order('add_time desc,state desc,order_id desc')
        ->select();
        
        //=========判断=========
        if($result!==false && $result !== null){
            //总条数
            $res['count']=count($result);
            // $res['size']=;
            $size=0;
            
            //计算总大小
            
            foreach ($result as $key => $value) {
                $size+=$value['size'];
            }
            $res['size']=$size;
            
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
    * 删除
    */
    public function del(){
        
        $res=[];
        
        $delType=I('delType');
        
        if($delType==='1'){
            //字段隐藏
            $res=del(true,'is_recycle',1);
        }
        if($delType==='0'){
            //真实删除
            $res=del();
        }
        //删除文件
        //删除
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    
    /**
    * 批量删除
    */
    public function dels(){
        
        $delType=I('delType');
        $urls=[];
        if($delType==='1'){
            //字段隐藏
            $res=dels(true,'is_recycle',1);
        }
        if($delType==='0'){
            //真实删除
            $res=dels();
        }
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    /**
    * 添加一项
    */
    public function add(){
        
        
        
        $id=date('YmdHis',time()).rand(1000,9999);
        
        $res=add($id);
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
    }
    public function test(){
        
        M()->execute('truncate table `ao_order`');
        M()->execute('truncate table `ao_order_info`');
        echo '清空完成！';
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