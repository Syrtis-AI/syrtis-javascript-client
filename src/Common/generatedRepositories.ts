import MessageRepository from '../Repository/MessageRepository.js';
import MessageStampRepository from '../Repository/MessageStampRepository.js';
import RequestRepository from '../Repository/RequestRepository.js';
import SessionRepository from '../Repository/SessionRepository.js';
import UserRepository from '../Repository/UserRepository.js';

const generatedRepositories = [
  MessageRepository,
  MessageStampRepository,
  RequestRepository,
  SessionRepository,
  UserRepository,
];

export default generatedRepositories;
