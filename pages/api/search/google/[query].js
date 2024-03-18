// pages/api/search/google.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { query } = req.query;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  const url = `https://www.google.com/search?gl=us&q=${query}`;
  const response = await fetch(url, { headers });
  const html = await response.text();
  const $ = cheerio.load(html);

  const resultDivs = $('div.Gx5Zad.fP1Qef.xpd.EtOod.pkphOe');
  const results = [];

  const extractUrl = (link) => {
    const urlParams = new URLSearchParams(link.split('?')[1]);
    return urlParams.get('url');
  };

//   resultDivs.each((i, div) => {
//     const title = $(div).find('h3').text() || 'No title';
//     const link = $(div).find('a').attr('href') || 'No link';
//     const description = $(div).find('div.BNeawe.s3v9rd.AP7Wnd').text() || 'No description';
  
//     // Extract the domain title
//     const domainTitle = $(div).find('div.BNeawe.UPmit.AP7Wnd').text().split(' › ')[0] || 'Unknown';
  
//     // Extract the favicon src
//     const faviconSrc = $(div).find('img').attr('src') || 'No favicon';
  
//     results.push({ title, link, description, domainTitle, faviconSrc });
//   });

resultDivs.slice(0, 3).each((i, div) => {
    const title = $(div).find('h3').text() || 'No title';
    const link = $(div).find('a').attr('href') || 'No link';
    const description = $(div).find('div.BNeawe.s3v9rd.AP7Wnd').text() || 'No description';
  
    // Extract the domain from the URL
    const url = new URL(extractUrl(link) || 'https://example.com');
    const domain = url.hostname;
  
    // Construct the favicon URL by appending /favicon.ico to the domain
    const faviconSrc = `https://${domain}/favicon.ico`;
  
    results.push({ title, link, description, faviconSrc });
  });

  res.status(200).json(results);
}
