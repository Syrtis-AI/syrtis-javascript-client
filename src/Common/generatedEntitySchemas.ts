import message from '../data/entity/message.json';
import session from '../data/entity/session.json';
import user from '../data/entity/user.json';

type EntitySchema = { name: string };

export default function getGeneratedEntitySchemas(): Record<string, EntitySchema> {
  return {
    [message.name]: message,
    [session.name]: session,
    [user.name]: user,
  };
}
