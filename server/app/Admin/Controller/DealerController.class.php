<?php
namespace Admin\Controller;
use Think\Controller;
class DealerController extends Controller {
    
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
    public function getGoodsList(){
        $conf=initGetList();
        
        $model=M('dealer_goods');
        $where=$conf['where'];
        
        $result=$model
        ->table('ao_goods as t1,ao_depot as t2,ao_dealer_goods as t3')
        ->field('t1.*,t1.money as t1_money,t2.depot_name,t2.depot_id,t3.*')
        ->order('t3.goods_id desc, t3.add_time desc')
        ->where('t3.goods_id = t1.goods_id and t1.depot_id = t2.depot_id ')
        ->where($where)
        ->select();
        
        //=========判断=========
        if($result!==false && $result !== null){
            //总条数
            $res['count']=count($result);
            
            $result=getPageList($conf,$result);
            $result=toTime($result);
            $result=toHtml($result,'goods_info');
            $result=toHtml($result,'imglist');
            $result=toHtml($result,'spec');
            
            $res['res']=1;
            $res['msg']=$result;
            $res['where']=$where;
            
        }else{
            $res['res']=0;
        }
        
        echo json_encode($res);
    }
    
    //保存商品
    public function saveGoods(){
        
        $where=I('where');
        $save=I('save');
        $save['edit_time']=time();
        $model=M('dealer_goods');
        $result=$model->where($where)->save($save);
        
        
        $res['sql']=$model->_sql();
        $res['result']=$result;
        
        if($result==null){
            $res['res']=0;
        }else{
            
            //=========判断=========
            if($result!==false){
                $res['res']=1;
            }else{
                $res['res']=-1;
            }
            
        }
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
        
    }
    
    /**
    * 添加一个代理商
    */
    public function add(){
        
        $id=I('add')['user_phone'];
        $res=add($id);
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    //给代理商指派一个商品
    public function addGoods(){
        $goods=I('add');
        
        $model=M('dealer_goods');
        
        //先看看有没有
        
        $where=[];
        $where['user_id']=$goods['user_id'];
        $where['goods_id']=$goods['goods_id'];
        
        $result=$model->where($where)->find();
        
        if($result===null){
            
            $goods['add_time']=time();
            $goods['edit_time']=time();
            $result=  $model->add($goods,null,true);
            //=========判断=========
            if($result){
                $res['res']=1;
            }else{
                $res['res']=-1;
            }
            
        }else{
            //已经指派
            $result=true;
            $res['res']=2;
        }
        
        //=========判断end=========
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    
    public function delGoods(){
        $user_id=I('user_id');
        $goods_id=I('goods_id');
        $del=[];
        $where['user_id']=$user_id;
        $where['goods_id']=$goods_id;
        
        $model=M('dealer_goods');
        $result= $model->where($where)->delete();
        
        //=========判断=========
        if($result){
            $res['res']=1;
        }else{
            $res['res']=-1;
        }
        //=========判断end=========
        
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