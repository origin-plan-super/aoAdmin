<?php
/**
* +----------------------------------------------------------------------
* 创建日期：2018年1月28日
* +----------------------------------------------------------------------
* https：//github.com/ALNY-AC
* +----------------------------------------------------------------------
* 微信：AJS0314
* +----------------------------------------------------------------------
* QQ:1173197065
* +----------------------------------------------------------------------
* #####产品控制器#####
* @author 代码狮
*
*/
namespace Home\Controller;
use Think\Controller;
class OrderController extends CommonController {
    
    /**
    * 获得
    */
    public function getList(){
        
        $conf=initGetList();
        
        $model=$conf['model'];
        $where=$conf['where'];
        $where['user_id']=session('user_id');
        //生成数据
        $result=$model
        ->table('ao_dealer_goods as t1, ao_goods as t2,ao_depot as t3')
        ->field('t1.*,t2.*,t2.money as t2_money,t3.depot_id,t3.depot_name')
        ->order('t1.add_time desc,t1.goods_id desc')
        ->where('t1.goods_id = t2.goods_id and t2.depot_id = t3.depot_id')
        ->where($where)
        ->select();
        
        
        //=========判断=========
        if($result){
            //总条数
            $res['count']=count($result);
            
            $result=getPageList($conf,$result);
            $result=toTime($result);
            $result=toHtml($result,'goods_info');
            $result=toHtml($result,'imglist');
            $result=toHtml($result,'spec');
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
    
    //获得订单
    public function getOrderList(){
        
        $where['t1.user_id']=session('user_id');
        $model=M();
        $result= $model
        ->table('ao_order as t1,ao_order_info as t2')
        ->field('t1.*,t2.*')
        ->where('t1.order_id = t2.order_id')
        ->where($where)
        ->select();
        //=========判断=========
        if($result !==false){
            $res['res']=1;
            $result=toHtml($result,'order_info');
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
    
    //创建订单
    public function add(){
        
        // orderInfo: orderList,
        // orderType: orderType,
        $order_info=I('orderInfo');
        $order_type=I('orderType');
        
        $order_id=date('YmdHis',time()).rand(1000,9999);
        
        $model=M('order');
        
        $add=[];
        $add['order_id']=$order_id;
        $add['user_id']=session('user_id');
        $add['add_time']=time();
        $add['edit_time']=time();
        $add['order_type']=$order_type;
        $model->add($add);
        
        $model=M('order_info');
        
        $add=[];
        $add['order_id']=$order_id;
        $add['order_info']=$order_info;
        $result=$model->add($add);
        
        //=========判断=========
        if($result){
            $res['res']=1;
            $res['msg']=$order_id;
        }else{
            $res['res']=-1;
        }
        //=========判断end=========
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    public function getOrder(){
        
        $order_id=$where['t1.order_id']=I('order_id');
        $user_id=  session('user_id');
        
        $model=M();
        $result= $model
        ->table('ao_order as t1,ao_order_info as t2')
        ->field('t1.*,t2.*')
        ->where('t1.user_id = "'.$user_id.'"')
        ->where($where)
        ->find();
        
        //=========判断=========
        if($result){
            $res['res']=1;
            // 找商品
            $order_info=html($result['order_info']);
            $order_info=json_decode($order_info,true);
            $goods_info=$order_info['goods_info'];
            $address_info=$order_info['address_info'];
            
            $model=M('dealer_goods');
            $money=0;
            
            foreach ($goods_info as $key => $value) {
                $money+=$value['money'];
            }
            
            $res['msg']['goods_info']['money']=$money;
            $res['msg']['address_info']=$address_info;
        }else{
            $res['res']=-1;
        }
        //=========判断end=========
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    
}