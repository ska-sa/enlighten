import { Component, ViewChild, Renderer, Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter, Input  } from '@angular/core';
import { Platform, NavController, Gesture, MenuController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { NativeStorage } from '@ionic-native/native-storage';
import * as moment from 'moment';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
/**
 * Generated class for the CanvasDrawComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDrawComponent implements OnInit {

  @ViewChild('myCanvas') canvas: any;
  @Output() longPress = new EventEmitter();
  @Input() myId; 
  @Input() targetId; 
  @Input() boardId; 
  private gesture: Gesture;
  canvasElement: any;
  private curves: Array<Array<any>> = [];
  private currIndex: number = -1;
  lastX: number;
  lastY: number;
  private panning: boolean = false;
  private actives: string;
  currentColour: string = '#000';
  availableColours: any;
  brushSize: number = 5;
  private scaleFactor: number = 1;
  private panY:number = 0;
  private panX:number = 0;
  private cH;
  private cW;

  constructor(public platform: Platform, public renderer: Renderer,public navCtrl: NavController,
    public menuController: MenuController, private af: AngularFireDatabase) {
      
    console.log('Hello CanvasDrawComponent Component');
    this.availableColours = [
            '#000',
            '#1abc9c',
            '#3498db',
            '#9b59b6',
            '#e67e22',
            '#e74c3c'
        ];
  }

  ngOnInit() {
    let env = this;
      this.af.list(`boards/${this.boardId}/data`,{preserveSnapshot: true})
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            env.curves.push(snapshot.val());
          })
          let ctx = this.canvasElement.getContext('2d');
          this.curves.forEach((e,i) =>{
          var curve = this.curves[i];
          curve.forEach((d,k) => {
            if(k > 0) {
              ctx.beginPath();
              ctx.lineJoin = "round";
              ctx.moveTo(curve[k-1].x, curve[k-1].y);
              ctx.lineTo(curve[k].x, curve[k].y);
              ctx.closePath();
              ctx.strokeStyle = curve[k].col;
              ctx.lineWidth = curve[k].brushSize;
              ctx.stroke();
            }
            
          })
        })
          env.redraw(1);
        })
    }
  active() {
    return this.actives
  }
  ngOnDestroy() {
      this.gesture.destroy();
  }

  pop() {
    this.menuController.enable(true, 'myMenu');
    this.navCtrl.pop();
  }
  zoomOut() {
    /*if(this.panning == true) {
      this.panning = false;
      this.actives = 'selected'
    } else {
      this.panning = true;
      this.actives = 'unsel';
    }*/
    var ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, 4000, 6000);
    this.redraw(0.9);
  }
  zoomIn() {
    var ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, 4000, 6000);
    this.redraw(1.1);
  }

  onLongPress(event) {
    alert(JSON.stringify(event))
  }

  ngAfterViewInit(){
      this.canvasElement = this.canvas.nativeElement;

      this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
      this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');


  }

  changeColour(colour){
      this.currentColour = colour;
  }

  changeSize(size){
      this.brushSize = size;
  }

  handleStart(ev){
    if(this.panning !== true) {
      this.currIndex ++;
      this.curves.push(['']);
      let ctx = this.canvasElement.getContext('2d');
      this.lastX = ev.touches[0].pageX;
      this.lastY = ev.touches[0].pageY;

      //alert(`X:${this.lastX}, Y:${this.lastY}`);
      var offsetX = 0;
      var offsetY = 0;
      var mouseX = (this.lastX-offsetX);
      var mouseY = (this.lastY-offsetY);
      //alert(`mouseX:${mouseX}, mouseY:${mouseY}`);
      var mouseXT=Math.round((mouseX-this.panX)/this.scaleFactor);
      var mouseYT=Math.round((mouseY-this.panY)/this.scaleFactor);

      this.lastX = mouseXT;
      this.lastY = mouseYT;
      //alert(`mouseXT:${mouseXT}, mouseYT:${mouseYT}`);
      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(mouseXT, mouseYT);
      ctx.lineTo(mouseXT+1, mouseYT+1);
      ctx.closePath();
      ctx.strokeStyle = this.currentColour;
      ctx.lineWidth = this.brushSize;
      ctx.stroke();
      
    }
  }

  redraw(x) {

    let ctx = this.canvasElement.getContext('2d');
    var sc = 1;
    if(x > 1) {
      sc = 1.1;
    } else {
      sc = 0.9;
    }
    this.scaleFactor *= sc;
   // this.canvasElement.width
    /*this.renderer.setElementAttribute(this.canvasElement, 'width', (1/sc)*this.canvasElement.width + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', (1/sc)*this.canvasElement.height + '');*/

    ctx.mozImageSmoothingEnabled = false;  // firefox
    ctx.imageSmoothingEnabled = false;
    ctx.scale(sc,sc);
    this.curves.forEach((e,i) =>{
      var curve = this.curves[i];
      curve.forEach((d,k) => {
        if(k > 0) {
          ctx.beginPath();
          ctx.lineJoin = "round";
          ctx.moveTo(curve[k-1].x, curve[k-1].y);
          ctx.lineTo(curve[k].x, curve[k].y);
          ctx.closePath();
          ctx.strokeStyle = curve[k].col;
          ctx.lineWidth = curve[k].brushSize;
          ctx.stroke();
        }
        
      })
    })
    
  }

  handleMove(ev){
    if(this.panning !== true) {
      let ctx = this.canvasElement.getContext('2d');
      var offsetX=0;
      var offsetY=0;

      let currentX = ev.touches[0].pageX;
      let currentY = ev.touches[0].pageY;

      var mouseX = (currentX-offsetX);
      var mouseY = (currentY-offsetY);
      var mouseXT=Math.round((mouseX-this.panX)/this.scaleFactor);
      var mouseYT=Math.round((mouseY-this.panY)/this.scaleFactor);

      this.curves[this.currIndex].push({x: mouseXT, y: mouseYT, col: this.currentColour, brushSize: this.brushSize});
      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(mouseXT, mouseYT);
      ctx.closePath();
      ctx.strokeStyle = this.currentColour;
      ctx.lineWidth = this.brushSize;
      ctx.stroke();       

      this.lastX = mouseXT;
      this.lastY = mouseYT;
      firebase.database().ref(`/boards/${this.boardId}/data`).update(this.curves);
    }
  }

  clearCanvas(){
      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, this.canvasElement.width/this.scaleFactor, this.canvasElement.height/this.scaleFactor);
      this.currIndex = -1;
      this.curves = [];
      firebase.database().ref(`/boards/${this.boardId}/data`).update([]);   
  }

}
