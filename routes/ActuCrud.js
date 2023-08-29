const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

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

/*router.get('/', (req, res) => {
  let sqlString="SELECT * FROM actualite";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) throw err;
    res.render('index',{
      title: 'Test voalohany ejs ambadika',
      articles: rows
    });
  });
});*/

/*router.get('/listes', (req, res) => {
  let sqlString="SELECT * FROM actualite";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});*/

router.get('/listes', (req, res) => {
  let sqlString="SELECT * FROM Produit";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/listesCat', (req, res) => {
  let sqlString="SELECT * FROM Categorie";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/add', (req, res) => {
  res.render('AddArticle',{
    title: 'Ajouter Article ejs ambadika'
  });
});

/*router.post('/addBase', (req, res) => {
  let data={title:req.body.title,article:req.body.article,statut:req.body.statut};
  let sqlString="INSERT INTO actualite(titre,article,statut)values('"+data.title+"','"+data.article+"',"+data.statut+")";
  let query= connection.query(sqlString,(err,results) => {
    if(err) throw err;
    res.redirect('/ActuCrud/');
  });
});*/

router.post('/addBase', (req, res) => {
  let data={titre:req.body.titre,article:req.body.article,statut:req.body.statut};
  let sqlString="INSERT INTO actualite(titre,article,statut)values('"+data.titre+"','"+data.article+"',"+data.statut+")";
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("add successfuly");
  });
});


////////////////update\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/listesPanier', (req, res) => {
  let sqlString="SELECT Panier.id as id,idActualite,quantite,prixQnte,titre,article FROM Panier join actualite on Panier.idActualite=actualite.id";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/listesPanier/:idActualite', (req, res) => {
  const idActualite=req.params.idActualite;
  let sqlString="SELECT id,titre,article,statut as prixQnte  FROM actualite where id="+idActualite;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/addPanier/:idActualite/:prixQnte', (req, res) => {
  const idActualite=req.params.idActualite;
  const prixQnte=req.params.prixQnte;
  let sqlString="INSERT INTO Panier(idActualite,prixQnte)values("+idActualite+","+prixQnte+")";
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("add successfuly");
  });
});

router.delete('/deletePanier/:id', (req, res) => {
  const idPanier=req.params.id;
  let sqlString="DELETE FROM Panier where id="+idPanier;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("delete successfuly");
  });
});

router.put('/updatePanier/:id', (req, res) => {
  const idActu=req.params.id;
  let data={quantite:req.body.quantite,prixQnte:req.body.prixQnte};
  let sqlString="UPDATE Panier SET quantite="+data.quantite+", prixQnte="+data.prixQnte+" where id="+idActu;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("update successfuly");
  });
});

router.delete('/deleteAllPan', (req, res) => {
  let sqlString="DELETE FROM Panier";
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("delete successfuly");
  });
});

router.get('/listesPg', (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page par défaut est 1
  const perPage = parseInt(req.query.perPage) || 10; // Nombre d'éléments par page par défaut est 10

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  let sqlString = `SELECT * FROM Produit LIMIT ${startIndex}, ${perPage}`;
  let query = connection.query(sqlString, (err, rows) => {
    if (err) return res.json(err);

    // Récupérer le nombre total d'éléments pour la pagination
    connection.query('SELECT COUNT(*) AS totalCount FROM Produit', (countErr, countRows) => {
      if (countErr) return res.json(countErr);

      const totalCount = countRows[0].totalCount;
      const totalPages = Math.ceil(totalCount / perPage);

      const response = {
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: perPage,
        totalCount: totalCount,
        data: rows
      };

      return res.json(response);
    });
  });
});

router.get('/listesProdCat/:idCat', (req, res) => {
  const idCat=req.params.idCat;
  let sqlString="SELECT * FROM Produit where idCategorie="+idCat;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './client/public/img'); // Dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const isImg=(req,file,cb)=>{
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }else{
    cb(null,Error("only img is allowed"))
  }
}

const upload = multer({ storage:storage,fileFilter:isImg });
router.post('/updateProduit/:id', upload.single('photo'), (req, res) => {
  const id=req.params.id;
  //console.log(req.file)
  let data={idCategorie:req.body.idCategorie,nomProduit:req.body.nomProduit,description:req.body.description,photo:req.file ? req.file.originalname : '',prixUnitaire:req.body.prixUnitaire};
  /*let sqlString = "UPDATE Produit SET idCategorie='" + data.idCategorie + "', nomProduit='" + data.nomProduit + "', description='" + data.description + "', photo='" + data.photo + "', prixUnitaire=" + data.prixUnitaire + " WHERE id=" + id;
  
  const filePath = `./client/public/img/${data.photo}`;
  if (fs.existsSync(filePath)) {
    return res.status(409).json({ message: 'Le fichier existe déjà' });
  }

  let query = connection.query(sqlString,(err, results) => {
    if (err) {
      return res.json(err);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Supprimer le fichier existant après la mise à jour
    }

    return res.status(200).json({ message: 'Mise à jour réussie' });
  });*/
  if(!data.idCategorie || !data.nomProduit || !data.description || !data.photo || !data.prixUnitaire)
  {
    res.json({status:422,message:"fill all the details"})
  }
  try{
    let sqlString = "UPDATE Produit SET idCategorie=" + data.idCategorie + ", nomProduit='" + data.nomProduit + "', description='" + data.description + "', photo='" + data.photo + "', prixUnitaire=" + data.prixUnitaire + " WHERE id=" + id;
    let query = connection.query(sqlString,(err, results) => {
      if (err) {
        res.json(err);
      }else{
        console.log("data updated")
        res.json({status:201,data:req.body})
      }
    })
  }catch(error){
    res.json({status:422,error})
  }

  // Traitez le fichier téléchargé ici
  //return res.status(200).json({ message: 'Fichier téléchargé avec succès' });
});
////////////////update\\\\\\\\\\\\\\\\\\\\\\\\


/*router.get('/update/:idActu', (req, res) => {
  const idActu=req.params.idActu;
  let sqlString="SELECT * FROM actualite where id="+idActu;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) throw err;
    res.render('UpdateArticle',{
      title: 'Update Actu ejs ambadika',
      articles: rows[0]
    });
  });
});

router.post('/updateBase', (req, res) => {
  let data={title:req.body.title,article:req.body.article,statut:req.body.statut,idActu:req.body.idActu};
  let sqlString="UPDATE actualite SET titre='"+data.title+"', article='"+data.article+"', statut="+data.statut+" where id="+data.idActu;
  let query= connection.query(sqlString,(err,results) => {
    if(err) throw err;
    res.redirect('/ActuCrud/');
  });
});*/
router.put('/updateBase/:id', (req, res) => {
  const idActu=req.params.id;
  let data={title:req.body.title,article:req.body.article,statut:req.body.statut};
  let sqlString="UPDATE actualite SET titre='"+data.title+"', article='"+data.article+"', statut="+data.statut+" where id="+idActu;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("update successfuly");
  });
});

/*router.post('/deleteBase', (req, res) => {
  let data={idActu:req.body.idActu};
  let sqlString="DELETE FROM actualite where id="+data.idActu;
  let query= connection.query(sqlString,(err,results) => {
    if(err) throw err;
    res.redirect('/ActuCrud/');
  });
});*/
router.delete('/deleteBase/:id', (req, res) => {
  const idActu=req.params.id;
  let sqlString="DELETE FROM actualite where id="+idActu;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("delete successfuly");
  });
});

module.exports = router;