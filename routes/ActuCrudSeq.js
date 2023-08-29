const cors = require('cors');

const path =require('path')
const express=require('express')
const bodyParser= require('body-parser')
const nodemailer = require('nodemailer');
const connection=require('../DbConnect.js')

const app=express();

//const UtilisateurClient = require('../models/UtilisateurClient');
const { UtilisateurClient } = require("../models");
const router = express.Router();

app.set('views', path.join(__dirname, '..', 'views'));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use(cors())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'albertonambinina@gmail.com',
      pass: 'zhmvchcritxxsyxc'
    }
  });

/*function sendVerificationEmail(email, code) {
    const mailOptions = {
      from: transporter.user,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

router.post('/inscription', (req, res) => {
    const { login, password,email,tel } = req.body;
    const verificationCode = '0404k';//generateVerificationCode(); // Implement your code generation logic
  
    const sql = 'INSERT INTO utilisateurclient (login, password, email,tel) VALUES (?, ?, ?,?)';
    connection.query(sql, [login,password, email, tel], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error registering user');
      } else {
        sendVerificationEmail(email, verificationCode);
        res.status(200).send('User registered successfully');
      }
    });
});*/
function generateVerificationCode(userId) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 5; // 4 digits + 1 letter
    let code = '';
  
    for (let i = 0; i < codeLength - 1; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    // Add the user's ID to the end of the code
    code += userId;
  
    return code;
  }
function sendVerificationEmail(email, code) {
    var body = '<h1>Bonjour,</h1><p>Nous avons reçu une demande de création de compte pour cette adresse e-mail.</p><p> Pour compléter la création de votre compte, veuillez entrer le code de confirmation suivant :'+ code +'sur notre site web.</p> \n'
    + '<p>Merci d\'avoir utiliser notre service.</p><p>Cordialement,</p> <p>L\'équipe de notre service</p>';
    const mailOptions = {
        from: transporter.user,
        to: email,
        subject: 'Email de confirmation de création de compte',
        html: body
    };
    
    const rep = {}
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        rep = {
            message: 'KO',
            erreur: 'Erreur lors de l\'envoi de l\'email de confirmation',
            value:null,
            code: 500
        };
      } else {
        console.log('Email sent: ' + info.response);
        rep = {
            message: 'OK',
            value: null,
            code: 200
        };
      }
    });
    return rep;
}

router.post('/inscription', async (request, response) => {
    const { login, password,email,tel } = request.body;
    try { 
        // Vérifiez si l'utilisateur existe déjà
        const checkUserSql = 'SELECT * FROM utilisateurclient WHERE email = ?';
        connection.query(checkUserSql, [email], (checkErr, checkResults) => {
            if (checkErr) {
                console.error(checkErr);
                res.status(500).send('Error checking user');
            } else if (checkResults.length > 0) {
                const rep = {
                    message: 'KO',
                    erreur: 'L\'email appartient déjà à un compte existant.',
                    value: null,
                    code: 404
                };
                response.json(rep);
            }
            
            else {
                const sql = 'INSERT INTO utilisateurclient (login, password, email, tel) VALUES (?, ?, ?, ?)';
                connection.query(sql, [login, password, email, tel], async (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error registering user');
                    } else {
                        try {
                            const existingUser = await UtilisateurClient.findOne({
                                where: {
                                email: email
                                }
                            });
                            const verificationCode=generateVerificationCode(existingUser.id);
                            const reponse = sendVerificationEmail(email, verificationCode);
                            
                            if (reponse.message === 'KO') {
                                UtilisateurClient.destroy({ where: { email: email } });
                            }
                            
                            // res.status(200).send('User registered successfully');
                            response.json(reponse);
                        } catch (error) {
                            console.error(error);
                            res.status(500).send('Error during registration process');
                        }
                    }
                });
              }
        });
    } catch (err) {
        console.error(err);
        const rep = {
            message: 'KO',
            value: 'Erreur lors de l\'inscription',
            code: 500
        };
        response.json(rep);
    }
});

  module.exports = router;