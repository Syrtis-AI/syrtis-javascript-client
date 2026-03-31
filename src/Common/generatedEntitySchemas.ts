import message from '../data/entity/message.json';
import messageStamp from '../data/entity/message_stamp.json';
import request from '../data/entity/request.json';
import session from '../data/entity/session.json';
import user from '../data/entity/user.json';

type EntitySchema = { name: string };

export default function getGeneratedEntitySchemas(): Record<string, EntitySchema> {
  return {
    [message.name]: message,
    [messageStamp.name]: messageStamp,
    [request.name]: request,
    [session.name]: session,
    [user.name]: user,
  };
}
