const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

const app = express();

let movies = [
  {
    id: 1,
    imageUrl:'',
    title: 'Interstellar',
    year: '2014',
    genre: 'Sci-fi',
    director: {
      name: 'Christopher Nolan',
      bio: 'British-American',
      birth: 'July 30, 1970',
      death: '-'
    }
  },
  {
    id: 2,
    imageUrl:'',
    title: 'The Intern',
    year: '2015',
    genre: 'Comedy',
    director: {
      name: 'Nancy Meyers',
      bio: 'American',
      birth: 'December 8, 1949)',
      death: '-'
    }
  },
  {
    id: 3,
    imageUrl:'',
    title: 'The Devil Wears Prada',
    year: '2006',
    genre: 'Comedy',
    director: {
      name: 'David Frankel',
      bio: 'American',
      birth: 'April 2, 1959',
      death: '-'
    }
  },
  {
    id: 4,
    imageUrl:'',
    title: 'About Time',
    year: '2013',
    genre: 'Romance',
    director: {
      name: 'Richard Curtis',
      bio: 'New Zealand-British',
      birth: 'November 8, 1956',
      death: '-'
    }
  },
  {
    id: 5,
    imageUrl:'',
    title: 'The Da Vinci Code',
    year: '2006',
    genre: 'Thriller',
    director: {
      name: 'Ron Howard',
      bio: 'American',
      birth: 'March 1, 1954',
      death: '-'
    }
  },
  {
    id: 6,
    imageUrl:'',
    title: 'The A Team',
    year: '2010',
    genre: 'Action',
    director: {
      name: 'Joe Carnahan',
      bio: 'American',
      birth: 'May 9, 1969',
      death: '-'
    }
  },
  {
    id: 7,
    imageUrl:'',
    title: 'Bridesmaids',
    year: '2011',
    genre: 'Comedy',
    director: {
      name: 'Paul Feig',
      bio: 'American',
      birth: 'September 17, 1962',
      death: '-'
    }
  },
  {
    id: 8,
    imageUrl:'',
    title: 'Arrival',
    year: '2016',
    genre: 'Sci-fi',
    director: {
      name: 'Denis Villeneuve',
      bio: 'Canadian',
      birth: 'October 3, 1967 ',
      death: '-'
    }
  },
  {
    id: 9,
    imageUrl:'',
    title: 'Her',
    year: '2013',
    genre: 'Romance',
    director: {
      name: 'Spike Jonze',
      bio: 'American',
      birth: 'October 22, 1969',
      death: '-'
    }
  },
  {
    id: 10,
    imageUrl:'',
    title: 'Fury',
    year: '2014',
    genre: 'Action',
    director: {
      name: 'David Ayer',
      bio: 'American',
      birth: 'January 18, 1968',
      death: '-'
    }
  },
];


let users = [
  {
    user_id: '1',
    username: 'careerfoundry',
    first_name: 'Career',
    last_name: 'Foundry',
    password: 'moviesapp',
    email: 'careerfoundry@gmail.com',
    favorites: []
  }
];



// _____middleware_____
app.use(morgan('common'));
app.use(express.static('public')); // this helps navigate to http://127.0.0.1:8080/documentation.html”
app.use(bodyParser.json());





// _____movies request_____
app.get('/movies', (req, res) => {
  if ('genre' in req.query) {
    res.json(movies.filter((movie) => movie.genre === req.query.genre));
  } else {
  res.json(movies);
  }
});

app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

app.get('/movies/:genre', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.genre === req.params.genre;
  }));
});

app.get('/movies/directors/:name', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.director.name === req.params.name;
  }));
});



// _____user requests_____
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.username) {
    const message = 'Missing username in request body!';
    res.status(404).send(message);
  }else {
    newUser.user_id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

app.get('/users/:username', (req, res) => {
  res.json(users.find((user) => {
    return user.username === req.params.username
  }));
});

app.put('/users/:id', (req, res) => {
  let user = users.find((user) => {
    return user.user_id === req.params.id
  });

  if (user && req.body.username) {
      user.username = req.body.username;
      res.status(201).send(`Succesfully updated`);
    } else if (user && req.body.first_name) {
      user.first_name = req.body.first_name;
      res.status(201).send(`Succesfully updated`);
    } else if (user && req.body.last_name) {
      user.last_name = req.body.last_name;
      res.status(201).send(`Succesfully updated`);
    } else if (user && req.body.password) {
      user.password = req.body.password;
      res.status(201).send(`Succesfully updated`);
    } else if (user && req.body.email) {
      user.email = req.body.email;
      res.status(201).send(`Succesfully updated`);
    } else if (Object.keys(req.body).length === 0) {
      res.status(404).send('Empty categories not allowed.');
    } else {
      res.status(404).send(`This user ID does not exist.`);
    }

});

app.post('/users/:id/favorites/:movie', (req, res) => {
  let user = users.find((user) => {
    return user.user_id === req.params.id
  });
  let favMovie = movies.find((movie) => {
    return movie.title === req.params.movie
  });

  if (user && favMovie) {
    user.favorites.push(favMovie.title);
    // Insert a function that post a movie to the user's favorites (which sould be an object)
    res.status(201).send('Movie successfully added to your favorites!');
  } else {
    res.status(404).send('Valid movie required.');
  }
});

app.delete('/users/:id', (req, res) => {
  let user = users.find((user) => {
    return user.user_id === req.params.id
  });

  if (user) {
    users = users.filter((obj) => {
      return obj.user_id !== req.params.id
    });
    res.status(201).send('User ' + req.params.id + ' was deleted.');
  }
});



app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
