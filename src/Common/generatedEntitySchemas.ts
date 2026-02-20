import scenario from '../data/entity/scenario.json';
import session from '../data/entity/session.json';
import user from '../data/entity/user.json';

type EntitySchema = { name: string };

export default function getGeneratedEntitySchemas(): Record<string, EntitySchema> {
  return {
    [scenario.name]: scenario,
    [session.name]: session,
    [user.name]: user,
  };
}
