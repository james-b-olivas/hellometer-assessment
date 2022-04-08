const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/csv', (req, res) => {
  let data = [];
  fs.createReadStream('location27_march22-29.csv')
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      // console.log('Processed CSV data:', data);
      res.send(data);
    });
});

app.post('/api/csv', (req, res) => {
  console.log(req);
  res.send(200);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});