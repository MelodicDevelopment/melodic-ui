import { IndicatorType } from '../../../types/indicator-type.type';

export interface IAlert {
	title: string;
	message: string;
	action?: {
		text: string;
		actionFn: () => void;
	};
	type?: IndicatorType;
	duration?: number;
	onClose?: (action: 'dismissed' | 'action-taken') => void;
}
