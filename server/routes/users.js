import express from 'express';

import User from '../schemas/user.js';

const router = express.Router();

router.post('/users/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        User.findOne({ email, password })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                
                // Return user data without sensitive information
                const userData = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    wishlist: user.wishlist
                };
                
                res.status(200).json(userData);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
            });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

})

router.post('/users/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        User.findOne({ email })
            .then(user => {
                if (user) {
                    return res.status(400).json({ message: 'User already exists' });
                }
                const newUser = new User({ name, email, password });
                newUser.save()
                    .then(user => res.status(201).json(user))
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: 'Server error' });
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/users/:id/wishlist', async (req, res) => {
    try {
        const { id } = req.params;
        const { carId } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.wishlist.includes(carId)) {
            user.wishlist.push(carId);
            await user.save();
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/users/:id/wishlist', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;