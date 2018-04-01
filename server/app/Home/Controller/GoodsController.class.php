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
        $user_id=session('user_id');
        $model=$conf['model'];
        $where=$conf['where'];
        $where['t1.user_id']=session('user_id');
        //生成数据
        $result=$model
        ->table('ao_dealer_goods as t1, ao_goods as t2,ao_class as t3')
        ->field('t1.*,t2.*,t2.money as t2_money,t3.class_id,t3.class_title')
        ->order('t1.add_time desc,t1.goods_id desc')
        ->where('t1.goods_id = t2.goods_id and t2.class_id = t3.class_id')
        ->where($where)
        ->select();
        //=========判断=========
        if($result){
            //总条数
            $res['count']=count($result);
            
            $result=getPageList($conf,$result);
            $result=toTime($result);
            $result=toHtml($result,'depot_list');
            $result=toHtml($result,'level_list');
            $result=toHtml($result,'goods_info');
            $result=toHtml($result,'imglist');
            $result=toHtml($result,'spec');
            $result=toHtml($result,'class_list');
            
            for ($i=0; $i <count($result) ; $i++) {
                
                $result[$i]['depot_list']=json_decode($result[$i]['depot_list']);
                $result[$i]['level_list']=json_decode($result[$i]['level_list'],true);
                $result[$i]['goods_info']=json_decode($result[$i]['goods_info'],true);
                $result[$i]['imglist']=json_decode($result[$i]['imglist']);
                $result[$i]['spec']=json_decode($result[$i]['spec']);
                $result[$i]['class_list']=json_decode($result[$i]['class_list']);
                
            }
            
            $result=setGoodsMoeny($result,$user_id);
            
            
            
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