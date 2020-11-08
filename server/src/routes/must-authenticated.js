function processFailure(options, req, res, next) {
    if (typeof options !== 'object')
        options = {};

    if (options.failureStatus) {
        return res.status(options.failureStatus).end();
    }

    if (options.failureRedirect)
        return res.redirect(options.failureRedirect);

    return res.redirect('/login');
}

export default {
    user: function(options) {
        return function(req, res, next) {
            if (req.user)
                return next();

            return processFailure(options, req, res, next);
        }
    },
    admin: function(options) {
        options = options || {};

        if (!options.failureRedirect && !options.failureStatus)
            options.failureStatus = 403;

        return function(req, res, next) {
            if (req.user && req.user.isadmin)
                return next();

            return processFailure(options, req, res, next);
        }
    }
};