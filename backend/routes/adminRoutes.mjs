import express from "express";

const router = express.Router();

router.post("/admin/login", (req, res) => {
    const { email, password } = req.body;

    const validEmail =
        process.env.ADMIN_EMAIL ||
        "admin@rentroute.com";

    const validPassword =
        process.env.ADMIN_PASSWORD ||
        "admin123";

    if (
        email === validEmail &&
        password === validPassword
    ) {
        return res.json({
            success: true,
            message: "Admin login successful",
            admin: {
                email: validEmail
            }
        });
    }

    return res.status(401).json({
        success: false,
        error: "Invalid admin credentials."
    });
});

export default router;