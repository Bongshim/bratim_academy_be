/* eslint-disable camelcase */
const moment = require('moment');
const { literal, Op } = require('sequelize');
const { db } = require('../models');
const { emailService } = require('../services');
const { scheduleJob } = require('../utils/cronUtils');

// Funtion to send a reminder to students before purchased data gets expired
const sendReminderBeforeExpiration = async (days) => {
  let flag = {};
  // switch notification flag depending of the days selected
  if (days === 2) flag = { hasSentNotification1: false };
  if (days === 14) flag = { hasSentNotification2: false };
  //   Get data purchases with a two week expiration data
  const subscriptions = await db.data_purchase.findAll({
    where: {
      [Op.and]: [
        literal(`data_purchase.createdAt + INTERVAL data_purchase.validity DAY > NOW() + INTERVAL ${days - 1} DAY`),
        literal(`data_purchase.createdAt + INTERVAL data_purchase.validity DAY <= NOW() + INTERVAL ${days} DAY`),
        { status: 'success', ...flag },
      ],
    },
    include: [
      {
        model: db.user,
        attributes: ['email', 'firstName', 'lastName'],
      },
    ],
  });

  //   Send email to each user
  subscriptions.forEach(async (subscription) => {
    const { user, createdAt } = subscription;
    const { email, firstName, lastName } = user;
    const { validity, validity_unit } = subscription;
    const expirationDate = moment(createdAt).add(validity, validity_unit).format('DD-MM-YYYY');
    const subject = 'Data Purchase Expiration Reminder';
    const html = `
            <p>Dear ${firstName} ${lastName},</p>
            <p>Your data purchase will expire in ${days} days on ${expirationDate}.</p>
            <p>Kindly renew your subscription to continue enjoying our services.</p>
            <p>Best regards,</p>
            <p>Prodatag Team</p>
        `;

    //   Send email
    await emailService.sendEmail(email, subject, html);
    //   Update hasSentNotification1 to true
    await db.data_purchase.update({ hasSentNotification1: true }, { where: { id: subscription.id } });
  });
};

// Cron job to send reminder to students before purchased data gets expired
scheduleJob('0 0 * * *', () => sendReminderBeforeExpiration(14));
scheduleJob('0 0 * * *', () => sendReminderBeforeExpiration(2));
