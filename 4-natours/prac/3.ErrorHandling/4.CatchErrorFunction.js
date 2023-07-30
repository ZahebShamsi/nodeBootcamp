

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}

// wrap the controller functions in this function and get rid of try-catch block