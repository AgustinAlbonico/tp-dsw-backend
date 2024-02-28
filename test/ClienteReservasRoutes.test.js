const { busquedaUser } = require('../controllers/ClienteReservasController')

describe('busquedaUser', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: 'jackespitt@gmail.com',
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver los datos del usuario cuando lo encuentra', async () => {
    const mockUser = { id: 1, email: 'jackespitt@gmail.com' };
    const mockFindUnique = jest.fn().mockResolvedValue(mockUser);
    const mockUserClient = { findUnique: mockFindUnique };
  
    jest.mock('@prisma/client', () => ({
      PrismaClient: jest.fn().mockImplementation(() => ({
        usuario: mockUserClient,
      })),
    }));
  
    await busquedaUser(mockRequest, mockResponse);
  
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { email: 'jackespitt@gmail.com' } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });
});
