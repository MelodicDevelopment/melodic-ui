import { IndicatorType } from '../../../types/indicator-type.type';

export interface IAlert {
	title: string;
	message: string;
	link?: {
		text: string;
		url: string;
		routerLink: boolean;
	};
	type?: IndicatorType;
	duration?: number;
	onClose?: (action: 'dismissed' | 'action-taken') => void;
}
