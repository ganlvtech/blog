const acorn = require('acorn');
const walk = require('acorn/dist/walk');
const escodegen = require('escodegen');
const fs = require('fs');
const path = require('path');

function S(e) {
    for (var t = '', n = e.charCodeAt(0), i = 1; i < e.length; ++i)
        t += String.fromCharCode(e.charCodeAt(i) ^ i + n & 127);
    return t;
}

function recursiveDecode(node) {
    if (node.type === 'Literal') {
        node.value = S(node.value);
        // console.log(node.value);
    } else if (node.type === 'ConditionalExpression') {
        recursiveDecode(node.consequent);
        recursiveDecode(node.alternate);
    } else {
        console.log('Node type is neither Literal nor ConditionalExpression. ' + node.start);
    }
}

// 这里改成你的代码位置
var inputFile = path.join(__dirname, 'ckfinder/ckfinder.min.js');
var outputFile = path.join(__dirname, 'ckfinder/ckfinder.js');

fs.readFile(inputFile, {encoding: 'utf-8'}, function (err, data) {
    if (err) {
        console.log(err);
        return;
    }
    var ast = acorn.parse(data);
    walk.simple(ast, {
        CallExpression: function (node) {
            if (node.callee.type === 'Identifier' && node.callee.name === 'S' && node.arguments.length === 1) {
                var arg0 = node.arguments[0];
                recursiveDecode(arg0);
                if (arg0.type === 'Literal') {
                    node.type = arg0.type;
                    node.value = arg0.value;
                } else if (arg0.type === 'ConditionalExpression') {
                    node.type = arg0.type;
                    node.test = arg0.test;
                    node.consequent = arg0.consequent;
                    node.alternate = arg0.alternate;
                }
            }
        }
    });
    var code = escodegen.generate(ast);
    fs.writeFile(outputFile, code, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('The file was saved!');
    });
});
