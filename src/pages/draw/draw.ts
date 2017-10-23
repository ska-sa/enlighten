import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams,MenuController, AlertController } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';
import { WebRTCService } from '../../app/common/webrtc.service';
import * as firebase from 'firebase/app';
import { NativeStorage } from '@ionic-native/native-storage';

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
  private target;
  private peer: any;
  private myId;
  private calleeId;
  private myVideo;
  private remoteVideo;
  private n = <any>navigator;
  private boards =[];
  private boarddata: FirebaseListObservable<any>;
  private testRadioOpen: boolean;
  private testRadioResult;

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio, 
    private navParams: NavParams, public webRTCService: WebRTCService,public menu: MenuController,
    private nativeStorage: NativeStorage, private af: AngularFireDatabase,public alertCtrl: AlertController) {
    this.user = navParams.get('user');
    this.target = navParams.get('target');
    this.menu.enable(false, 'myMenu');
    let env = this;
    af.list(`/users_boards/${this.user.uid}/${this.target}`, {preserveSnapshot:true})
      .subscribe(snapshots => {
        if(snapshots.length > 0) {
          //present form
          snapshots.forEach(snapshot => {
            this.boards.push(snapshot.val());
          })

          env.showCheckbox(this.boards);
        } else {
          env.showCheckbox(this.boards);
        }
      })

    this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
      console.log("suu",succ)
    }, (err)=>{
      console.log("err",err)
    });
  }

  showCheckbox(boards) {
    let alertB = this.alertCtrl.create();
    alertB.setTitle('Which whiteboard would you like to use?');

    boards.forEach((board,i) => {
      alertB.addInput({
        type: 'radio',
        label: board.title,
        value: board.title,
        checked: false
      })
    })

    alertB.addInput({
        type: 'radio',
        label: 'New whiteboard',
        value: 'New',
        checked: true
    })

    alertB.addButton('Cancel');
    alertB.addButton({
      text: 'Select',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });
    alertB.present().then(() => {
      this.testRadioOpen = true;
      alert(this.testRadioResult);
      alert(JSON.stringify(this.testRadioResult));
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
      alert(JSON.stringify(res));
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
