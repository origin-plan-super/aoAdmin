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
            $result=getPageList($conf,$result);
            $result=toTime($result);
            
            
            //获得订单们的总价
            foreach ($result as $key => $value) {
                
                $orderInfo=getOrderInfo($value['order_id']);
                $money=getOrderMoney($orderInfo);
                $result[$key]['money']=$money;
                
            }
            
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
        
        // M()->execute('truncate table `ao_order`');
        // M()->execute('truncate table `ao_order_info`');
        // echo '清空完成！';
        // array_map_recursive
        $w=[];
        $w[1]='1';
        $w=json_encode($w);
        $w=htmlspecialchars($w);
        dump($w);
        
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
    
    public function deliverGoods(){
        //向订单信息中追加物流单号
        
        
        //订单号和快递单号
        $order_id= I('order_id');
        $courier_nmumber= I('courier_nmumber');
        
        $model=M('order_info');
        $where=[];
        $where['order_id']=$order_id;
        $result=$model->where($where)->find();
        $order_info=$result['order_info'];
        
        $order_info=html($order_info);
        $order_info=json_decode($order_info,true);
        $order_info['courier_nmumber']=$courier_nmumber;
        $order_info=json_encode($order_info);
        $order_info=htmlspecialchars($order_info);
        //开始追加
        $save['order_info']=$order_info;
        //保存
        $result = $model->where($where)->save($save);
        
        if($rseult!==false){
            //开始修改订单状态
            $model=M('order');
            $save=[];
            $save['state']=3;
            $result=$order=$model->where($where)->save($save);
            //=========判断=========
            if($result){
                $res['res']=1;
                $res['msg']=$result;
            }else{
                $res['res']=-1;
                $res['msg']=$result;
            }
            //=========判断end=========
        }
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
        
        
    }
    //获取一个订单的信息
    public function getOrder(){
        
        $model=M();
        $where=[];
        $where['t1.order_id']=I('order_id');
        $result=$model
        ->table('ao_order as t1,ao_order_info as t2')
        ->field('t1.*,t2.*')
        ->where('t1.order_id = t2.order_id')
        ->where($where)
        ->find();
        //=========判断=========
        if($result){
            
            $res['res']=1;
            $result['order_id']=I('order_id');
            $result['order_info']=html($result['order_info']);
            $result['order_info']=json_decode($result['order_info'],true);
            $order_info=$result['order_info'];
            $result['money']=getOrderMoney($order_info);
            
            
            $res['msg']=$result;
            
        }else{
            $res['res']=-1;
            $res['msg']=$result;
        }
        
        if(!IS_AJAX){
            dump($res['msg']);
        }
        //=========判断end=========
        //=========输出json=========
        echo json_encode($res);
        
        //=========输出json=========
        
    }
    
    
    
    
}