import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams,MenuController, AlertController } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';
import { WebRTCService } from '../../app/common/webrtc.service';
import * as firebase from 'firebase/app';
import { NativeStorage } from '@ionic-native/native-storage';
import * as moment from 'moment';
import * as io from 'socket.io-client';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
/**
 * Generated class for the DrawPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-draw',
  templateUrl: 'draw.html',
})
export class DrawPage implements OnInit {
  @ViewChild('myvideo') myvideo: any;
  @ViewChild('remotevideo') remotevideo: any;

  private user;
  private target='';
  private peer: any;
  private myId ='';
  private calleeId;
  private myVideo;
  private remoteVideo;
  private n = <any>navigator;
  private boards =[];
  private boardids = [];
  private boarddata: FirebaseListObservable<any>;
  private testRadioOpen: boolean;
  private testRadioResult;
  private object;
  private type: string;
  private boardid: string ='';
  private showBoard:boolean = false; //make this false

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio, 
    private navParams: NavParams, public webRTCService: WebRTCService,public menu: MenuController,
    private nativeStorage: NativeStorage, private af: AngularFireDatabase,public alertCtrl: AlertController) {
    this.user = navParams.get('user');
    this.target = navParams.get('target');
    this.menu.enable(false, 'myMenu');
    this.object = navParams.get('object');
    this.type = navParams.get('type');
    let env = this;
    if(this.type == 'tutor') {
      af.list(`/users_boards/${this.user.uid}/${this.target}`, {preserveSnapshot:true})
      .subscribe(snapshots => {
        if(snapshots.length > 0) {
          //present form
          this.boards = [];
          snapshots.forEach(snapshot => {
            this.boards.push(snapshot.val());
          })
            env.showCheckbox(this.boards);
          
        } else {
            env.showCheckbox(this.boards);
        }
      })
    } else if (this.type == 'learner') {
      this.boardid = this.navParams.get('boardid');
      this.showBoard = true;
    }
    

    this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
      console.log("suu",succ)
    }, (err)=>{
      console.log("err",err)
    });
  }

  showCheckbox(boards) {
    let alertB = this.alertCtrl.create();
    alertB.setTitle('Which whiteboard would you like to use?');
    let env = this;
    boards.forEach((board,i) => {
      alertB.addInput({
        type: 'radio',
        label: board.title,
        value: board.boardid,
        checked: false
      })
    })

    alertB.addInput({
        type: 'radio',
        label: 'New whiteboard',
        value: 'new',
        checked: true
    })
    var date = new Date()
    alertB.addButton('Cancel');
    alertB.addButton({
      text: 'Select',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        if(data == 'new') {
            var pushData2 = {
              data: {},
              title: env.object.tutorname + ' - ' + moment(date).format('DD/MM HH/mm'),
              dateCreated: (new Date()).getTime()
            }
            var pushData1 = {
              data: {},
              title: env.object.learnername + ' - ' + moment(date).format('DD/MM HH/mm'),
              dateCreated: (new Date()).getTime()
            }
          

          env.boardid = firebase.database().ref(`users_boards/${env.user.uid}/${env.target}`).push(pushData1).key;
          firebase.database().ref(`users_boards/${env.user.uid}/${env.target}/${env.boardid}`).update({boardid: env.boardid})
          
          firebase.database().ref(`users_boards/${env.target}/${env.user.uid}/${env.boardid}`).update(pushData2);
          firebase.database().ref(`users_boards/${env.target}/${env.user.uid}/${env.boardid}`).update({boardid: env.boardid});
          firebase.database().ref(`users_boards_using/${env.target}/`).update({boardid: env.boardid}).then(res => {
            env.showBoard = true;
          });
          
          
        } else {
          env.boardid = data;
          firebase.database().ref(`users_boards_using/${env.target}/`).update({boardid: env.boardid}).then(res => {
            env.showBoard = true;
          });
          
        }
        
        
        //if data shows new then push a whiteboard with `${learnername} - ${(new Date()).getTime()}` 
      }
    });
    alertB.present().then(() => {
      this.testRadioOpen = true;
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawPage');
  }

  ngOnInit() {
    this.remoteVideo = this.remotevideo.nativeElement;
    this.myVideo = this.myvideo.nativeElement;
    var type = '';
    this.nativeStorage.getItem('user-info').then(res => {
      alert('user-info: '+JSON.stringify(res));
      type = res.type;
    })
    let env = this;
    console.log('initializing...');
    this.webRTCService.createPeer();
    setTimeout(()=> {
      this.myId = this.webRTCService.myCallId();
      firebase.database().ref(`/users_callids/${env.user.uid}`).update({callid: this.myId});
      if(type == 'tutor') {
        firebase.database().ref(`/users_callids/${env.target}`).once('value').then(res=>{
          env.call(res.val().callid)
        })
      }
    }, 4000)

    this.webRTCService.init(this.myVideo, this.remoteVideo, () => {
            console.log('I\'m calling');
    });
  }

  call(id) {
    this.calleeId = id;
    this.webRTCService.call(id);
  }

}
