/**
* Imports mongoose package.
*/
const mongoose = require('mongoose');
/**
* Imports bcrypt
*/
const bcrypt = require('bcrypt');

/**
* Defines a schema for documents in the "movies" collection
*/
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  // Genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
  Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  // Director: [{type: mongoose.Schema.Types.ObjectId, ref: 'Director'}],
  Director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
  // Actors: [String],
  ImagePath: String,
  Featured: Boolean,
  Year: String
});

/**
* Defines a schema for documents in the "users" collection
*/
let userSchema = mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  Birthday: Date
});

/**
* hashes of submitted passwords
*/
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Compares submitted hashed passwords with the hashed passwords stored in the database
*/
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
* Defines a schema for documents in the "directors" collection
*/
let directorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: String,
  Birthyear: String
});

/**
* Defines a schema for documents in the "genres" collection
*/
let genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: String
});

/**
 * Creates models using schemas.
 */
let Movie = mongoose.model('Movie', movieSchema); //any titles you pass through will come out on the other side as lowercase and pluralized
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);

/**
 * Exports the models.
 */
module.exports.Movie = Movie; //import these models into your ???index.js??? file
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
