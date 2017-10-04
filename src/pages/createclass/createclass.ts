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
    var startDate = new Date(Date.parse(date));
    var endNum = parseInt(Date.parse(date).toString()) + parseInt(duration)*60000;
    var endDate = new Date(endNum);
    var title = `Grade ${grd} ${sbj}`;
    var eventLocation = "Enlighten App: Class";
    var notes = `class`;

    this.calendar.createEvent(title,eventLocation,notes,startDate,endDate).then(result => {
        //alert(result)
      }).catch(err => {
        alert(err)
      });
  }

}
