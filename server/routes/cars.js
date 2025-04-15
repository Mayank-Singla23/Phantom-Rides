import express from 'express';

import User from '../schemas/user.js';
import Car from '../schemas/cars.js';

const router = express.Router();

router.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/cars', async (req, res) => {
    try {
        const { name, model, year, price, image } = req.body;
        const newCar = new Car({ name, model, year, price, image });
        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, model, year, price, image } = req.body;
        const updatedCar = await Car.findByIdAndUpdate(id, { name, model, year, price, image }, { new: true });
        if (!updatedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(updatedCar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCar = await Car.findByIdAndDelete(id);
        if (!deletedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/cars/:id/like', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        if (car.likes.includes(userId)) {
            car.likes = car.likes.filter(id => id !== userId);
        } else {
            car.likes.push(userId);
        }

        await car.save();
        res.status(200).json(car);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

async function addCars() {

    let cars = [
        {
            name: 'Toyota',
            model: 'Corolla',
            year: 2020,
            price: 20000,
            image: 'https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cdni.autocarindia.com/ExtraImages/20230524111350_SCP1.jpg',
        },
        {
            name: 'Honda',
            model: 'Civic',
            year: 2021,
            price: 22000,
            image: 'https://statcdn.fandango.com/MPX/image/NBCU_Fandango/681/695/cars3_clip_meetjacksonstorm.jpg',
        },
        {
            name: 'Ford',
            model: 'Mustang',
            year: 2022,
            price: 30000,
            image: 'https://getwallpapers.com/wallpaper/full/f/6/8/1285331-best-disney-cars-movie-wallpaper-2400x1797-1080p.jpg',
        },
    ];

    await Car.deleteMany({})
    console.log('Cars deleted successfully!');

    cars.forEach(async (car) => {
        const newCar = new Car(car);
        await newCar.save();
    });
    console.log('Cars added successfully!');

}

// addCars();

export default router;