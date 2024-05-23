import jwt from 'jsonwebtoken';

const authorization = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");
        if (!jwtToken) {
            return res.status(403).json("Not Authorize");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload;
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized")
    }
}

export { authorization }