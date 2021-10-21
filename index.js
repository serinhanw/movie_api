const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

// const app = express();
//
// const port = process.env.PORT || 8080;

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

const app = express();

// const port = process.env.PORT || 8080;


// ___Atlas database connection___
// mongoose.connect('mongodb://localhost:27017/StubzDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});


// let auth = require('./auth')(app);
// const passport = require('passport');
// require('./passport');
// const {check, validationResult} = require('express-validator');


// ___Middleware___
app.use(morgan('combined')); //common
app.use(express.static('public')); // this helps navigate to http://127.0.0.1:8080/documentation.html”
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //false

// ___CORS___
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://stubz.herokuapp.com'/*, '*'*/];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// app.use(cors());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//___Authentication & Passport___
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
const {check, validationResult} = require('express-validator');


app.get('/', (req, res) => {
  res.send('Welcome to Stubz!');
});

// _____get all movies_____
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Movies.find().populate('Genre Director')
  Movies.find({}).populate({path:'Genre', model:'Genre'}).populate({path:'Director', model: 'Director'})
  .then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// _____get a movie by title_____
app.get(/*'/movies/:title'*/'/movies/title/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.title}).populate('Genre Director')
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

 //////////////
 app.get('/genres', passport.authenticate('jwt', {session: false}), (req, res) => {
   Genres.find()
   .then((genres) => {
     res.json(genres);
   }).catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
 });

 app.get('/genres/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
   Genres.findOne({ 'Name': req.params.name })
   .then((genre) => {
     res.json(genre);
   }).catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
 });

 app.get("/directors", passport.authenticate("jwt", { session: false }), (req, res) => {
   Directors.find()
     .then((directors) => {
       res.status(201).json(directors);
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send("Error: " + err);
     });
 });

 // app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
 //   Movies.findOne({ 'Director.Name': req.params.name })
 //     .then((director) => {
 //       res.status(200).json(director.Director);
 //     })
 //     .catch((err) => {
 //       console.error(err);
 //       res.status(500).send('Error: ' + err);
 //     });
 // });
///////////////



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
app.post('/users', [
  check('FirstName', 'first name is required').not().isEmpty(),
  check('username', 'username is required').isLength({min: 5}),
  check('username', 'username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'password is required').not().isEmpty(),
  check('email', 'email does not appear to be valid').isEmail()
], (req, res) => {
  //check validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({username: req.body.username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.username + 'already exists');
    } else {
      Users.create({
        FirstName: req.body.FirstName,
        username: req.body.username,
        password: hashedPassword,
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
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
