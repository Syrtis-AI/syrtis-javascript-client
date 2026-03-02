import MessageRepository from '../Repository/MessageRepository.js';
import MessageStampRepository from '../Repository/MessageStampRepository.js';
import SessionRepository from '../Repository/SessionRepository.js';
import UserRepository from '../Repository/UserRepository.js';

const generatedRepositories = [MessageRepository, MessageStampRepository, SessionRepository, UserRepository];

export default generatedRepositories;
