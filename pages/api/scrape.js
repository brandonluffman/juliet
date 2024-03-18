const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(cors());

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
};

app.get('/', (req, res) => {
    res.json({ Hello: 'World' });
});

app.get('/search/google/:query', async (req, res) => {
    const query = req.params.query;
    const url = `https://www.google.com/search?gl=us&q=${query}`;

    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
        const resultDivs = $('div.Gx5Zad.fP1Qef.xpd.EtOod.pkphOe');
        const results = [];

        resultDivs.each((i, div) => {
            const title = $(div).find('h3').text() || 'No title';
            const link = $(div).find('a').attr('href') || 'No link';
            const description = $(div).find('div.BNeawe.s3v9rd.AP7Wnd').text() || 'No description';

            results.push({ title, link, description });
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching Google search results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Repeat the same structure for '/search/reddit/:query' and '/search/youtube/:query' endpoints

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
