const mongoose = require('mongoose');
const City = require('../../models/City');

describe('City model', () => {
  it('creates and retrieves a city', async () => {
    const userId = new mongoose.Types.ObjectId();
    const cityData = { name: 'Testville', country: 'TV', userId };
    const city = await City.create(cityData);

    expect(city).toHaveProperty('_id');
    expect(city.name).toBe('Testville');
    expect(city.country).toBe('TV');

    const found = await City.findById(city._id);
    expect(found.name).toBe('Testville');
  });

  it('requires name field', async () => {
    let error;
    try {
      // include userId so the validation error is specifically for name
      await City.create({ userId: new mongoose.Types.ObjectId() });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});