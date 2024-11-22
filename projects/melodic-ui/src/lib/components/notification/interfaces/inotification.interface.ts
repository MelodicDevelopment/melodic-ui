export interface INotification {
	type: 'success' | 'error' | 'info' | 'warning';
	message: string;
	duration?: number;
}
