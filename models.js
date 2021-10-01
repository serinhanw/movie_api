const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
  Director: [{type: mongoose.Schema.Types.ObjectId, ref: 'Director'}],
  // Actors: [String],
  ImagePath: String,
  Featured: Boolean,
  Year: String
});

let userSchema = mongoose.Schema({
  FirstName: {type:String, required: true},
  LastName: {type:String},
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
  Birthday: Date
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

let directorSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Bio: String,
  Birthyear: String
});

let genreSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Description: String
});

let Movie = mongoose.model('Movie', movieSchema); //any titles you pass through will come out on the other side as lowercase and pluralized
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie; //import these models into your “index.js” file
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
