const express = require("express");
const app = express();
const port = 8080;

const routektp = require("./router/ktp.js");
//res.send('halo lovedek')

//app.listen(port, () => {
//console.log(`aplikasi berjalan di http://locallhost:${port}`);
//});

const bodyPs = require("body-parser");
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

app.use("/api/ktp", routektp);

app.listen(port, () => {
  console.log(`aplikasi berjalan di http::/localhost:${port}`);
});
