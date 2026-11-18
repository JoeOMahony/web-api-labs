import jwt from 'jsonwebtoken';
import User from '../api/users/userModel';

// Extracts the username from the token and verifies it is a valid account username. 
// The user is then passed on to the next middleware, accessible through the request object.
const authenticate = async (request, response, next) => {
    try { 
        const authHeader = request.headers.authorization;
        if (!authHeader) throw new Error('No authorization header');

        const token = authHeader.split(" ")[1];
        if (!token) throw new Error('Bearer token not found');

        const decoded = await jwt.verify(token, process.env.SECRET); 
        console.log(decoded);

        // Assuming decoded contains a username field
        const user = await User.findByUserName(decoded.username); 
        if (!user) {
            throw new Error('User not found');
        }
        // Optionally attach the user to the request for further use
        request.user = user; 
        next();
    } catch(err) {
        next(new Error(`Verification Failed: ${err.message}`));
    }
};

export default authenticate;
