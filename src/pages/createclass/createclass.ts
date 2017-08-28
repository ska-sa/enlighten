import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SubjectsAccess } from '../../app/services/subjects/subjects';
import { Calendar } from '@ionic-native/calendar';

/**
 * Generated class for the CreateclassPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-createclass',
  templateUrl: 'createclass.html',
})
export class CreateclassPage {
  private subjects;
  private tzoffset;  //offset in milliseconds
  myDate: String = new Date().toISOString()
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private subjectsAccess: SubjectsAccess,
    private calendar: Calendar) {
      this.subjects = this.subjectsAccess.getSubjects();
      var date = new Date();
      this.tzoffset = date.getTimezoneOffset() * 60000;
      this.myDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateclassPage');
  }

yyyymmdd(date) {
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [date.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

  createClass(date,duration,grd,sbj) {
    alert(date)
    var startDate = new Date(Date.parse(date));
    alert(Date.parse(date).toString());
    var endNum = parseInt(Date.parse(date).toString()) + parseInt(duration)*60000;

    alert(endNum);
    alert(startDate);
    alert(this.yyyymmdd(startDate));
    var endDate = new Date(endNum);

    alert(endDate);
    alert(this.yyyymmdd(endDate));
    alert(startDate.toString());
    //var endDate = new Date(2015,2,15,19,30,0,0,0);
    var title = `Grade ${grd} ${sbj} Tutoring Session`;
    var eventLocation = "Enlighten App";
    var notes = `This session lasts ${duration} minutes`;
    var success = function(message) { alert("Success: " + JSON.stringify(message)); };
    var error = function(message) { alert("Error: " + message); };

    this.calendar.createEvent(title,eventLocation,notes,startDate,endDate).then(result => {
        //alert(result)
      }).catch(err => {
        alert(err)
      });
  }

}
