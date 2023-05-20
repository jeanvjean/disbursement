module.exports = (name) => (req, res, next) => {
    req.route_name = name;
    return next()
}