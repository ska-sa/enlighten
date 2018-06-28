import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core'
import { NavController, NavParams, Navbar, MenuController, AlertController, Platform } from 'ionic-angular'

import { NativeAudio } from '@ionic-native/native-audio'
import { WebRTCService } from '../../app/common/webrtc.service'
import * as firebase from 'firebase/app'
import { NativeStorage } from '@ionic-native/native-storage'
import * as moment from 'moment'
import * as io from 'socket.io-client'

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'


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
  @ViewChild('myvideo') myvideo: ElementRef
  @ViewChild('remotevideo') remotevideo: ElementRef
  @ViewChild (Navbar) navBar : Navbar

  private user: any = {uid: ''}
  private target=''
  private peer: any
  private myVideo
  private remoteVideo
  private n = <any>navigator
  private boards =[]
  private boardids = []
  private boarddata: FirebaseListObservable<any>
  private testRadioOpen: boolean
  private testRadioResult
  private object
  private type: string = 'tutor'
  private boardid: string =''
  private showBoard:boolean = false //make this false
  private showVideo: boolean = true
  private hideMyVideo: boolean = true
  private canCall: boolean = true;
  private color: string = '#000'
  private availableColours: Array<string>
  //TWILIO VARIABLES
  private htmlToAdd = '<video #remotevideo autoplay></video>'
  private myVideoHtml = '<video #myvideo autoplay muted></video>'
  private at: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhLTE1MTI2MTAwODIiLCJpc3MiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhIiwic3ViIjoiQUNjYmIwODYyOTA2NzU1MzdiYTUwODUwZTdlOTk4ZGU3NSIsImV4cCI6MTUxMjYxMzY4MiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiWXV4aSIsInZpZGVvIjp7InJvb20iOiJteS1uZXctcm9vbSJ9fX0.zwCoa_gOJ59Whl2WgL7FLxjNin6lAn1h7BPJv86sEUs'
  private at2: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhLTE1MTI2MTAxMTYiLCJpc3MiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhIiwic3ViIjoiQUNjYmIwODYyOTA2NzU1MzdiYTUwODUwZTdlOTk4ZGU3NSIsImV4cCI6MTUxMjYxMzcxNiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiV2lzYW5pIiwidmlkZW8iOnsicm9vbSI6Im15LW5ldy1yb29tIn19fQ.RvQQXASOYdRKKqXlj86nn4R4cmuGztbhJaP_VpaXQas'
  private inCall = false

  constructor (public navCtrl: NavController,private nativeAudio: NativeAudio, 
    private navParams: NavParams, public webRTCService: WebRTCService, public menu: MenuController,
    private nativeStorage: NativeStorage, private af: AngularFireDatabase,public alertCtrl: AlertController,
    private renderer: Renderer2, public platform: Platform) {
    this.availableColours = [
      '#000',
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#e67e22',
      '#e74c3c'
    ]

    if (navParams.get('user') !== undefined && navParams.get('user') !== null) {
      this.user = navParams.get('user')
      this.target = navParams.get('target')
      this.object = navParams.get('object')
      this.type = navParams.get('type')
      let env = this
      // this.menu.enable(false, 'myMenu')
      this.webRTCService.createPeer(this.user.uid)

      if (this.type === 'tutor') {
        firebase.database().ref(`/users_boards/${this.user.uid}/${this.target}`).once('value').then(res => {
          let keys = []

          if (res.val()) {
            keys = Object.keys(res.val())
          }

          console.log('This is what you got: ', keys)

          this.boards = []

          if (keys.length > 0) {
            keys.forEach((e,i) => {
              this.boards.push(res.val()[keys[i]])
            })
          }

          this.createWhiteBoard(false)
        })
      } else if (this.type === 'learner') {
        this.boardid = this.navParams.get('boardid')
        this.showBoard = true
      }
      
      /* this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
        console.log("suu",succ)
      }, (err)=>{
        console.log("err",err)
      }) */
    } else {
      console.log('Bypassing')
    }
  }

  showCheckbox () {
    let alertB = this.alertCtrl.create()
    alertB.setTitle('Which whiteboard would you like to use?')
    let env = this
    this.boards.forEach((board,i) => {
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
    alertB.addButton('Cancel')
    alertB.addButton({
      text: 'Select',
      handler: data => {
        this.testRadioOpen = false
        this.testRadioResult = data
        if (data === 'new') {
          alertB.dismiss()
          this.createWhiteBoard()
        } else {
          env.boardid = data
          firebase.database().ref(`users_boards_using/${env.target}/`).update({boardid: env.boardid}).then(res => {
            env.showBoard = true
          })        
        } 
      }
    })
    
    alertB.present().then(() => {
      this.testRadioOpen = true
    })
  }

  createWhiteBoard (showboard = true) {
    let date = new Date()

    let pushData2 = {
      data: {},
      title: this.object.tutorname + ' - ' + moment(date).format('DD/MM HH:mm'),
      dateCreated: (new Date()).getTime()
    }

    let pushData1 = {
      data: {},
      title: this.object.learnername + ' - ' + moment(date).format('DD/MM HH:mm'),
      dateCreated: (new Date()).getTime()
    }

    this.boardid = firebase.database().ref(`users_boards/${this.user.uid}/${this.target}`).push(pushData1).key
    firebase.database().ref(`users_boards/${this.user.uid}/${this.target}/${this.boardid}`).update({boardid: this.boardid})
    firebase.database().ref(`users_boards/${this.target}/${this.user.uid}/${this.boardid}`).update(pushData2)
    firebase.database().ref(`users_boards/${this.target}/${this.user.uid}/${this.boardid}`).update({boardid: this.boardid})
    
    firebase.database().ref(`users_boards_using/${this.target}/`).update({boardid: this.boardid}).then(res => {
      this.showBoard = showboard
    }) 
  }


  ionViewDidLoad() {
    /* this.navBar.backButtonClick = (e:UIEvent) => {
      e.preventDefault()
      this.menu.enable(true, 'myMenu')
      this.navCtrl.pop()
    } */

    if (this.type !== 'tutor') {
      firebase.database().ref(`call_status/${this.user.uid}`).update({
        ready: true
      })
    }
  }

  showVid(ev, toggle = null) {
    if (toggle === null && this.type === 'tutor') {
      this.showBoard = true
    }
    
    this.showVideo = ev
  }

  changeColour (x) {
    this.color = x
  }

  ngOnInit () {
    this.remoteVideo = this.remotevideo.nativeElement
    this.myVideo = this.myvideo.nativeElement

    this.webRTCService.init(this.myVideo, this.remoteVideo, () => {
      console.log('WebRTC Initializing from DrawPage')
    })

    var type = this.type

    this.nativeStorage.getItem('user-info').then(res => {
      if (res.type) {
        type = res.type
      } 
    })

    firebase.database().ref(`call_status/${this.target}`).on('value', res => {
      if (res.val() && type === 'tutor') {
        if (res.val().ready) {
          this.canCall = true
        }
      }
    })
  }

  ngOnDestroy () {
    this.webRTCService.endCall()
  }

  call () {
    if (this.inCall) {
      this.webRTCService.endCall()
    } else {
      this.webRTCService.call(this.target)
    } 
  }

}
