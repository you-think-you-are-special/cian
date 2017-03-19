const fs = require('fs');
const _ = require('lodash');

module.exports.getAll = () =>{
    return JSON.parse(fs.readFileSync(__dirname + '/db.json').toString());
};

module.exports.saveAll = (data)=>{
    return fs.writeFileSync(__dirname + '/db.json', data)
};