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
    <button onClick="handleClick()">发送请求</button>
</body>
<script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
<script type="text/javascript">
    try {
        window.env = document.getElementById('env').value;
        options = document.getElementById('options').value;
        window.options = JSON.parse(options);

    }catch(e){
        console.log(e);
    }
    function handleClick() {
        const signKey = 'vsivbguiagbcua';
        const st = Date.now();
        axios.request({
            method: 'get',
            url: '/api/project/list',
            params: { proj_key: 'test' },
            headers: {
                s_t: st,
                s_sign: md5(`${signKey}_${st}`)
            }
        })
        
    
    }
</script>
</html>