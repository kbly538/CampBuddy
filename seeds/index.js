const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/CampBuddy");

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to db");
});

db.on("error", (err) => {
  console.log(err);
  console.log("Connection error");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random()* 20) + 10;
    const camp = new Campground({
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis unde voluptates qui fuga illum fugiat molestiae, vel quod vitae eos eius quis consectetur nihil, nisi suscipit natus, consequatur asperiores nostrum. Odit nobis ipsam, facere distinctio quibusdam quo inventore repellendus atque consectetur suscipit debitis vel fugit harum earum culpa tempora quod nostrum non nihil voluptatem est nisi fuga blanditiis rerum. Molestias.",
      price
    });
    await camp.save();
  }
};

seedDb().then(() => {
  db.close();
});
