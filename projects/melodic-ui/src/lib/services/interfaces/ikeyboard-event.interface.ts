import { IEventTarget } from './ievent-target.interface';

export interface IKeyboardEvent {
	key: string;
	code: string;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;
	eventType: string;
	target: IEventTarget;
	path: IEventTarget[];
	eventRef: KeyboardEvent;
}
