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
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get('/', async (req, res) => {
  const shorturls = await shorturl.find();
  res.render('index', {
    shorturls: shorturls,
  });
});

app.post('/shorturls', async (req, res) => {
  await shorturl.create({
    full: req.body.fullUrl,
  });
  res.redirect('/');
});

// eslint-disable-next-line consistent-return
app.get('/:shorturl', async (req, res) => {
  const shorturlValue = await shorturl.findOne({
    short: req.params.shorturl,
  });
  if (shorturlValue == null) return res.sendStatus(404);

  shorturlValue.clicks += 1;
  shorturlValue.save();

  res.redirect(shorturlValue.full);
});

// eslint-disable-next-line prettier/prettier
app.listen(process.env.PORT || 4000);