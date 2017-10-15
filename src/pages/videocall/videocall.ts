import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';
//import { WebRTCService } from '../../common/webrtc.service';
import { WebRTCService } from '../../app/common/webrtc.service';
import * as firebase from 'firebase/app';
/**
 * Generated class for the VideocallPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var apiRTC: any
@Component({
  selector: 'page-videocall',
  templateUrl: 'videocall.html',
})
export class VideocallPage implements OnInit {
  @ViewChild('myvideo') myvideo: any;
  @ViewChild('remotevideo') remotevideo: any;

  private user;
  peer;
  myId;
  calleeId;

  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  session;
  webRTCClient;
  incomingCallId = 0;

  status;
  private myVideo;
  private remoteVideo;
  
  private type;
  private SERVER_IP = '192.168.56.1';
  private SERVER_PORT = 9000;

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio, 
    private navParams: NavParams, public webRTCService: WebRTCService ) {
    this.user = navParams.get('user');
    this.type = navParams.get('type');
    //var peer = new Peer({key: 'iu6qotrrnfm9529'});
    this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
      console.log("suu",succ)
    }, (err)=>{
      console.log("err",err)
    });
  }

  ngOnInit() {
    this.remoteVideo = this.remotevideo.nativeElement;
    this.myVideo = this.myvideo.nativeElement;
    console.log('initializing...');
    this.webRTCService.createPeer();
    setTimeout(()=> {
      this.myId = this.webRTCService.myCallId();
    }, 4000)

    this.webRTCService.init(this.myVideo, this.remoteVideo, () => {
            console.log('I\'m calling');
    });
  }

  call() {
    this.webRTCService.call(this.calleeId);
  }



}
