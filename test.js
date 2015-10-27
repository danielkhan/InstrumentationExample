var async = require('async');

var subtree = new Array();



var recFunc = function(parentId, subtree) {



    db.findById(parentId, function(err, doc) {


        root.push(doc);

        async.each(doc.children, function(child) {

            recFunc(child._id, result);

        });

    });
};

