"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
var USERS = [
    { id: '01', userName: '180321180232', password: 'fph513516' },
    { id: '02', userName: 'aaaaa', password: '456789' }
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

app.get('/hello', function (req, resp) {
    resp.send('哈哈哈');
    resp.end();
});
app.get('/users', function (req, resp) {
    resp.send(USERS);
    resp.end();
});
app.get('/users/:id', function (req, resp) {
    console.log(req.params);
    const id = req.params.id;
    for (let user of USERS) {
        if (user.id === req.params.id) {
            resp.send([user]);
            break;
        }
    }
    resp.end();
});
app.listen(8080, function () {
    console.log('服务器在8080端口启动！');
});
//参数化化路由 路由里面直接写参数
// app.post('/user/:id/:userName/:password', function (req, resp) {
//     console.log(req.params);
//     resp.end();
// });
// urlencoded的方式发送参数  app.use(bodyParser.urlencoded());
app.post('/users', function (req, resp) {
    let founded = false;
    for (let user of USERS) {
        if (user.userName === req.body.userName && user.password === req.body.password) {
            resp.send({ succ: true });
            founded = true;
        }
    }
    if (founded == false) {
        resp.send({ succ: false });
    }
    resp.end();
});
app.post('/user', function (req, resp) {
    let founded = true;
    for (let user of USERS) {
        if (user.id === req.body.id) {
            resp.send({ succ: false });
            founded = false;
        }
    }
    if (founded == true) {
        USERS.push(req.body);
        resp.send({ succ: true });
    }
    resp.end();
});
app.put('/user', function (req, resp) {
    let founded = false;
    for (let user of USERS) {
        if (user.id === req.body.id) {

            user.userName = req.body.userName;
            user.password = req.body.password;
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
app.delete('/user/:id', function (req, resp) {
    let founded = false;
    let index = 0;
    for (let user of USERS) {
        if (user.id === req.params.id) {
            USERS.splice(index, 1);
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