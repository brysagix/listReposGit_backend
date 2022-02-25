require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2/promise');
const port = 3001;
const bluebird = require('bluebird');
const e = require('express');

let connection; //almacena la conexion a la Db
app.use
//Configura servidor para recibir forma JSON
app.use(express.json());
app.use(cors({ origin: true }))
app.set('port',process.env.PORT || port)
//Inician End points Alvaro




app.get("/get-favoritos", async (request,response) =>{
    const [rows, fields] = await connection.execute("SELECT * from reposFavor WHERE esFavor=1");
    response.json({data:rows});
});


app.get("/get-Todos", async (request,response) =>{
  const [rows, fields] = await connection.execute("SELECT * from reposFavor");
  response.json({data:rows});
});




app.post("/add-favorito", async (req, resp) => {

  const nameFavorito = req.body;
  
  try {
    await connection.execute(
      `UPDATE reposFavor SET esFavor=1 WHERE nombreRepo='${nameFavorito.nombreRepo}'`
      );
    
    console.log(nameFavorito.nombreRepo);

    resp.json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
}
);

app.post("/add-Nofavorito", async (req, resp) => {

  const nameFavorito = req.body;
  
  try {
    await connection.execute(
      //`INSERT INTO reposFavor(nombreRepo) VALUES('${nameFavorito.nombreRepo}')`

      `insert into reposFavor (nombreRepo)
      Select '${nameFavorito.nombreRepo}' Where not exists(select * from reposFavor where nombreRepo='${nameFavorito.nombreRepo}')`


                  );
    
    console.log(nameFavorito.nombreRepo);

    resp.json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
}
);


app.post("/search-repo", async (req, resp) => {

  const nameFavorito = req.body;
  
  try {

    const [rows, fields] = await connection.execute(
      `SELECT esFavor from reposFavor WHERE nombreRepo='${nameFavorito.nombreRepo}'`
      );
    
    //console.log(nameFavorito.nombreRepo);
    console.log(rows[0]);
    resp.json(rows[0]);

  } catch (error) {
    console.log(error);
  }
}
);



app.post("/delete-favorito", async (req, resp) => {
  //const [productDescript, productCost, productState] = req.body;
  //Destructuración

  const nameNoFavorito = req.body;
  console.log(nameNoFavorito.nombreRepo);


  try {
    const [rows, fields]= await connection.execute(
      `DELETE FROM reposFavor WHERE nombreRepo='${nameNoFavorito.nombreRepo}';`    
      );

  resp.json(rows);
  console.log(rows);
  
  } catch (error) {
    console.log(error);
  }
}
);



app.listen(app.get('port'), async() =>{
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password:  process.env.DB_PASSWORD,
        database:  process.env.DB_DATABASE,
        Promise: bluebird
    }
    );
    console.log("Servidor running on port: " + port);
});

