const jwt = require('jsonwebtoken');
const { jwtAuthMiddleware, generateToken } = require('../../middleware/jwt');

jest.mock('jsonwebtoken');

describe('jwt middleware', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 401 when no authorization header', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwtAuthMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for invalid token', () => {
    const req = { headers: { authorization: 'Bearer badtoken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

    jwtAuthMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches user to req on valid token and calls next', () => {
    const payload = { id: 'user123' };
    const req = { headers: { authorization: 'Bearer goodtoken' } };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockReturnValue(payload);

    jwtAuthMiddleware(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('generateToken - signs token with secret', () => {
    jwt.sign.mockReturnValue('signed.token');
    process.env.JWT_SECRET = 'shh';
    const token = generateToken({ id: 'u1' });
    expect(token).toBe('signed.token');
    expect(jwt.sign).toHaveBeenCalled();
  });
});
