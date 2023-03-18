import { CourseModel } from './course.model';
import { UserRoleModel } from '../../core/models/user-role.model';
import { PowModel } from './pow.model';

//constructing an object to represent what is returned from the database
export class MessageModel {
  id: number | undefined;
  senderName: string | undefined;
  senderId: number | undefined;
  message: string | undefined;
  sendTime: Date | undefined;
  pow: PowModel | undefined;
  constructor(
    id: any,
    sender: any,
    senderId: any,
    message: any,
    sendTime: any,
    pow: any
  ) {
    this.id = id;
    this.senderId = senderId;
    this.senderName = sender;
    this.message = message;
    this.sendTime = new Date(sendTime);
    this.pow = new PowModel({ pow });
  }
}
