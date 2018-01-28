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
class GoodsController extends CommonController {
    
    /**
    * 获得
    */
    public function getList(){
        
        $conf=initGetList();
        
        $model=$conf['model'];
        $where=$conf['where'];
        $where['t1.user_id']=session('user_id');
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
    
    public function getAll(){
        
        I('ids');
        $model=M('goods');
        $where=[];
        $where['goods_id']=array('in',I('ids'));
        $result=$model->where($where)->select();
        //=========判断=========
        if($result){
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
    
}