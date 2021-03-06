const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

/**
 * Creates an Express instance.
 * Declares a new variable to encapsulate the Express's functionality.
*/
const app = express();

// const port = process.env.PORT || 8080;


// Connects Mongoose to the created database.
// mongoose.connect('mongodb://localhost:27017/StubzDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(morgan('combined')); //common
app.use(express.static('public')); // this helps navigate to http://127.0.0.1:8080/documentation.html”
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //false

const cors = require('cors');
/**
 * To restrict the access to the API from different domains:
 */
let allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:4200',
  'https://stubz.herokuapp.com',
  'https://stubz.netlify.app',
  'https://serinhanw.github.io',
  'https://serinhanw.github.io/stubz-Angular-client',
  'https://serinhanw.github.io/stubz-Angular-client/welcome'
  /*, '*'*/];
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

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
const { check, validationResult } = require('express-validator');

/**
 * Get the welcome page
 * @method GET
 * @param {string} endpoint - endpoint to load the welcome page. "url/"
 * @returns {object} - returns the welcome page
 */
app.get('/', (req, res) => {
  res.send('Welcome to Stubz!');
});

/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch movies. "url/movies"
 * @returns {object} - returns the movie object
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Movies.find().populate('Genre Director')
  Movies.find({}).populate({ path: 'Genre', model: 'Genre' }).populate({ path: 'Director', model: 'Director' })
    .then((movies) => {
      res.status(201).json(movies);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get movies by title
 * @method GET
 * @param {string} endpoint - endpoint - fetch movies by title
 * @param {string} title - is used to get specific movie "url/movies/:title"
 * @returns {object} - returns the movie with specific title
 */
app.get('/movies/title/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title }).populate('Genre Director')
    .then((movie) => {
      res.json(movie);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * Get genre by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch genre by id
 * @param {string} genreID - is used to get specific genre "url/genres/:genreID"
 * @returns {object} - returns a specific genre
 */
app.get('/movies/genre/:genreID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ Genre: req.params.genreID })
    .then((movies) => {
      res.json(movies);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get all genres
 * @method GET
 * @param {string} endpoint - endpoint to fetch genres. "url/genres"
 * @returns {object} - returns the genre object
 */
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genres) => {
      res.json(genres);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get genre by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch genre by name
 * @param {string} name - is used to get specific genre "url/genres/:name"
 * @returns {object} - returns a specific genre
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ 'Name': req.params.name })
    .then((genre) => {
      res.json(genre);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get all directors
 * @method GET
 * @param {string} endpoint - endpoint to fetch directors. "url/directors"
 * @returns {object} - returns the directors object
 */
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



/**
 * Get director by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch director by name
 * @param {string} name - is used to get specific director "url/directors/:name"
 * @returns {object} - returns a specific director
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.name })
    .then((director) => {
      res.json(director);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get all users
 * @method GET
 * @param {string} endpoint - endpoint to fetch users. "url/users"
 * @returns {object} - returns the users object
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Add user
 * @method POST
 * @param {string} endpoint - endpoint to add user. "url/users"
 * @param {string} username - choosen by user
 * @param {string} FirstName - user's first name
 * @param {string} LastName - user's last name
 * @param {string} password - user's password
 * @param {string} email - user's email address
 * @param {string} Birthday - user's birthday
 * @returns {object} - new user
 */
app.post('/users', [
  check('FirstName', 'first name is required').not().isEmpty(),
  check('username', 'username is required').isLength({ min: 5 }),
  check('username', 'username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'password is required').not().isEmpty(),
  check('email', 'email does not appear to be valid').isEmail()
], (req, res) => {
  //check validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ username: req.body.username })
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
          .then((user) => { res.status(201).json(user) })
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


/**
 * Get user by username
 * @method GET
 * @param {string} endpoint - endpoint - fetch user by username
 * @param {string} username - is used to get specific user "url/users/:username"
 * @returns {object} - returns a specific user
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Update user by username
 * @method PUT
 * @param {string} endpoint - endpoint to add user. "url/users/:username"
 * @param {string} username - required
 * @param {string} FirstName - user's new first name
 * @param {string} LastName - user's new last name
 * @param {string} password - user's new password
 * @param {string} email - user's new email address
 * @param {string} Birthday - user's new birthday
 * @returns {string} - returns success/error message
 */
app.put('/users/:username', [
  check('username', 'Username is required.').isLength({
    min: 5
  }),
  check('username', 'Username contains non alphanumerical characters.').isAlphanumeric(),
  check('password', 'Password is required.').not().isEmpty(),
  check('email', 'Email adress is not valid.').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.password);
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  Users.findOneAndUpdate({ username: req.params.username }, {
    $set:
    {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }, //Thie line makes sure that the updated document is returned
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


/**
 * Add movie to favorites
 * @method POST
 * @param {string} endpoint - endpoint to add movies to favorites
 * @param {string} username, movieID - both are required
 * @returns {string} - returns success/error message
 */
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favorites: req.params.movieID }
  },
    { new: true },
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

/**
 * Delete movie from favorites
 * @method DELETE
 * @param {string} endpoint - endpoint to remove movies from favorites
 * @param {string} username, movieID - both are required
 * @returns {string} - returns success/error message
 */
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favorites: req.params.movieID }
  },
    { new: true },
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

/**
 * Delete user by username
 * @method DELETE
 * @param {string} endpoint - endpoint - delete user by username
 * @param {string} Username - is used to delete specific user "url/users/:username"
 * @returns {string} success/error message
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
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


//---------------------error handling------------
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
