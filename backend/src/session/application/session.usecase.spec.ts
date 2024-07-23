import { v4 as uuidv4 } from 'uuid';
import { configRepository } from 'src/common/domain/repository/common.repository';
import { sessionRepository } from '../domain/repository/session.repository';
import { SessionUseCase } from './session.usecase';
import {
  ERoles,
  ESessionType,
  IAnonymousSessionPayload,
  IGetInfoByUsername,
  ISessionEntity,
} from '../domain/entities/session.entity';
import moment from 'moment-timezone';

describe('SessionUseCase', () => {
  const mockConfigRepository: jest.Mocked<configRepository> = {
    get: jest.fn((key: string) => {
      const env = {
        'config.secret_key': 'test_secret_key',
      };
      return env[key];
    }),
  };

  const mockSessionRepository: jest.Mocked<sessionRepository> = {
    createSession: jest.fn(),
    getInfoByUsername: jest.fn(),
    getInfoById: jest.fn(),
    userExistsById: jest.fn(),
    userExistsByUsername: jest.fn(),
  };

  let sessionUseCase: SessionUseCase;

  beforeEach(() => {
    sessionUseCase = new SessionUseCase(mockSessionRepository, mockConfigRepository);
    jest.clearAllMocks();
  });

  describe('createAuthSession', () => {
    it('should create a session for an authenticated user', async () => {
      const userInfo: IGetInfoByUsername = {
        id: uuidv4(),
        email: 'user@example.com',
        username: 'user',
        role: ERoles.CLIENT,
        firstAddress: 'Address 1',
        secondAddress: 'Address 2',
        password: '123456a',
        state: 'State',
        city: 'City',
        pincode: '123456',
        phoneCode: '+57',
        phoneNumber: '1234567890',
      };

      mockSessionRepository.getInfoByUsername.mockResolvedValue(userInfo);
      const sessionId = uuidv4();
      mockSessionRepository.createSession.mockResolvedValue({
        id: sessionId,
        userId: userInfo.id,
        jwt: expect.any(String),
        type: ESessionType.AUTH,
        expiredAt: moment().add(24, 'hours').toDate(),
        createdAt: moment().toDate(),
      });

      const result = await sessionUseCase.createAuthSession(userInfo);

      expect(mockSessionRepository.getInfoByUsername).toHaveBeenCalledWith('user');
      expect(mockSessionRepository.createSession).toHaveBeenCalled();
      expect(result).toHaveProperty('jwt');
      expect(result.data.id).toEqual(userInfo.id);
    });

    it('should throw an error if user information cannot be retrieved', async () => {
      const userInfo: IGetInfoByUsername = {
        id: uuidv4(),
        email: 'user@example.com',
        username: 'user',
        password: '123456a',
        role: ERoles.CLIENT,
        firstAddress: 'Address 1',
        secondAddress: 'Address 2',
        state: 'State',
        city: 'City',
        pincode: '123456',
        phoneCode: '+1',
        phoneNumber: '1234567890',
      };

      mockSessionRepository.getInfoByUsername.mockResolvedValue(null);

      await expect(sessionUseCase.createAuthSession(userInfo)).rejects.toThrow('Failed to create session!');
      expect(mockSessionRepository.createSession).not.toHaveBeenCalled();
    });

    it('should throw an error if session creation fails', async () => {
      const userInfo: IGetInfoByUsername = {
        id: 'user_id',
        email: 'user@example.com',
        username: 'user',
        password: '123456a',
        role: ERoles.CLIENT,
        firstAddress: 'Address 1',
        secondAddress: 'Address 2',
        state: 'State',
        city: 'City',
        pincode: '123456',
        phoneCode: '+1',
        phoneNumber: '1234567890',
      };

      mockSessionRepository.getInfoByUsername.mockResolvedValue(userInfo);
      mockSessionRepository.createSession.mockResolvedValue(null);

      await expect(sessionUseCase.createAuthSession(userInfo)).rejects.toThrow('Failed to create session!');
    });
  });

  describe('createAnonymousSession', () => {
    it('should create a session for an anonymous user', async () => {
      const anonymousPayload: IAnonymousSessionPayload = { seed: 'random_seed' };

      const resolvedSession: ISessionEntity = {
        id: uuidv4(),
        userId: null,
        jwt: expect.any(String),
        type: ESessionType.ANONYMOUS,
        expiredAt: expect.any(Date),
        createdAt: expect.any(Date),
      };

      mockSessionRepository.createSession.mockResolvedValue(resolvedSession);

      const result = await sessionUseCase.createAnonymousSession(anonymousPayload);

      expect(mockSessionRepository.createSession).toHaveBeenCalledWith({
        userId: resolvedSession.userId,
        jwt: expect.any(String),
        type: resolvedSession.type,
        expiredAt: expect.any(Date),
      });
      expect(result).toHaveProperty('jwt');
      expect(result.seed).toEqual(anonymousPayload.seed);
    });

    it('should throw an error if anonymous session creation fails', async () => {
      const anonymousPayload: IAnonymousSessionPayload = { seed: 'random_seed' };

      mockSessionRepository.createSession.mockResolvedValue(null);

      await expect(sessionUseCase.createAnonymousSession(anonymousPayload)).rejects.toThrow('Failed to create session!');
    });
  });
});
