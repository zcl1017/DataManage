<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>{{name}}</title>
    <link href="/static/normalize.css" rel="stylesheet">
    <link rel="icon" href="/static/logo.png" type="image/png">
</head>
<body style="margin: 0;">
<div id="root"></div>
    <h1>page111</h1>
    <input id="env"  value="{{ env }}" style="display: none">
    <input id="options" value="{{ options }}" style="display: none">
</body>
<script type="text/javascript">
    try {
        window.env = document.getElementById('env').value;
        options = document.getElementById('options').value;
        window.options = JSON.parse(options);

    }catch(e){
        console.log(e);
    }
</script>
</html>