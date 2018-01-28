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
class AddressController extends CommonController {
    
    /**
    * 获得
    */
    public function getList(){
        
        $where['user_id']=session('user_id');
        $model=M('address');
        $result=$model->where($where)->select();
        //=========判断=========
        if($result){
            $res['res']=1;
            $result=toHtml($result,'address');
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
    public function add(){
        
        $add['user_id']=session('user_id');
        $res=add(false,'md5',$add);
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
    
    public function del(){
        
        $where['user_id']=session('user_id');
        $res=del(false,null,null,$where);
        //=========输出json=========
        echo json_encode($res);
        //=========输出json=========
        
    }
}