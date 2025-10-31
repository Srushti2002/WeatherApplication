const { generateToken } = require('../middleware/jwt');
const User = require('../models/User');

//POST the user data signup
const signup =  async (req, res) => {
    try{
        const {name, email, password} = req.body;

        //Check if the user with same username exist
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({error: 'User already exist'});
        }

        const newUser = new User({
            name,
            email,
            password
        });
        const response = await newUser.save();
        console.log('Data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({response: response, token: token});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
        
    }
}

//POST the user login request -login
const login = async (req, res) => {
    try{
        //Extract username and password
        const {email, password} = req.body;

        //Check if email or password is from request body
        if(!email || !password) {
            return res.status(400).json({error : 'Email and password is required'})
        }

        //find the user by username
        const user = await User.findOne({email}
            )
        //check if the username and password is correct or not
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: 'Invalid username or password'});
        }

        //if its correct generate payload
        const payload = {
            id: user.id
        }
        //generate token
        const token = generateToken(payload);

        //send response
        res.json(token);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }

}

module.exports = {signup, login};