const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("./users-model")
const userMiddleware = require("./users-middleware")


const router = express.Router()

//find users
//adding the middleware lets you see your logged out because the application is small cant really tell without it
router.get("/users", userMiddleware.restricted(), async (req, res, next) => {
	try {
		res.json(await db.find())
	} catch(err) {
		next(err)
	}
})

//register user
router.post("/register", async (req, res, next) => {
    try {
        const {username, password } = req.body
        const user = await db.findBy({username}).first()

        if (user) {
            return res.status(409).json({
                message: "Username is already taken"
            })
        }

        const regUser = await db.add({
            username,
            password:await bcrypt.hash(password, 14)
        })

        res.status(201).json(regUser)

    } catch(err) {
		next(err)
	}
})

//login
router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await db.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		
		const passwordVld = await bcrypt.compare(password, user.password)
		if(!passwordVld) {
			return res.status(401).json({
				message: "Invalid Credentials"
			})
		}

		req.session.user = user

		res.json({
			message: `${user.username} successfully logged in.`,
		})
	} catch(err) {
		next(err)
	}
})

//logout
router.get("/logout", userMiddleware.restricted(), async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err){
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err){
		next(err)
	}
})

module.exports = router