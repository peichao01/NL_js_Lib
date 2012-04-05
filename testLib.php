<?php

$script = $_GET['callback'];

$sth = <<<STH
	
	var person = {
		Main: function(name){
			this.name = name;
		},
		walk: function(){
			alert(this.name+" can walk!");
		}
	}
	
STH;
echo $sth;
echo $script.'()';

?>