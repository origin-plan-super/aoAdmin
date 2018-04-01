<?php
namespace Home\Controller;
use Think\Controller;
class PaperController extends Controller{
    
    /**
    * 获得
    */
    public function getList(){
        
        $conf=initGetList();
        
        $model=M('Paper');
        
        $where['is_push']=1;
        
        if(check(I('where'))){
            $where['paper_type']=I('where')['paper_type'];
        }
        
        //生成数据
        $result=$model
        ->where($where)
        ->order('add_time desc')
        ->select();
        
        //=========判断=========
        if($result){
            //总条数
            $res['count']=count($result);
            
            $result=getPageList($conf,$result);
            $result=toTime($result);
            
            
            foreach ($result as $key => $value) {
                
                $url=U('show','paper_id='.$value['paper_id'],null,true);
                
                $result[$key]['url']=$url;
                
            }
            
            $res['res']=1;
            $res['msg']=$result;
            
        }else{
            $res['res']=-1;
        }
        //=========判断end=========
        
        
        if(session('is_debug')){
            dump($res);
        }else{
            echo json_encode($res);
            
        }
        
    }
    public function show(){
        $id=I('paper_id');
        $model=M('paper');
        $where=[];
        $where['paper_id']=$id;
        $paper=$model->where($where)->find();
        
        $paper['add_time']=date('Y-m-d H:i:s', $paper['add_time']);
        
        $this->assign('paper',$paper);
        $this->display();
        
        
    }
    
    
    
}