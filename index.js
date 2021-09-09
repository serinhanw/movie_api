const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

const app = express();

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

mongoose.connect('mongodb://localhost:27017/StubzDB', {useNewUrlParser: true, useUnifiedTopology: true});

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


// _____middleware_____
app.use(morgan('common'));
app.use(express.static('public')); // this helps navigate to http://127.0.0.1:8080/documentation.html”
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.get('/', (req, res) => {
  res.send('Welcome to Stubz!');
});


// _____get all movies_____
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// _____get a movie by title_____
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.title})
  .then((movie) => {
    res.json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


// _____get a movie by genre_____
 app.get('/movies/genre/:genreID', passport.authenticate('jwt', {session: false}), (req, res) => {
   Movies.find({Genre: req.params.genreID})
   .then((movies) => {
     res.json(movies);
   }).catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
 });



// _____get a director by name_____
app.get('/directors/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Directors.findOne({Name: req.params.name})
  .then((director) => {
    res.json(director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// _____get all users_____
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// _____add a user_____
/* expected JSON format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
} */
app.post('/users', (req, res) => {
  Users.findOne({username: req.body.username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.username + 'already exists');
    } else {
      Users.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user)})
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});


// _____get a user by username_____
app.get('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({username: req.params.username})
  .then((user) => {
    res.json(user);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// _____update a user's info, by username_____
/* expected JSON format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({username: req.params.username}, {$set:
  {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    Birthday: req.body.Birthday
  }
},
{new: true}, //Thie line makes sure that the updated document is returned
(err, updatedUser) => {
  if (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
}
);
});


// _____add/delete a movie to a user's favorites_____
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({username: req.params.username}, {
    $push: {favorites: req.params.movieID}
  },
  {new:true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  }
);
});

app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({username: req.params.username}, {
    $pull: {favorites: req.params.movieID}
  },
  {new:true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  }
);
});

// _____delete a user by username_____
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({username: req.params.username})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.username + ' was not found.');
    } else {
      res.status(200).send(req.params.username + ' was deleted.');
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


// ___________________

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
