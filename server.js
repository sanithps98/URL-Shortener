const express = require('express');
const mongoose = require('mongoose');
const shorturl = require('./models/shorturl');
const app = express();

mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00-ppij2.mongodb.net:27017,cluster0-shard-00-01-ppij2.mongodb.net:27017,cluster0-shard-00-02-ppij2.mongodb.net:27017/URLShortener?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true
});

// Express uses jade as its default template engine ,so we would have to tell it to use ejs instead
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}))

app.get('/', async (req,res) => {
    const shorturls = await shorturl.find()
    res.render('index', { shorturls: shorturls });
});

app.post('/shorturls', async (req,res) => {
    await shorturl.create({ full: req.body.fullUrl})
    res.redirect('/')
});

app.get('/:shorturl', async (req, res) =>{
    const shorturl_value = await shorturl.findOne({ short : req.params.shorturl })
    if(shorturl_value == null) return res.sendStatus(404)

    shorturl_value.clicks++
    shorturl_value.save()

    res.redirect(shorturl_value.full)
})

app.listen(process.env.PORT || 4000); 