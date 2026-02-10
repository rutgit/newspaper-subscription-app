import User from "../models/User.js";

// GET – כל המשתמשים (Admin בלבד)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
               .select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET – משתמש לפי id (Admin או המשתמש עצמו)
export const getUserById = async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT – עדכון פרטים אישיים (בלי מנוי!)
export const updateUser = async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const allowedUpdates = {
            fullName: req.body.fullName,
            address: req.body.address
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE – מחיקת משתמש (Admin בלבד)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
