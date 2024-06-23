const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../Models/userModel.js');
function addRandom(str){
  const randomString = Math.random().toString(36).substring(2, 5); 
  str += randomString;
}

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/google/callback",
  passReqToCallback: true,
},
async (request, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.email});
    if (!user) {
      let username = profile.displayName; 
      let userExists = await User.findOne({ username }); 


      while (userExists) {
          addRandom(username);
          userExists = await User.findOne({ username });
      }
      user = new User({ email: profile.email,username, name:profile.displayName,profilePicture:profile.picture });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
