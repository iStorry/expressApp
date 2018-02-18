const express = require('express');
const app = express();
const user = require("./User");
const folio = require("./Portfolio")

app.use("/portfolio/", folio.folioRouter);
app.use("/user/", user.userRouter);

app.listen(3000, function(){
    console.log("listening 3000");
})