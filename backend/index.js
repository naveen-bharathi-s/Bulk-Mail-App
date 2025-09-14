// import express from 'express';
// import cors from 'cors';    
// import nodemailer from 'nodemailer';
// import mongoose from 'mongoose';

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb+srv://naveenbharathi:123@bulkmail.3rwxgbg.mongodb.net/passkey?retryWrites=true&w=majority&appName=bulkmail').then(() => {
//   console.log('Connected to MongoDB');
// }).catch((err) => {
//   console.error('Error connecting to MongoDB:', err);
// })

// const credentials = mongoose.model('credentials', {}, "bulkmail")

// app.post('/SendMail', (req, res) => {

//   const {msg,emailList} = req.body;

  
//   credentials.find().then((data)=>{
//   // Create a test account or replace with real credentials.
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: data[0].toJSON().user,
//     pass: data[0].toJSON().pass,
//   },
// });


// new Promise(async(resolve, reject) => {
//     try{
//     for(let i=0;i<emailList.length;i++)
//     {
//           await transporter.sendMail({
//           from: "naveenbharathi555@gmail.com",
//           to: emailList[i],
//           subject: "Sending Email using Node.js",
//           text: msg,
//          }, 
         
//         //  function (error, info) {
//         //          if (error) {
//         //          console.log(error);
//         //          res.send('Error sending email');
//         //          } else {
//         //          console.log('Email sent: ' + info);
//         //          res.send('Email sent successfully');
//         //      }
//         // }
// );
// console.log('Email sent to: ' + emailList[i]);
//   }
//   resolve("success");
// }
// catch(error){
//   reject("failed"); 
// }
//   }).then((data)=>{
//     res.send("Email sent successfully");
//   }).catch((err)=>{
//     res.send("Error sending email");
//   })

// }).catch((err)=>{
//   console.log(err);
// })
  

// })


// app.get('/', (req, res) => {
//     res.send('Hello from the server!');
// })



// app.listen(8000, () => {
//     console.log(`Server listening on port 8000`);
// });















// import express from 'express';
// import cors from 'cors';
// import nodemailer from 'nodemailer';
// import mongoose from 'mongoose';

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ===== MongoDB =====
// mongoose.connect('mongodb+srv://naveenbharathi:123@bulkmail.3rwxgbg.mongodb.net/passkey?retryWrites=true&w=majority&appName=bulkmail')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Gmail credentials are stored in `bulkmail` collection (same as your code)
// const credentials = mongoose.model('credentials', {}, 'bulkmail');

// // History schema
// const sentMailSchema = new mongoose.Schema({
//   subject: String,
//   body: String,
//   recipients: [String],
//   sentCount: Number,
//   failed: [String],
//   createdAt: { type: Date, default: Date.now }
// });
// export const SentMail = mongoose.model('SentMail', sentMailSchema);

// // ===== Routes =====

// // Send Mail
// app.post('/SendMail', async (req, res) => {
//   const { subject, msg, emailList } = req.body;
//   if (!subject || !msg || !emailList?.length) {
//     return res.status(400).json({ error: 'Missing subject, message, or emails' });
//   }

//   try {
//     const creds = await credentials.findOne();
//     if (!creds) return res.status(500).json({ error: 'No SMTP credentials found' });

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: creds.toJSON().user, pass: creds.toJSON().pass },
//     });

//     const failed = [];

//     for (const email of emailList) {
//       try {
//         await transporter.sendMail({
//           from: creds.user,
//           to: email,
//           subject,
//           text: msg,
//         });
//         console.log('Email sent to:', email);
//       } catch (err) {
//         console.error('Failed to send to', email, err);
//         failed.push(email);
//       }
//     }

//     // Save history
//     await SentMail.create({
//       subject,
//       body: msg,
//       recipients: emailList,
//       sentCount: emailList.length - failed.length,
//       failed,
//     });

//     res.json({
//       success: true,
//       sent: emailList.length - failed.length,
//       failed,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error sending emails' });
//   }
// });

// // Get Email History
// app.get('/history', async (req, res) => {
//   const records = await SentMail.find().sort({ createdAt: -1 }).limit(20);
//   res.json(records);
// });

// app.listen(8000, () => {
//     console.log(`Server listening on port`);
// });








import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// ===== MongoDB =====
mongoose.connect(
  'mongodb+srv://naveenbharathi:123@bulkmail.3rwxgbg.mongodb.net/passkey?retryWrites=true&w=majority&appName=bulkmail'
)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Gmail credentials
const credentials = mongoose.model('credentials', {}, 'bulkmail');

// History schema
const sentMailSchema = new mongoose.Schema({
  subject: String,
  body: String,
  recipients: [String],
  sentCount: Number,
  failed: [String],
  createdAt: { type: Date, default: Date.now }
});
const SentMail = mongoose.model('SentMail', sentMailSchema);

// ===== Routes =====

// Send Mail
app.post('/SendMail', async (req, res) => {
  const { subject, msg, emailList } = req.body;
  if (!subject || !msg || !emailList?.length) {
    return res.status(400).json({ error: 'Missing subject, message, or emails' });
  }

  try {
    const creds = await credentials.findOne();
    if (!creds) return res.status(500).json({ error: 'No SMTP credentials found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: creds.toJSON().user, pass: creds.toJSON().pass },
    });

    const failed = [];
    for (const email of emailList) {
      try {
        await transporter.sendMail({
          from: creds.user,
          to: email,
          subject,
          text: msg,
        });
        console.log('Email sent to:', email);
      } catch (err) {
        console.error('Failed to send to', email, err);
        failed.push(email);
      }
    }

    // Save history
    await SentMail.create({
      subject,
      body: msg,
      recipients: emailList,
      sentCount: emailList.length - failed.length,
      failed,
    });

    res.json({
      success: true,
      sent: emailList.length - failed.length,
      failed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error sending emails' });
  }
});

// Get Email History
app.get('/history', async (req, res) => {
  const records = await SentMail.find().sort({ createdAt: -1 }).limit(50);
  res.json(records);
});

// 🔴 NEW: Delete a history record
app.delete('/history/:id', async (req, res) => {
  try {
    await SentMail.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.listen(8000, () => {
  console.log(`Server listening on port 8000`);
});