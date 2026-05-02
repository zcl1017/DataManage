<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>{{name}}</title>
    <link href="/static/normalize.css" rel="stylesheet">
    <link rel="icon" href="/static/logo.png" type="image/png">
</head>
<body>
    <h1>page111</h1>
    <input id="env"  value="{{ env }}" style="display: none">
    <input id="options" value="{{ options }}" style="display: none">
    <button id="btn-send" type="button">发送请求</button>
</body>
<script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
<script type="text/javascript">
    try {
        window.env = document.getElementById('env').value;
        options = document.getElementById('options').value;
        window.options = JSON.parse(options);

    }catch(e){
        console.log(e);
    }
    function handleClick() {
        axios.get('/api/project/list').then(function (res) { console.log(res); });
    }
    document.getElementById('btn-send').addEventListener('click', handleClick);
</script>
</html>