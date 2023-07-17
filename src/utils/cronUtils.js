const cron = require('node-cron');

// Function to schedule a job with cron
const scheduleJob = (cronExpression, jobFunction) => {
  cron.schedule(cronExpression, jobFunction);
};

module.exports = {
  scheduleJob,
};
