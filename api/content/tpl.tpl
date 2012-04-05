<!DOCTYPE html>
<html>
<head>
	<title><{$title}></title>
	<link type="text/css" rel="stylesheet" href="../../css/content.css" />
</head>
<body>
<div id="body">
<h2 class="title">
<{$method}>
<span><{$inherit}></span></h2>
<p class="discription">
描述：<span class=""><{$description}></span>
</p>
<dl class="property">
	<dt>参数：</dt>
	<{$properties}>
</dl>
<p class="note">
注：<span><{$note}></span>
</p>
<p class="return">
返回值：<{$return}>
</p>
<div class="eg">
	<p>举例：</p>
	<pre class="code">
<{$eg}></pre>
</div>
</div>
</body>
</html>