const User = require('../models/User')
const bcrypt = require('bcryptjs')



const registerUser = async (req,res)=>{
    try{
        const { firstname, lastname, email, password, username} = req.body
        let emailExists = await User.findOne({email})
        let usernameExists = await User.findOne({username})

        if (usernameExists ){
            return res.send("username already exists")
        }else if(emailExists){
            return res.send("email already exists")
        }

        const hashedPsw = await bcrypt.hash(password, 10)

        let user = new User({
                username,
                firstname,
                lastname,
                email,
                password: hashedPsw,
                position: 1,
                admin_id: this._id
            }
        )
        await user.save()
        //res.redirect("/login")
        res.render('login')
    }catch (err){
        //res.send(err)
        res.status(500).send('Internal server error');
    }

}

const loginUser = async  (req,res)=>{
    const {email,password} = req.body
    let user = await User.findOne({email})

    if(!user) return  res.send('wrong email')

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        return res.send('wrong password') //res.redirect('/login')
    }

    user.activity = true
    await user.save()

    req.session.isAuth = true

    req.session.user = user

    res.redirect('/project/getUserProjects')


}

const logoutUser = async (req,res)=>{
    console.log(req.session.user)
    const user = await User.findById(req.session.user._id)
    user.activity = false
    await user.save()

    req.session.destroy((err)=>{
        if(err) throw err
        res.render('home')

    })
}



module.exports = {registerUser, loginUser, logoutUser}