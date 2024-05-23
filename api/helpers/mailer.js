const nodemailer = require('nodemailer');
const {
  newBookingEmail,
  newBookingEmailForPacient,
  bookingUpdateEmail,
  contactEmail,
  newMessage
} = require('./emailTemplates');
const { google, outlook, office365, yahoo, ics } = require("calendar-link");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify().then(() => {
  console.log("* Mailing ready *")
})


const sendnewBookingEmail = async (data) => {
  const dates = JSON.parse(data.dateObjects)

  const events = dates.map(date => {
    return {
      title: `${data.serviceName} - Lic. M. Agustina Sotelo`,
      description: `Si necesitas hacer un cambio o cancelación, ponete en contacto a traves del mail: magu.sotelo25@gmail.com`,
      start: new Date(date),
      duration: [1, "hour"],
      location: 'Online (Google Meet)'
    }
  })

  const calendarLinks = events.map(event => google(event))

  await transporter.sendMail({
    from: `"Lic. M. Agustina Sotelo" <${process.env.EMAIL}>`,
    to: ["guille.sotelo.cloud@gmail.com", "magu.sotelo25@gmail.com"],
    subject: `Nueva reserva: ${data.serviceName}`,
    html: newBookingEmail({ ...data, calendarLinks })
  }).catch((err) => {
    console.error('Error in sendnewBookingEmail', err)
  })

  await transporter.sendMail({
    from: `"Lic. M. Agustina Sotelo (no-reply)" <${process.env.EMAIL}>`,
    to: data.email,
    subject: `Gracias por tu reserva!`,
    html: newBookingEmailForPacient({ ...data, calendarLinks })
  }).catch((err) => {
    console.error('Error in sendnewBookingEmail', err)
  })
}

const sendBookingUpdateEmail = async (username, data, to) => {
  await transporter.sendMail({
    from: `"Lic. M. Agustina Sotelo" <${process.env.EMAIL}>`,
    to,
    subject: `Cambios en tu reserva`,
    html: bookingUpdateEmail(data, username)
  }).catch((err) => {
    console.error('Something went wrong!', err)
  })
}

const sendContactEmail = async (username, data, to) => {
  await transporter.sendMail({
    from: `"Lic. M. Agustina Sotelo" <${process.env.EMAIL}>`,
    to,
    subject: `Tienes un nuevo mensaje`,
    html: contactEmail(data, username)
  }).catch((err) => {
    console.error('Something went wrong!', err)
  })
}

const sendNewMessageEmail = async () => {
  await transporter.sendMail({
    from: `"Lic. M. Agustina Sotelo" <${process.env.EMAIL}>`,
    to: ["guille.sotelo.cloud@gmail.com", "magu.sotelo25@gmail.com"],
    subject: `Nuevos mensajes desde la web`,
    html: newMessage()
  }).catch((err) => {
    console.error('Something went wrong!', err)
  })
}


module.exports = {
  transporter,
  sendnewBookingEmail,
  sendBookingUpdateEmail,
  sendContactEmail,
  sendNewMessageEmail,
};