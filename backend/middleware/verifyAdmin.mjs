const verifyAdmin = (req, res, next) => {
    const adminEmail = req.headers["x-admin-email"];
    const adminPassword = req.headers["x-admin-password"];

    const validEmail =
        process.env.ADMIN_EMAIL ||
        "admin@rentroute.com";

    const validPassword =
        process.env.ADMIN_PASSWORD ||
        "admin123";

    if (
        adminEmail === validEmail &&
        adminPassword === validPassword
    ) {
        return next();
    }

    return res.status(401).json({
        success: false,
        error: "Unauthorized admin access."
    });
};

export default verifyAdmin;