const checkError = fn => function(req, res, next) {
    return fn(req, res, next).catch(next);
};

export default checkError;
