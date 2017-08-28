import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MessagesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  private myId = 'abc';
  private hideTime = false;
  private messageBox;
  private messages = [{
                          img: 'build/img/hugh.png',
                          content: 'Hello from the other side.',
                          senderName: 'Isaac',
                          time: '28-Jul-2017 21:53',
                          userId: 'abc'
                      },
                      {
                          img: 'build/img/hugh.png',
                          content: 'Hello from the this side.',
                          senderName: 'Me',
                          time: '05-Aug-2017 20:25',
                          userId: 'def'
                      }
                      ]
 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  sendMessage(text) {
    var obj = {
      img: 'none',
      content: text,
      senderName: 'Me',
      time: 'now',
      userId: 'abc'
    }
    this.messages.push(obj);

    this.messageBox = "";
  }

  closeKeyboard() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

}
