import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, input, InputSignal, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { MDContentBoxComponent } from '../content-box/content-box.component';
import { MDIconComponent } from '../icon/icon.component';

type Day = {
	date: number;
	selected: boolean;
	currentMonth: boolean;
	currentDay: boolean;
};

type Week = {
	days: Day[];
};

@Component({
	selector: 'md-date-picker',
	standalone: true,
	imports: [CommonModule, MDContentBoxComponent, MDIconComponent],
	templateUrl: './date-picker.component.html',
	styleUrl: './date-picker.component.scss'
})
export class MDDatePickerComponent {
	private _currentDate: Date = new Date();
	private _calendarMonth: WritableSignal<Date> = signal<Date>(new Date());

	public monthYear: Signal<string> = computed(() => this._calendarMonth().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));

	public isMultiSelect: InputSignal<boolean> = input<boolean>(false);
	public selectedDate: OutputEmitterRef<Date | null> = output<Date | null>();

	calendarWeeks = computed(() => {
		const weeks: Week[] = [];

		const firstDay = new Date(this._calendarMonth().getFullYear(), this._calendarMonth().getMonth(), 1);
		const lastDay = new Date(this._calendarMonth().getFullYear(), this._calendarMonth().getMonth() + 1, 0);

		// Add days from previous month
		const lastMonthDays: Day[] = [];
		for (let i = 0; i < firstDay.getDay(); i++) {
			const date = new Date(firstDay);
			date.setDate(date.getDate() - (firstDay.getDay() - i));
			lastMonthDays.push({ date: date.getDate(), selected: false, currentMonth: false, currentDay: false });
		}

		// Add days of current month
		const currentMonthDays: Day[] = [...lastMonthDays];
		for (let i = 1; i <= lastDay.getDate(); i++) {
			currentMonthDays.push({
				date: i,
				selected: false,
				currentMonth: true,
				currentDay:
					this._currentDate.getDate() === i &&
					this._currentDate.getMonth() === this._calendarMonth().getMonth() &&
					this._currentDate.getFullYear() === this._calendarMonth().getFullYear()
			});
			if (currentMonthDays.length === 7) {
				weeks.push({ days: currentMonthDays.slice() });
				currentMonthDays.length = 0;
			}
		}

		// Add days from next month
		if (currentMonthDays.length > 0) {
			let index = 1;
			for (let i = currentMonthDays.length; i < 7; i++) {
				const date = new Date(lastDay);
				date.setDate(date.getDate() + index);
				index++;
				currentMonthDays.push({ date: date.getDate(), selected: false, currentMonth: false, currentDay: false });
			}
			weeks.push({ days: currentMonthDays });
		}

		return weeks;
	});

	resetMonth(): void {
		this._calendarMonth.set(this._currentDate);
		this.selectedDate.emit(null);
	}

	changeMonth(delta: number) {
		const calendarMonth = this._calendarMonth();
		this._calendarMonth.set(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + delta, 1));

		this.selectedDate.emit(null);
	}

	selectDate(day: Day) {
		this.calendarWeeks().forEach((week) => week.days.forEach((day) => (day.selected = false)));

		day.selected = true;
		this.selectedDate.emit(new Date(this._calendarMonth().getFullYear(), this._calendarMonth().getMonth(), day.date));
	}
}
