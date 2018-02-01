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
class ShopBagController extends CommonController {
    
    public function add(){
        
        $model=M('dealer_goods');
        //先看看有没有
        $where=[];
        $where['user_id']=session('user_id');
        $where['goods_id']=$goods['goods_id'];
        $result=$model->where($where)->find();
        if($result===null){
            $goods['add_time']=time();
            $goods['edit_time']=time();
            $result=$model->add($goods,null,true);
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
    

    
    
    
}