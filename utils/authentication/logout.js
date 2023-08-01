function logout(req, res){
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        } else {
            res.render('login', {error: '', details: null})
        }
    }); 
}

module.exports = logout