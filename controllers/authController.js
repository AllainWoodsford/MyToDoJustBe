const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const userQueries = require('../databaseRequests/user.queries.js');

const saltRounds = 10;
//Register User
const register = async (req, res) => {
    try {
        const userName = _.toLower(req.body.username).replaceAll(' ','');
        const password = req.body.password;

        //Find out if the userame exists in the Database already after removing spaces and toLower
        const user = await userQueries.findUser(userName, ['username']);

        if(user !== null){
            //We've gotten something back from the database
                //The Database returned some rows for the query of findUser()
                //Therefor there is a user in the database and the user request should fail
                res.status(409).json({
                  code: 409,
                    message:'invalid entry try again'
                });
        }
        else{
            //Continue Registration flow there is no user with the userName the person is asking for
            //Hash the password and salt
            bcrypt.hash(password, saltRounds, async function(err, hash) {
                if(!err)
                    {
                          //Attempt to create the user
                          //Pass the Data below into the user.queries.js to the Sequalize Connection
                          let now = Date.now();
                          const data = {
                            username: userName,
                            password: hash,
                            timeStamp: now,
                            translationDefault:  'eng',
                            translationTarget: 'jpn',
                            adminFlag:0
                          };

                          const result = await userQueries.createUser(data);

                          if(result){
                            res.status(200).json({
                              code: 200,
                              message: 'Registration Success!',
                              entity:result.userId,
                              action: 'Registered themselves',
                              result:true
                            });
                          }
                          else{

                            res.status(500).json({
                              code: 500,
                                result:false
                            })
                          }
                    }
                    else{
                        //Something went wrong
                        res.status(500).json({
                          code: 500,
                            result:false
                        })
                    }
               });
     }

    } //End Try
    catch(err) {
        res.status(500).json({
            error: err.message
        });
    } //End Catch
};

const login = async (req,res) => {
 //Look for a record in database compare it to req.body.username
    //Get the object from PostGRES if it exists compare the password if not return error
    //if user return re
    const userName = _.toLower(req.body.username).replaceAll(' ','');

    //Find out if the userame exists in the Database already after removing spaces and toLower
    //ToDO get some login attempts and lockout action going
    const user = await userQueries.findUser(userName, ['username','password','userid','adminFlag','lastAuthenticationDate','loginAttempts']);
   // .then(user => {
    if(!user)
    {
        return res.status(404).json({
            code: 404,
             message: 'invalid credentials'
            });

    }
    if(user){
        const userFound = user;
        return bcrypt.compare(req.body.password, user.password).then( async isMatch =>{
            if(isMatch){
                //credentials are correct
                const token = jwt.sign({username: userFound.username , userId: userFound.userid}, process.env.JWT_SECRET, {expiresIn:'1h'});
                //3600 seconds in 1 hour
                //Convert to string because thats what the Front end is expecting
                //Choosing ID instead of username because its less information in a way

                const id = (userFound.userid).toString();
                const flag = userFound.adminFlag;
                //Date and lockout workflow beginnings
                userFound.lastAuthenticationDate = Date.now();
                userFound.loginAttempts = 0;
                await userFound.save();

                return res.status(200).json({
                    token:token,
                    expiresIn:3600,
                    userid: id,
                    adminFlag: flag,
                    code: 200,
                    message: 'Registration Success!',
                    entity:userFound.id,
                    action: 'Logged In'
                });


            }
            else {
                //passwords dont match
                userFound.loginAttempts += 1;
                await userFound.save();
                return res.status(401).json({
                    message: 'invalid credentials',
                    code: 401,
                    entity:userFound.id,
                    action: 'Attempted login'
                });
            }
        });
    }

};

module.exports = { register, login };
