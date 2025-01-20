export type Day = {
	timestamp: number;
	date: Date;
	dayOfMonth: number;
	selected: boolean;
	currentMonth: boolean;
	currentDay: boolean;
};

export type Week = {
	days: Day[];
};
