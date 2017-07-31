//express_demo.js 文件
let express = require('express');
let app = express();
let redis=require('redis');
let client=redis.createClient();
let bodyParser=require('body-parser');
let multer=require('multer');
let upload=multer();
app.use(express.static(__dirname));
client.on("error",function (err) {
    console.log("Error"+err);
});
app.get('/', function (req, res) {
    client.get('idCollection', function (err, collection) {
        collection = JSON.parse(collection);
        if (collection.length !== 0) {
            res.sendfile(__dirname + '/WEB/bootstrap_practise_starter/scoresWeb.html');
        } else {
            res.status(200);
            res.send('<h1>目前没有学生</h1><strong><a href="/addition">请先添加学生</a></strong>');
        }
    });
});
app.post('/',function (req,res) {
    let outBase = [];
    client.get('idCollection', function (err, collection) {
       collection=JSON.parse(collection);
        collection.map(function (index) {
            index=JSON.stringify(index);
            client.get(index, function (err, reply) {
                outBase.push(JSON.parse(reply));
                if (outBase.length === collection.length) {
                    res.status(200).json(outBase);
                }
            });
        });
    });
});
app.get('/addition',function (req,res) {
    res.sendfile(__dirname+'/WEB/bootstrap_practise_starter/addScores.html');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));
app.use(express.static('views'));
app.post('/addition',upload.array(),function (req,res) {
    let trueFlag=0;
    if( /^[a-zA-Z]||[\u4e00-\u9fa5]$/.exec(req.body.name)!==null){trueFlag++;}
    if(/^[0-9]{6}$/.exec(req.body.Id)!==null){trueFlag++;}
    if(/^[a-zA-Z]||[\u4e00-\u9fa5]$/.exec(req.body.group)!==null){trueFlag++;}
    if(/^[0-9]{1,2}$/.exec(req.body.klass)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.math)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.Chinese)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.English)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.Program)!==null){trueFlag++;}
    if(trueFlag===8){
        client.get('idCollection',function (err,collection) {
            collection=JSON.parse(collection);
            collection.push(req.body.Id);
            collection=JSON.stringify(collection);
            client.set('idCollection',collection);
        });
        let Json=JSON.stringify(req.body);
        let keyJson=JSON.stringify(req.body.Id);
        client.set(keyJson,Json);
        client.get(keyJson,function (err,reply) {
            console.log(reply);
        });
        res.send('OK');
    }else{
        res.status(400);
        res.send('请按正确的格式输入（格式：姓名, 学号, 学科: 成绩, …）');
    }
   // res.json(req.body);
});
app.get('/searches',function (req,res) {
    res.sendfile(__dirname+'/WEB/bootstrap_practise_starter/findScores.html');
});
app.post('/searches',upload.array(),function (req,res) {
    let reqArr=req.body.Ids.split(',');
    let result=[];
    reqArr.map(function (value,tag) {
        value=JSON.stringify(value);
         client.get(value,function (err,reses) {
             if(reses!==null) {
                 result.push(value);
             }
             if(tag===reqArr.length-1){
                 if(result.length!==0){
                     let out=[];
                     result.map(function (index) {
                         client.get(index,function (err,reply) {
                             out.push(JSON.parse(reply));
                             if(out.length===result.length) {
                                 res.status(200).json(out);
                             }
                         });
                     });
                 }else{
                     res.status(400);
                     res.send('error');
                 }
             }
         });
    });
});
app.get('/searches/:id',function (req,res) {
    let stu=req.params.id;
    stu=JSON.stringify(stu);
    client.get(stu,function (err,reply) {
            if(reply===null){
                res.status(404);
                res.send('<h1>404<br>该学生不存在<h1>');
            }else{
                res.status(200);
                res.sendfile(__dirname+'/WEB/bootstrap_practise_starter/addScores.html');
            }
        });
});
app.delete('/searches/:id',function (req,res) {
    let studentId=req.params.id;
    studentId=JSON.stringify(studentId);
    client.get(studentId,function (err,reply) {
        if(reply!==null){
            client.del(studentId);
            res.status(200);
            res.send('Already Deleted');
        }else{
            res.status(404);
            res.send('<h1>404<br>该学生不存在<h1>');
        }
    });
});
let server = app.listen(8081, function () {
    let collection=[];
    collection=JSON.stringify(collection);
    client.set('idCollection',collection);
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});