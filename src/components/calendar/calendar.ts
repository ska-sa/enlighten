import { Component, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";
import { Calendar } from '@ionic-native/calendar';

/**
 * Generated class for the CalendarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {
  @Output() onDaySelect = new EventEmitter<dateObj>();
  text: string;

    events: Array<any> = [];  

    currentYear: number;

    currentMonth: number;

    currentDate: number;

    currentDay: number;

    displayYear: number;

    displayMonth: number;

    displayTextMonth: string;

    dateArray: Array<dateObj> = []; 

    weekArray = [];

    lastSelect: number = 0;

    weekHead: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    monthHead: string[] = ['January', 'February','March','April','May','June','July','August','September','October','November','December']


  constructor(private calendar: Calendar) {
    this.currentYear = moment().year();
    this.currentMonth = moment().month();
    this.currentDate = moment().date();
    this.currentDay = moment().day();
  }

  ngOnInit() {
        this.today()
  }
  
  today() {
    this.displayYear = this.currentYear;
    this.displayMonth = this.currentMonth;
    this.createMonth(this.currentYear, this.currentMonth);

    let todayIndex = _.findIndex(this.dateArray, {
        year: this.currentYear,
        month: this.currentMonth,
        date: this.currentDate,
        isThisMonth: true
    })
    this.lastSelect = todayIndex;
    this.dateArray[todayIndex].isSelect = true;

    this.onDaySelect.emit(this.dateArray[todayIndex]);
  }

  back() {

    if (this.displayMonth === 0) {
        this.displayYear--;
        this.displayMonth = 11;
    } else {
        this.displayMonth--;
    }
    this.createMonth(this.displayYear, this.displayMonth);
  }

    forward() {

        if (this.displayMonth === 11) {
            this.displayYear++;
            this.displayMonth = 0;
        } else {
            this.displayMonth++;
        }
        this.createMonth(this.displayYear, this.displayMonth);
    }

    createMonth(year: number, month: number) {
        this.dateArray = [];
        this.weekArray = [];
        let firstDay;
        let preMonthDays;
        let monthDays;

        let weekDays: Array<dateObj> = [];

        firstDay = moment({ year: year, month: month, date: 1 }).day();

        if (month === 0) {
            preMonthDays = moment({ year: year - 1, month: 11 }).daysInMonth();
        } else {
            preMonthDays = moment({ year: year, month: month - 1 }).daysInMonth();
        }

        monthDays = moment({ year: year, month: month }).daysInMonth();

        if (firstDay !== 7) {
            let lastMonthStart = preMonthDays - firstDay + 1;
            for (let i = 0; i < firstDay; i++) {
                if (month === 0) {
                    this.dateArray.push({
                        year: year,
                        month: 11,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        isEvent: false
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month - 1,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        isEvent: false
                    })
                }

            }
        }

        for (let i = 0; i < monthDays; i++) {
            this.dateArray.push({
                year: year,
                month: month,
                date: i + 1,
                isThisMonth: true,
                isToday: false,
                isSelect: false,
                isEvent: false
            })
        }

        if (this.currentYear === year && this.currentMonth === month) {
            let todayIndex = _.findIndex(this.dateArray, {
                year: this.currentYear,
                month: this.currentMonth,
                date: this.currentDate,
                isThisMonth: true,  
            })

            this.events.forEach((e,i) => {
              let dayIndex = _.findIndex(this.dateArray, {
                year: this.currentYear,
                month: this.currentMonth,
                date: e.date//random date
              })
              this.dateArray[dayIndex].isEvent = true;
            })
            alert(todayIndex);
            this.dateArray[todayIndex + 1].isEvent = true;
            this.dateArray[todayIndex].isToday = true;
            this.calendar.openCalendar(new Date()).then(res => {
              alert(res);
              alert(JSON.stringify(res));
            });
        }

        if (this.dateArray.length % 7 !== 0) {
            let nextMonthAdd = 7 - this.dateArray.length % 7
            for (let i = 0; i < nextMonthAdd; i++) {
                if (month === 11) {
                    this.dateArray.push({
                        year: year,
                        month: 0,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        isEvent: false
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month + 1,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        isEvent: false
                    })
                }

            }
        }
        for (let i = 0; i < this.dateArray.length / 7; i++) {
            for (let j = 0; j < 7; j++) {
                weekDays.push(this.dateArray[i * 7 + j]);
            }
            this.weekArray.push(weekDays); //we're pushing 7 days into the "4-week" array
            weekDays = [];
        }
    }

    daySelect(day, i, j) {
        this.dateArray[this.lastSelect].isSelect = false;
        this.lastSelect = i * 7 + j;
        this.dateArray[i * 7 + j].isSelect = true;

        this.onDaySelect.emit(day);
    }

}

interface dateObj {
    year: number,
    month: number,
    date: number,
    isThisMonth: boolean,
    isToday?: boolean,
    isSelect?: boolean,
    isEvent?: boolean
}
