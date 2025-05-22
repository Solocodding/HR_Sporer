const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send('<script>alert("Only admins can access this page."); history.back();</script>');
    }
};
module.exports = adminCheck;