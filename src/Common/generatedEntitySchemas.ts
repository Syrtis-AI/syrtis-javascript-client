import chunk from '../data/entity/chunk.json';
import document from '../data/entity/document.json';
import environment from '../data/entity/environment.json';
import job from '../data/entity/job.json';
import message from '../data/entity/message.json';
import messageStamp from '../data/entity/message_stamp.json';
import node from '../data/entity/node.json';
import request from '../data/entity/request.json';
import scenario from '../data/entity/scenario.json';
import scenarioMessage from '../data/entity/scenario_message.json';
import session from '../data/entity/session.json';
import slot from '../data/entity/slot.json';
import slotConfig from '../data/entity/slot_config.json';
import slotMessage from '../data/entity/slot_message.json';
import slotMessageStamp from '../data/entity/slot_message_stamp.json';
import slotRelation from '../data/entity/slot_relation.json';
import step from '../data/entity/step.json';
import stepMessage from '../data/entity/step_message.json';
import template from '../data/entity/template.json';
import timezone from '../data/entity/timezone.json';
import user from '../data/entity/user.json';

type EntitySchema = { name: string };

export default function getGeneratedEntitySchemas(): Record<string, EntitySchema> {
  return {
    [chunk.name]: chunk,
    [document.name]: document,
    [environment.name]: environment,
    [job.name]: job,
    [message.name]: message,
    [messageStamp.name]: messageStamp,
    [node.name]: node,
    [request.name]: request,
    [scenario.name]: scenario,
    [scenarioMessage.name]: scenarioMessage,
    [session.name]: session,
    [slot.name]: slot,
    [slotConfig.name]: slotConfig,
    [slotMessage.name]: slotMessage,
    [slotMessageStamp.name]: slotMessageStamp,
    [slotRelation.name]: slotRelation,
    [step.name]: step,
    [stepMessage.name]: stepMessage,
    [template.name]: template,
    [timezone.name]: timezone,
    [user.name]: user,
  };
}
