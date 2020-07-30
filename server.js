const express = require('express');
const mongoose = require('mongoose');
const shorturl = require('./models/shorturl');

const app = express();

mongoose.connect(
  // eslint-disable-next-line prettier/prettier
  'mongodb://admin:admin@cluster0-shard-00-00-ppij2.mongodb.net:27017,cluster0-shard-00-01-ppij2.mongodb.net:27017,cluster0-shard-00-02-ppij2.mongodb.net:27017/URLShortener?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Express uses jade as its default template engine ,so we would have to tell it to use ejs instead
app.set('view engine', 'ejs');

// express.urlencode : This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser
// 
app.use(
  express.urlencoded({
    extended: false,
  })
);

// This is used inorder to show the URL inside the table in the page  
app.get('/', async (req, res) => {
  const shorturls = await shorturl.find();
  res.render('index', { // res.render() function is used to render a view and sends the rendered HTML string to the client.
    shorturls: shorturls, // These shorturls are passed into the view
  });
});

app.post('/shorturls', async (req, res) => {
  await shorturl.create({
    full: req.body.fullUrl,
  });
  res.redirect('/'); // Redirects the user to the homepage - index.ejs
});

// This route is created in order to redirect to the webpage when the shortened version of the original url is clicked !!!

app.get('/:shorturl', async (req, res) => {
  const shorturlValue = await shorturl.findOne({
    short: req.params.shorturl,
  });
  if (shorturlValue == null) return res.sendStatus(404);

  shorturlValue.clicks += 1; // Calculates the total no of clicks in the shortened version of the original url
  shorturlValue.save();

  res.redirect(shorturlValue.full); // Redirects to the webpage
});

// eslint-disable-next-line prettier/prettier
app.listen(process.env.PORT || 4000);