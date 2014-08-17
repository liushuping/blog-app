var user = process.argv[2],
    repo = process.argv[3],
    GitHubApi = require('github'),
    level = require('level'),
    leveldown = require('leveldown'),
    marked = require('marked');
    issuesDB = level('../db/issues');

    github = new GitHubApi({
        version: '3.0.0',
        protocol: 'https',
    }),

    updateOption = {
	    valueEncoding: 'json'
    },

    issueMsg = {
        user: user,
        repo: repo
    };
    
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

function destroyDB(callback) {
    leveldown.destroy('../db/issues', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('../db/issues is destroyed');
            (callback instanceof Function) && callback();
        }
    });
}

function updateAnIssue(issue) {
    console.log('update issue ', issue.number, ' :', issue.title);
    issue.body = marked(issue.body);
    issuesDB.put(issue.number, issue, updateOption, function (err) {
	    if (err) {
	        console.log(err);
	    }
    });
}

function processIssues(issues) {
    var i, len, title;

    for (i = 0, len = issues.length; i < len; i++) {
        title = issues[i].title;

        if (/.*\s+draft\s*$/i.test(title)) {
            continue;
        }

        updateAnIssue(issues[i]);
    }
}

github.issues.repoIssues(issueMsg, function(err, issues) {
    if (err) {
        console.log(err);
    } else {
    	processIssues(issues);	
    }
});
