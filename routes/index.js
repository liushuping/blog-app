var express = require('express');
var router = express.Router();
var postsLib = require('../lib/posts');

router.get('/', function(req, res) {
    postsLib.getAll(function(posts)  {
        var title = '高阶是对抽象的抽象';
        posts = posts.sort(function(p1, p2) {
            return p2.id - p1.id;
        });
	var body = {
	    posts: posts,
	    title: title,
	    canonical: 'http://blog.liushuping.com/',
	    keywords: '刘淑平,liushuping,Blog,JavaScript,C#,程序,抽象',
	    description: '刘淑平的Blog，专注于前端程序开发，致力于提高代码质量。对JavaScript和C#以及函数式编程有浓厚兴趣，认为抽象是解决复杂软件问题的强有力工具。'
        };

        res.render('index', body);
    });
});

module.exports = router;
