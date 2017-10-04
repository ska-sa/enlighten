import { Component, Output, EventEmitter, Input } from '@angular/core';

import * as moment from 'moment';
import * as _ from "lodash";
import { Calendar } from '@ionic-native/calendar';

import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
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
  @Input() user1;
  @Input() user2;
  @Input() user1id;
  @Input() user2id;

  /*get userG() {
      return this.user;
  }*/
  text: string;
    type: string;

    events: Array<any> = []; 
    
    firebaseEvents: Array<any> = [];

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
    private viewMonth: number;
    private viewYear: number;

    weekHead: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    monthHead: string[] = ['January', 'February','March','April','May','June','July','August','September','October','November','December']

    
  constructor(private calendar: Calendar, 
    private af: AngularFireDatabase) {
    
  }


  ngOnInit() {      
    this.currentYear = moment().year();
    this.currentMonth = moment().month();
    this.currentDate = moment().date();
    this.currentDay = moment().day();
    this.viewMonth = this.currentMonth;
    this.viewYear = this.currentYear;
    var nMonth = this.viewMonth + 1;
    let env = this;
    var monthDays = moment({ year: this.viewYear, month: this.viewMonth }).daysInMonth();
    var startDate = moment( this.viewYear+'-'+nMonth+'-'+'01'+ ' 00:00:00' ).toDate().getTime(); //new Date(); 
    var endDate = moment( this.viewYear+'-'+nMonth+'-'+monthDays+ ' 23:59:59' ).toDate().getTime();
    
    /*alert(this.user1);
    alert(this.user1id);

    alert(this.user2);
    alert(this.user2id);*/

    this.af.list(`/calendar_tutors/${this.user2id}`, {preserveSnapshot: true})
        .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                var thisStart = (new Date(snapshot.val().start)).getTime();
                if( thisStart >= startDate && thisStart <= endDate) {
                    env.firebaseEvents.push(snapshot.val());
                }
            })
        })

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
    this.createMonth(this.displayYear, this.displayMonth); //previous month
  }

    forward() {

        if (this.displayMonth === 11) {
            this.displayYear++;
            this.displayMonth = 0;
        } else {
            this.displayMonth++;
        }
        this.createMonth(this.displayYear, this.displayMonth); //next month
    }

    createMonth(year: number, month: number) {
        this.events = [];
        this.firebaseEvents = [];
        this.type = '';
        this.dateArray = [];
        this.weekArray = [];
        let firstDay;
        let preMonthDays;
        let monthDays;

        let weekDays: Array<dateObj> = []; //empty out weekdays

        firstDay = moment({ year: year, month: month, date: 1 }).day(); //get first day of the selected month

        if (month === 0) {
            preMonthDays = moment({ year: year - 1, month: 11 }).daysInMonth(); //if Jan, get days from December
        } else {
            preMonthDays = moment({ year: year, month: month - 1 }).daysInMonth(); //otherwise, just get previous month
        }

        monthDays = moment({ year: year, month: month }).daysInMonth(); //days in current month

        if (firstDay !== 7) { //if it's not Monday, we push the first row
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
                        isEvent: false,
                        events: []
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month - 1,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        isEvent: false,
                        events: []
                    })
                }

            }
        }

        for (let i = 0; i < monthDays; i++) { //we loop from 0 to end of month and push all the days
            this.dateArray.push({
                year: year,
                month: month,
                date: i + 1,
                isThisMonth: true,
                isToday: false,
                isSelect: false,
                isEvent: false,
                events: []
            })
        }


        if (this.currentYear === year && this.currentMonth === month) {
            let todayIndex = _.findIndex(this.dateArray, {
                year: this.currentYear,
                month: this.currentMonth,
                date: this.currentDate,
                isThisMonth: true,  
            })

            this.dateArray[todayIndex].isToday = true;

            
            /*this.calendar.listEventsInRange(undefined,undefined).then(res => {
              
            }, thenerr => {alert(thenerr)}).catch(err => {
              alert(err);
            });*/
        }


        let env = this;
        var nMonth = month + 1;
        var startDate = moment( year+'-'+nMonth+'-'+'01'+ ' 00:00:00' ).toDate(); //new Date(); 
        var endDate = moment( year+'-'+nMonth+'-'+monthDays+ ' 23:59:59' ).toDate();

        this.af.list(`/calendar_tutors/${this.user2id}`, {preserveSnapshot: true})
        .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                var thisStart = (new Date(snapshot.val().start)).getTime();
                if( thisStart >= startDate.getTime() && thisStart <= endDate.getTime()) {
                    env.firebaseEvents.push(snapshot.val());
                    var thisDay = new Date(snapshot.val().start);
                    let dayIndex = _.findIndex(env.dateArray, {
                        year: env.currentYear,
                        month: month,
                        date: thisDay.getDate()
                    })
                    //alert(res[i].title + ' @ ' + res[i].eventLocation); 
                    if((thisDay.getDate() >= env.currentDate || month > env.currentMonth) && snapshot.val().booked == false) {
                        env.dateArray[dayIndex].isEvent = true;
                        env.dateArray[dayIndex].events.push({val: snapshot.val(), key: snapshot.key});
                    }
                        
                }
            })
        })
            //alert(endDate);
        //this.calendar.listEventsInRange(startDate,endDate).then(res => { //lets rather get it from database
            
            // })

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
                        isEvent: false,
                        events: []
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month + 1,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        isEvent: false,
                        events: []
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
        this.events = this.dateArray[this.lastSelect].events;
        this.onDaySelect.emit(day);
    }
    
    textclass(location) {
        var type = location.substr(15,location.length);   
        if(type == 'Class') {
            return 'text c-class blok';
        } else if(type == 'Session') {
            return 'text session blok';
        } else {
            return '';
        }
    }

    alertTutor() {
        alert("You have booked this session");
    }

    bookSession(sessionId, duration, start) {
        firebase.database().ref(`/lessons_pending_learners/${this.user1id}/${sessionId}`).update({
            title: 'Physics',
            start: start,
            grade: this.user1.grade,
            subtitle: 'Newtonian Mechanics',
            duration: duration,
            tutorname: this.user2.name + ' ' + this.user2.lastname,
            imageurl: this.user2.imageurl,
            institution: this.user2.institution,
            type: 'single',
            tutorid: this.user2id,
            price: duration*100/60
        })
        firebase.database().ref(`/lessons_pending_tutors/${this.user2id}/${sessionId}`).update({
            title: 'Physics',
            start: start,
            subtitle: 'Newtonian Mechanics',
            duration: duration,
            learnername: this.user1.name + ' ' + this.user1.lastname,
            imageurl: this.user1.imageurl,
            school: this.user1.school,
            type: 'single',
            grade: this.user1.grade,
            learnerid: this.user1id,
            price: duration*100/60
        })
        firebase.database().ref(`/lessons_pending_tutors_learners/${this.user2id}/${this.user1id}/${sessionId}`).set(true);
        //this means we can only book one at a time
        firebase.database().ref(`/calendar_tutors/${this.user2id}/${sessionId}`).update({
            booked: true
        })
    }
}

interface dateObj {
    year: number,
    month: number,
    date: number,
    isThisMonth: boolean,
    isToday?: boolean,
    isSelect?: boolean,
    isEvent?: boolean,
    events: Array<any>
}
