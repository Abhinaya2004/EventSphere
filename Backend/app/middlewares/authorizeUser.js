const authorizeUser = (permittedRoles) => {
    return (req, res, next) => {
        if (permittedRoles.includes(req.currentUser.role)) {
            next(); // only call once if authorized
        } else {
            return res.status(403).json({ errors: 'Unauthorized access' });
        }
    };
};

export default authorizeUser;