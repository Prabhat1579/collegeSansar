const chalk = require('chalk');
const express = require('express');
const { PORT } = require('./config/env');
const db = require('./config/db');
const serveStaticAssets = require('./config/serveStatics');
const middlewareInits = require('./config/middlewareInits');
const cron = require('node-cron');
const {addDays} = require('date-fns')
const {Op} = require('sequelize')
const nodemailer = require('nodemailer')
const Subscribe = require('./model/Subscribe')
const app = express();

db.connect();
db.sequelize.sync();
middlewareInits(app);
serveStaticAssets(app);

app.use('/', require('./routes/client'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/adminAuth'));
app.use('/admin', require('./routes/admin'));

app.listen(PORT, () => {
	console.log(chalk.bold.yellow(`server running in port ${PORT}`));
});

cron.schedule("0 0 0 * * *", async () => {
	try {
		
	 sendMail(7)
	
	} catch (err) {
	  console.log(err);
	}
  });


async function sendMail(days=1){
   
    const transporter = nodemailer.createTransport({
        service: 'gmail',
		auth: {
			user: 'dahaljohn06@gmail.com',
			pass: '',
		},
      });
	  
	  const subscribes = await Subscribe.findAll({
		  where:{
			  examDate:{
				  [Op.eq]: addDays(new Date(), days)
			  }
		  }
	  })

     
      for (const subscribe of subscribes) {
        const mailOptions = {
          from: "College Sansar",
          to: subscribe.email,
          subject: `Your Exam Remainder`,
          html: `You set remainder for your Exam ${subscribe.title}</br> which is in <strong> ${formatDistance(
            subscribe.examDate,
            new Date(), {addSuffix: true}
          )}. </strong> </br>
              Thank You.  
              `,
        };
       
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
}
