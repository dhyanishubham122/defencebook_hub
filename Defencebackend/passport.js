const passport=require('passport');
const User=require('./models/User');
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const jwt=require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

passport.use(
    new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:process.env.GOOGLE_REDIRECT_URI
    },
    async(accesstoken,refreshtoken,profile,done)=>{
        console.log("googleprofile:",profile);
        // return done(null,profile);
        try {
            let user=await User.findOne({email: profile.emails[0].value});
            if(!user){
                user=new User({
                    username:profile.displayName,
                    email:profile.emails[0].value,
                    password:profile.id
                })
                await user.save();
            }
            const token = jwt.sign(
                { id: user._id, name: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );
              console.log("google token:",token);
              return done(null, { user, token });
        } catch (error) {
            return done(error, null); 
        }
    })
)
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  
  module.exports = passport;
