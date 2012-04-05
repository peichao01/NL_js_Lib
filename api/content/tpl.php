<?php

$content = file_get_contents('tpl.tpl');

//title
$content = str_replace('<{$title}>',$_REQUEST['title'],$content);
//使用方式
$content = str_replace('<{$method}>',$_REQUEST['method'],$content);
//继承关系
$content = str_replace('<{$inherit}>',$_REQUEST['inherit'],$content);
//描述
$content = str_replace('<{$description}>',$_REQUEST['description'],$content);

//参数
$num = $_REQUEST['proNum'];
$pro = "";
for($i=0; $i<$num; $i++){
	$pro .= '<dd>'.$_REQUEST['pro_name_'.$i].
				'<span class="pro">:'.$_REQUEST['pro_type_'.$i].'</span>'.
				'<span class="dis">'.$_REQUEST['pro_des_'.$i].'</span>'.
			'</dd>';
}
$content = str_replace('<{$properties}>',$pro,$content);

//注意事项
$content = str_replace('<{$note}>',$_REQUEST['note'],$content);
//返回值
$content = str_replace('<{$return}>',$_REQUEST['return'],$content);
//举例
$content = str_replace('<{$eg}>',$_REQUEST['eg'],$content);

file_put_contents($_REQUEST['path'].$_REQUEST['filename'].'.html',$content);

?>