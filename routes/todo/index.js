var express = require('express');
var router = express.Router();


var todos = [];

router.post('/', function (req, res, next) {
    if (!req.body.todoItem) return res.status(200).end();

    var itemObj = {text: req.body.todoItem}

    todos.push(itemObj);
    return res.json(todos);
});

router.get('/', function (req, res, next) {

    return res.json(todos);
});

module.exports = router;