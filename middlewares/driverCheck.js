const driverCheck = (req, res, next) => {

    if (req.user && req.user.role==='driver' && req.user.isApproved) {
        next();
    } else {
        // res.status(403).send('<script> alert("Access Denied: You are not an approved driver. Wait for admin approval."); history.back();</script>');
        res.render('auth/login', {message:"Access Denied: You are not an approved driver. Wait for admin approval."});
        
    }
};

module.exports = driverCheck;