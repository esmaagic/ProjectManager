

exports.getSupervisorPan = async(req,res)=>{
    const user = req.session.user
    res.render('supervisorPan', {user})
}


