const cors = require('cors');

const path =require('path')
const express=require('express')
const bodyParser= require('body-parser')
const app=express();
const connection=require('../DbConnect.js')
const router = express.Router();

app.set('views', path.join(__dirname, '..', 'views'));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use(cors())

router.get('/listeProd', (req, res) => {
  let sqlString="SELECT * FROM actualite";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/listeProdRecent', (req, res) => {
    let sqlString="SELECT * FROM actualite order by id";
    let query= connection.query(sqlString,(err,rows) => {
      if(err) return res.json(err);
      return res.json(rows);
    });
  });

router.post('/addProd', (req, res) => {
  let data={titre:req.body.titre,article:req.body.article,statut:req.body.statut};
  let sqlString="INSERT INTO actualite(titre,article,statut)values('"+data.titre+"','"+data.article+"',"+data.statut+")";
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("add successfuly");
  });
});

router.put('/updateProd/:id', (req, res) => {
  const idActu=req.params.id;
  let data={title:req.body.title,article:req.body.article,statut:req.body.statut};
  let sqlString="UPDATE actualite SET titre='"+data.title+"', article='"+data.article+"', statut="+data.statut+" where id="+idActu;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("update successfuly");
  });
});

router.delete('/deleteProd/:id', (req, res) => {
  const idActu=req.params.id;
  let sqlString="DELETE FROM actualite where id="+idActu;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("delete successfuly");
  });
});

module.exports = router;