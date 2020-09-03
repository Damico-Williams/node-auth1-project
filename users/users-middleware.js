function restricted() {
    const authError = {
        message: "Invalid credentials",
    }
    return async (req, res, next) => {
        try {

            if (!req.session || !req.session.user) {
                return res.status(401).json(authError)
            }
            
            //if we reach this point, the user is authenticated
            next()
        } catch (err) {
            next(err)
        }
    } 
}

module.exports = {
    restricted
}