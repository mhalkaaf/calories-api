import jwt from 'jsonwebtoken';
import "dotenv/config.js";

function jwtGenerator(id) {
    const payload = {
        user_id: id
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export { jwtGenerator };