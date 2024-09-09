import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, Input, input, InputSignal, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { MDContentBoxComponent } from '../content-box/content-box.component';
import { MDIconComponent } from '../icon/icon.component';

type Day = {
	timestamp: number;
	date: Date;
	dayOfMonth: number;
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
	private _selectedDates: Date[] = [];
	private _initialized: boolean = false;

	private _calendarMonth: WritableSignal<Date> = signal<Date>(new Date());

	public isMultiSelect: InputSignal<boolean> = input<boolean>(false);

	@Input()
	public initDates: Date[] = [];

	public change: OutputEmitterRef<Date[]> = output<Date[]>();

	public monthYear: Signal<string> = computed(() => this._calendarMonth().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));

	public calendarWeeks: Signal<Week[]> = computed(() => {
		if (this.initDates.length > 0 && !this._initialized) {
			this._initialized = true;
			this._selectedDates = this.initDates;
		}

		const weeks: Week[] = [];

		const firstDay = new Date(this._calendarMonth().getFullYear(), this._calendarMonth().getMonth(), 1);
		const lastDay = new Date(this._calendarMonth().getFullYear(), this._calendarMonth().getMonth() + 1, 0);

		// Add days from previous month
		const lastMonthDays: Day[] = [];
		for (let i = 0; i < firstDay.getDay(); i++) {
			const date = new Date(firstDay);
			date.setDate(date.getDate() - (firstDay.getDay() - i));
			date.setHours(0, 0, 0, 0);
			lastMonthDays.push(this.createDay(date, false, () => false));
		}

		// Add days of current month
		const currentMonthDays: Day[] = [...lastMonthDays];
		for (let i = 1; i <= lastDay.getDate(); i++) {
			const date = new Date(this._calendarMonth().getFullYear(), this._calendarMonth().getMonth(), i, 0, 0, 0, 0);
			currentMonthDays.push(
				this.createDay(
					date,
					true,
					() =>
						this._currentDate.getDate() === i &&
						this._currentDate.getMonth() === this._calendarMonth().getMonth() &&
						this._currentDate.getFullYear() === this._calendarMonth().getFullYear()
				)
			);
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
				date.setHours(0, 0, 0, 0);
				currentMonthDays.push(this.createDay(date, false, () => false));
				index++;
			}
			weeks.push({ days: currentMonthDays });
		}

		return weeks;
	});

	resetMonth(): void {
		this._calendarMonth.set(this._currentDate);

		// TODO: Should I reset value on month change?
		// if (!this.isMultiSelect()) {
		// 	this._selectedDates = [];
		// 	this.change.emit(this._selectedDates);
		// }
	}

	changeMonth(delta: number) {
		const calendarMonth = this._calendarMonth();
		this._calendarMonth.set(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + delta, 1));

		// TODO: Should I reset value on month change?
		// if (!this.isMultiSelect()) {
		// 	this._selectedDates = [];
		// 	this.change.emit(this._selectedDates);
		// }
	}

	selectDate(day: Day) {
		if (!this.isMultiSelect()) {
			this.calendarWeeks().forEach((week) => week.days.forEach((day) => (day.selected = false)));
			day.selected = !day.selected;

			if (day.selected) {
				this._selectedDates = [day.date];
				this.change.emit(this._selectedDates);
			}

			return;
		}

		day.selected = !day.selected;

		if (day.selected) {
			this._selectedDates.push(day.date);
		}

		if (!day.selected) {
			this._selectedDates = this._selectedDates.filter((date) => date.getTime() !== day.timestamp);
		}

		this.change.emit(this._selectedDates);
	}

	private createDay(date: Date, currentMonth: boolean, currentDay: () => boolean): Day {
		return {
			timestamp: date.getTime(),
			date: date,
			dayOfMonth: date.getDate(),
			selected: this._selectedDates.find((selectedDate) => selectedDate.getTime() === date.getTime()) !== undefined,
			currentMonth: currentMonth,
			currentDay: currentDay()
		};
	}
}
