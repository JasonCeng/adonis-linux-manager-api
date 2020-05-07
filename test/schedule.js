var schedule = require('node-schedule');

function scheduleRecurrenceRule(){

    var rule = new schedule.RecurrenceRule();
    // rule.dayOfWeek = 2;
    // rule.month = 3;
    // rule.dayOfMonth = 1;
    // rule.hour = 1;
    // rule.minute = 42;
    rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    
    schedule.scheduleJob(rule, function(){
       console.log('scheduleRecurrenceRule:' + new Date());
    });
   
}

scheduleRecurrenceRule();