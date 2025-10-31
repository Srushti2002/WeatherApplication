const mongoose = require('mongoose');
const City = require('../../models/City');
const { addCity, getAllCities, deleteCity } = require('../../controllers/cityController');
const axios = require('axios');

jest.mock('axios');

const mockResponseData = {
  name: 'London',
  sys: { country: 'GB', sunrise: 123, sunset: 456 },
  main: { temp: 15, humidity: 80 },
  weather: [{ description: 'clear sky', icon: '01d' }],
  wind: { speed: 3.5 },
};

describe('cityController', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await City.deleteMany();
  });

  it('addCity - should return 400 when name is missing', async () => {
    const req = { body: {}, user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addCity(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'City name is required' });
  });

  it('addCity - should add and return new city on success', async () => {
    axios.get.mockResolvedValue({ data: mockResponseData });

  const userId = new mongoose.Types.ObjectId();
  const req = { body: { name: 'London' }, user: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addCity(req, res);

    expect(axios.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    const sent = res.json.mock.calls[0][0];
    expect(sent).toHaveProperty('city');
    expect(sent.city.name).toBe('London');

    const fromDb = await City.findOne({ name: 'London', userId });
    expect(fromDb).toBeDefined();
    expect(fromDb.country).toBe('GB');
  });

  it('addCity - should return 400 if city is already tracked', async () => {
    // seed existing city
  const userId = new mongoose.Types.ObjectId();
    await City.create({ name: 'Paris', userId });

    const req = { body: { name: 'Paris' }, user: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addCity(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'City already tracked' });
  });

  it('getAllCities - returns cities for the user', async () => {
  const userId = new mongoose.Types.ObjectId();
    await City.create({ name: 'A', userId });
    await City.create({ name: 'B', userId });

    const req = { user: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllCities(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const returned = res.json.mock.calls[0][0];
    expect(Array.isArray(returned)).toBe(true);
    expect(returned.length).toBe(2);
  });

  it('deleteCity - removes a city when found', async () => {
  const userId = new mongoose.Types.ObjectId();
    const city = await City.create({ name: 'ToDelete', userId });

    const req = { params: { id: city._id.toString() }, user: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteCity(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'City removed successfully' });

    const found = await City.findById(city._id);
    expect(found).toBeNull();
  });

  it('deleteCity - returns 404 when city not found', async () => {
  const userId = new mongoose.Types.ObjectId();
  const req = { params: { id: new mongoose.Types.ObjectId().toString() }, user: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteCity(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'City not found' });
  });
});
