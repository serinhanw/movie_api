const express = require('express'),
      morgan = require('morgan');

const app = express();

let topTenMovies = [
  {
    title: 'Interstellar',
    year: '2014',
    genre: 'Sci-fi/Adventure'
  },
  {
    title: 'The Intern',
    year: '2015',
    genre: 'Comedy/Comedy-drama'
  },
  {
    title: 'The Devil Wears Prada',
    year: '2006',
    genre: 'Comedy/Romance'
  },
  {
    title: 'About Time',
    year: '2013',
    genre: 'Romance/Fantasy'
  },
  {
    title: 'The Da Vinci Code',
    year: '2006',
    genre: 'Mystery/Thriller'
  },
  {
    title: 'The A Team',
    year: '2010',
    genre: 'Action/Adventure'
  },
  {
    title: 'Bridesmaids',
    year: '2011',
    genre: 'Comedy/Romance'
  },
  {
    title: 'Arrival',
    year: '2016',
    genre: 'Sci-fi/Thriller'
  },
  {
    title: 'Her',
    year: '2013',
    genre: 'Romance/Sci-fi'
  },
  {
    title: 'Fury',
    year: '2014',
    genre: 'War/Action'
  },
];

// middleware
app.use(morgan('common'));
app.use(express.static('public')); // this helps navigate to http://127.0.0.1:8080/documentation.html”



app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

app.get('/', (req, res) => {
  res.send('Top 10 Movies (in no particular order)');
});



app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
