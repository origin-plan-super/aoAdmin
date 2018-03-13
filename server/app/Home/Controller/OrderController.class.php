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
    * 获得商品
    */
    public function getList(){
        //获得商品
        $conf=initGetList();
        
        $model=$conf['model'];
        $where=$conf['where'];
        // $where['user_id']=session('user_id');
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
        
        $where=I('where')?I('where'):[];
        $user_id=session('user_id');
        $model=M("order");
        $where['user_id']=$user_id;
        $res['count']=$model->where($where)->count()+0;
        
        $where=[];
        $where['t1.user_id']=$user_id;
        $result= $model
        ->table('ao_order as t1,ao_order_info as t2')
        ->field('t1.*,t2.*')
        ->where('t1.order_id = t2.order_id')
        ->where($where)
        ->select();
        
        //=========判断=========
        if($result !==false){
            $res['res']=count($result);
            // $result=toHtml($result,'order_info');
            for ($i=0; $i < count($result); $i++) {
                $result[$i]['order_info']=json_decode($result[$i]['order_info'],true);
                $money=0;
                $goods_info=$result[$i]['order_info']['goods_info'];
                $goods_info=setGoodsMoeny($goods_info,$user_id);
                $result[$i]['order_info']['goods_info']=$goods_info;
            }
            
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
    
    //创建订单，在这里计价
    public function add(){
        
        $order_info=I('orderInfo','',false);
        $order_type=I('orderType','',false);
        $user_id=session('user_id');
        //在这里计价
        $order_money=getOrderMoney($order_info['goods_info'],$user_id);
        //生成订单号
        $order_id=date('YmdHis',time()).rand(1000,9999);
        //=====
        $add=[];
        //订单id
        $add['order_id']=$order_id;
        $add['order_money']=$order_money;
        //用户的id
        $add['user_id']=$user_id;
        //添加时间
        $add['add_time']=time();
        //最后编辑时间
        $add['edit_time']=time();
        //订单类别
        $add['order_type']=$order_type;
        //添加
        $model=M('order');
        $result=$model->add($add);
        //=========判断订单是否创建成功=========
        if($result){
            //创建订单成功
            //将订单信息添加到订单信息表中
            $model=M('order_info');
            $add=[];
            //订单信息对应的订单id
            $add['order_id']=$order_id;
            //订单的信息
            //将订单信息json转换为字符串
            $order_info=json_encode($order_info);
            $add['order_info']=$order_info;
            //添加
            $result=$model->add($add);
            //判断订单信息是否添加成功
            if($result){
                $res['res']=1;
                $res['msg']=$order_id;
            }else{
                $res['res']=-1;
            }
            
            
        }else{
            //订单创建失败
            $res['res']=-1;
        }
        echo json_encode($res);
        
    }
    //这里是批量查询订单 订单支付页面用
    public function getOrder(){
        
        $orderLists=I('orderLists');
        $user_id= session('user_id');
        $model=M();
        
        $order_money=0;
        
        //取订单信息
        foreach ($orderLists as $key => $value) {
            //取订单id
            $order_id=$value['order_id'];
            //设置条件
            $where['t1.order_id']=$order_id;
            //订单表和订单信息表联表找一条
            $result= $model
            ->table('ao_order as t1,ao_order_info as t2')
            ->field('t1.*,t2.*')
            ->where('t1.order_id = t2.order_id and t1.user_id = "'.$user_id.'"')
            ->where($where)
            ->find();
            
            //如果数据存在
            if($result){
                $res['res']=1;
                // 找商品
                $order_info=$result['order_info'];
                
                $order_info=json_decode($order_info,true);
                $goods_info=$order_info['goods_info'];
                $address_info=$order_info['address_info'];
                $money= $result['order_money'];
                //将钱添加到总价中
                $order_money+=$money;
                //转换级别的钱
                $goods_info=setGoodsMoeny($goods_info,$user_id);
                $info=[];
                $info['order_id']=$order_id;
                $info['order_info']=$order_info;
                $info['money']=$money;
                $res['msg'][]=$info;
                
            }else{
                $res['res']=-1;
            }
        }
        $res['order_money']=$order_money;
        echo json_encode($res);
        
    }
    public function pay(){
        
        $orderLists=I('orderLists');
        //支付类型
        //0 余额支付
        //1 支付宝支付
        //2 微信支付
        $payType=I('payType');
        
        $ids=[];
        
        foreach ($orderLists as $key => $value) {
            $ids[]=$value['order_id'];
        }
        $res['res']=1;
        $model=M('order');
        $where=[];
        $where['order_id']=array('in',$ids);
        $orders=$model->where($where)->select();
        
        $money=0;
        //取得所有订单的总价
        foreach ($orders as $key => $value) {
            $money+=$value['order_money'];
        }
        if(count($ids)<=1){
            //单订单支付
            $orderType="单订单支付";
            
        }else{
            //多订单支付 ，需要生成多订单支付的数据
            $orderType="多订单支付";
            $Orders=M('orders');
            $add=[];
            
            $orders_id=date('YmdHis',time()).rand(1000,9999);
            
            $add['orders_id']=$orders_id;
            $add['order_ids']=json_encode($ids);
            $add['add_time']=time();
            $add['edit_time']=time();
            // $Orders->add($add);
        }
        
        if($orderType=="多订单支付"){
            $order_id=$orders_id;
        }
        
        if($orderType=="单订单支付"){
            $order_id=$ids[0];
        }
        
        if($payType==0){
            //余额支付
            yePay($order_id,$money,$orderType);
            return;
        }
        
        
        if($payType==1){
            //支付宝
            alipay($order_id,$money,$orderType);
            return;
        }
        if($payType===2){
            //微信
        }
        
        
    }
    
    /**
    * 保存订单
    */
    public function saveOrder(){
        
        $order_id=I('order_id','',false);
        $user_id=session('user_id');
        
        
        $model=M('order');
        $where=[];
        $where['order_id']=$order_id;
        $where['user_id']=$user_id;
        $order=$model->where($where)->find();
        
        if($order['state']==1){
            //只有未支付的订单才可以编辑
            
            //重新保存后要再次计价
            $save=I('save','',false);
            $money=getOrderMoney($save['order_info']['goods_info'],$user_id);
            $save=[];
            $save['order_money']=$money;
            $model->where($where)->save($save);
            
            $save=[];
            $save=I('save','',false);
            $model=M('order_info');
            $where=[];
            $where['order_id']=$order_id;
            
            $save['order_info']=json_encode($save['order_info']);
            $result = $model->where($where)->save($save);
            
            //=========判断=========
            if($result!==false){
                $res['res']=1;
                $res['msg']=$result;
            }else{
                $res['res']=-1;
                $res['msg']=$result;
            }
            //=========判断end=========
            
        }else{
            $res['res']=-1;
        }
        
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    
    //让一个数组的订单进入回收站
    public function setRecycle(){
        
        $ids=I('ids');
        $model=M('order');
        $where=[];
        $where['order_id']=array('in',$ids);
        $save['is_recycle']=1;
        $result=$model->where($where)->save($save);
        
        //=========判断=========
        if($result !==false){
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
    
    //还原订单
    public function reduction(){
        
        $ids=I('ids');
        $model=M('order');
        $where=[];
        $where['order_id']=array('in',$ids);
        $save['is_recycle']=0;
        $result=$model->where($where)->save($save);
        
        //=========判断=========
        if($result !==false){
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
    
    public function  test(){
        $order_id='12138';
        $money='0.01';
        $orderType='多订单支付';
        alipay($order_id,$money,$orderType);
    }
    
    
    
}