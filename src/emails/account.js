const sgMail = require('@sendgrid/mail')
const SEND_GRID_APIKEY = process.env.SEND_GRID_APIKEY

sgMail.setApiKey(SEND_GRID_APIKEY)

const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_USER,
        subject: 'Welcome to node app - New account creation.',
        text: 'welcome to the node app '+ name+ '. Let me know how you get along with this.'
    })
    
}  

const sendCancelationEmail = (name, email) =>{
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_USER,
        subject: 'Account Deleted in node APP',
        text: 'Goodbye '+ name+ ', I hope to see you sometime soon'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}