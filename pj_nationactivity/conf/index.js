const config = require('../../config');

let env = process.argv[2] || 'intc';
env = env === 'prod' ? env : 'intc';

module.exports = {
    pjName: "/pj_nationactivity",
    pjPath: "nationactivity",
    startTime: require('./time')(env),
    endTime: '2016-11-27 23:59:59',
    ticketTime: require('./ticketTime')(env),
}