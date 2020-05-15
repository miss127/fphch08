"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
var STUDENTS = [
    { id: '01', userName: 'zwj', web: '100', rfid: '100' },
    { id: '02', userName: 'fph', web: '90', rfid: '90' },
    { id: '03', userName: 'hyq', web: '95', rfid: '100' }
];
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    if (req.method == "OPTIONS") {
        res.send(200);
    }
    else {
        next();
    }
}
);
app.get('/students', function (req, resp) {
    resp.send(STUDENTS);
    resp.end();
});
app.get('/students/:id', function (req, resp) {
    console.log(req.params);
    const id = req.params.id;
    for (let student of STUDENTS) {
        if (student.id === req.params.id) {
            resp.send([student]);
            break;
        }
    }
    resp.end();
});
app.listen(1207, function () {
    console.log('服务器在1207端口启动！');
});
//参数化化路由 路由里面直接写参数
// app.post('/user/:id/:userName/:web', function (req, resp) {
//     console.log(req.params);
//     resp.end();
// });
// urlencoded的方式发送参数  app.use(bodyParser.urlencoded());
app.post('/student', function (req, resp) {
    let founded = true;
    for (let student of STUDENTS) {
        if (student.id === req.body.id) {
            resp.send({ succ: false });
            founded = false;
        }
    }
    if (founded == true) {
        STUDENTS.push(req.body);
        resp.send({ succ: true });
    }
    resp.end();
});
app.put('/student', function (req, resp) {
    let founded = false;
    for (let student of STUDENTS) {
        if (student.id === req.body.id) {
            student.userName = req.body.userName;
            student.web = req.body.web;
            founded = true;
            break;
        }
    }
    if (founded) {
        resp.send({ succ: true });
    }
    else {
        resp.send({ succ: false, msg: '没有找到用户！' });
    }
    resp.end();
});
app.delete('/student/:id', function (req, resp) {
    let founded = false;
    let index = 0;
    for (let student of STUDENTS) {
        if (student.id === req.params.id) {
            STUDENTS.splice(index, 1);
            founded = true;
            break;
        }
        index++;
    }
    if (founded) {
        resp.send({ succ: true });
    }
    else {
        resp.send({ succ: false, msg: '没有找到用户！' });
    }
    resp.end();
});