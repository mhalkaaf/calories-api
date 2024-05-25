import jwt from 'jsonwebtoken';
import "dotenv/config.js";

const authorization = async (req, res) => {
    try {
        const jwtToken = req.header("token");
        if (!jwtToken) {
            return res.status(403).json({ message: "authorization denied" });
        }

        jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "Not Authorized" });
            }

            res.json(true)// = payload.user;
            // next();
        });
        
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ msg: "Token is not valid" });
    }
}

export { authorization }