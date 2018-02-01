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
class CollectionController extends CommonController {
    
    /**
    * 获得
    */
    public function getList(){
        $model=M('collection');
        $where=[];
        $where['user_id']==session('user_id');
        $result=$model
        ->table('ao_collection as t1,ao_goods as t2')
        ->where('t1.goods_id = t2.goods_id')
        ->where($where)
        ->select();
        //=========判断=========
        if($result){
            $res['res']=1;
            
            $result=toHtml($result,'goods_info');
            $result=toHtml($result,'imglist');
            $result=toHtml($result,'spec');
            
            
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
    
    public function getAll(){
        
        
    }
    
    public  function collection(){
        
        $goods_id=I('goods_id');
        $user_id=session('user_id');
        $model=M('collection');
        $add['user_id']=$user_id;
        $add['goods_id']=$goods_id;
        
        if(!($model->where($add)->find())){
            //添加收藏
            
            $result=$model->add($add,null,true);
            //=========判断=========
            if($result!==false){
                $res['res']=1;
                $res['msg']=$result;
            }else{
                $res['res']=-1;
                $res['msg']=$result;
            }
            
        }else{
            //删除收藏
            $result=$model->where($add)->delete();
            //=========判断=========
            if($result!==false){
                $res['res']=2;
                $res['msg']=$result;
            }else{
                $res['res']=-1;
                $res['msg']=$result;
            }
        }
        
        
        //=========判断end=========
        
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    
    //判断用户是否收藏了
    public function isCollection(){
        
        $goods_id=I('goods_id');
        $user_id=session('user_id');
        $model=M('collection');
        $where['user_id']=$user_id;
        $where['goods_id']=$goods_id;
        
        $result=$model->where($where)->find();
        
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