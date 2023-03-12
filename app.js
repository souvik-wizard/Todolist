const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let newDb = async () => {
  await mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to DB");
}
newDb();

const itemsSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Item = mongoose.model("Item", itemsSchema);

app.get("/", async function (req, res) {
  const items= await Item.find();
  res.render("list", { Today:"To Do List",newListItems: items });

});

app.post("/",async function (req, res) {
  const newItem  = req.body.newItem;
  const item = new Item({
    name: newItem
  });
  await item.save();
  res.redirect("/");
});

app.post("/delete",async function (req, res) {
  const checkedItemId = req.body.checkbox;
  await Item.findByIdAndDelete(checkedItemId);
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 80, function () {
  console.log("Server started.");
});
