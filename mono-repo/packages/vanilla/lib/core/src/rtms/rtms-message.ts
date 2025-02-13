import { Notification } from '@rtms/client';

/**
 * @whatItDoes Defines the format of a message returned by RTMS though web-socket.
 *
 * @stable
 */
export interface RtmsMessage extends Notification {}
