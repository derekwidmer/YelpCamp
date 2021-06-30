const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dpp2nfnez/image/upload/v1624906819/YelpCamp/nmrzm6nz7nnajlti1vmp.jpg',
                    filename: 'YelpCamp/nmrzm6nz7nnajlti1vmp'
                },
                {
                    url: 'https://res.cloudinary.com/dpp2nfnez/image/upload/v1624906819/YelpCamp/tgcvozvrbhmfmp8lddvz.jpg',
                    filename: 'YelpCamp/tgcvozvrbhmfmp8lddvz'
                }],
            description: 'This is a campground to camp in with camping friends.',
            price,
            author: '60d94ae2bd6f234866158526', //My author id
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})