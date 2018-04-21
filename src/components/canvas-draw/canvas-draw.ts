import { Component, ViewChild, Renderer, Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter, Input  } from '@angular/core';
import { Platform, NavController, Gesture, MenuController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { NativeStorage } from '@ionic-native/native-storage';
import * as moment from 'moment';
import * as io from 'socket.io-client';
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
  @Output() videoToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
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
  brushSize: number = 2;
  private scaleFactor: number = 1;
  private panY:number = 0;
  private panX:number = 0;
  private cH;
  private cW;
  private mousedown = false;
  private socket;

  constructor(public platform: Platform, public renderer: Renderer,public navCtrl: NavController,
    public menuController: MenuController, private af: AngularFireDatabase) {
    //this.socket = io.connect('http://localhost:3000'); 
    
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


  disabledown() {
    this.mousedown = false;
  }

  showVideo() {
    this.videoToggle.emit(true);
  }

  ngOnInit() {
    console.log("Your board id is: " + this.boardId);
    this.socket = io.connect('https://enlighten-whiteboard.herokuapp.com');
    this.socket.emit('adduser', {username:`user ${this.myId}`, uid:this.myId,boardid:this.boardId})
    //alert(JSON.stringify({username:`user ${this.myId}`, uid:this.myId,boardid:this.boardId}));
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

      console.log(io);
      console.log(this.socket);
      let ctx = this.canvasElement.getContext('2d');
      this.socket.on('draw_line', data => {
        this.curves.push([])
        this.currIndex++;
        var line = data.line;
        this.curves[this.currIndex].push({x: line[0].x, y: line[0].y, col: line[2].c, brushSize: line[2].t});
        ctx.beginPath();
        ctx.lineJoin = "round";
        ctx.strokeStyle = line[2].c;
        ctx.lineWidth = line[2].t;
        ctx.moveTo(line[0].x, line[0].y);
        ctx.lineTo(line[1].x, line[1].y);
        ctx.closePath();
        ctx.stroke();
      })
  }

  changeColour(colour){
      this.currentColour = colour;
  }

  changeSize(size){
      this.brushSize = size;
  }

  handleStart(ev){
    this.mousedown = true;
    if(this.panning !== true) {
      this.currIndex ++;
      this.curves.push(['']);
      let ctx = this.canvasElement.getContext('2d');
      if(ev.touches) {
        this.lastX = ev.touches[0].pageX
        this.lastY = ev.touches[0].pageY  
      } else {
        this.lastX = ev.clientX;
        this.lastY = ev.clientY
      }

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
    ctx.translate(this.platform.width()/2, this.platform.height()/2);
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
    ctx.setTransform(1,0,0,1,0,0);
    
  }

  handleMove(ev){
    if(this.panning !== true && this.mousedown == true) {
      let ctx = this.canvasElement.getContext('2d');
      var offsetX=0;
      var offsetY=0;
      var currentX=0;
      var currentY=0;
      if(ev.touches) {
        currentX = ev.touches[0].pageX
        currentY = ev.touches[0].pageY 
        this.mousedown = true; 
      } else {
        currentX = ev.clientX;
        currentY = ev.clientY
      }

      var mouseX = (currentX-offsetX);
      var mouseY = (currentY-offsetY);
      var mouseXT=Math.round((mouseX-this.panX)/this.scaleFactor);
      var mouseYT=Math.round((mouseY-this.panY)/this.scaleFactor);

      this.curves[this.currIndex].push({x: mouseXT, y: mouseYT, col: this.currentColour, brushSize: this.brushSize});
      //console.log(this.curves)
      this.socket.emit('draw_line', { line: [ {x: mouseXT, y:mouseYT}, {x: this.lastX, y: this.lastY}, {t: this.brushSize, c: this.currentColour}]});
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
      //firebase.database().ref(`/boards/${this.boardId}/data`).update(this.curves);
    }
  }

  clearCanvas(){
      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, this.canvasElement.width/this.scaleFactor, this.canvasElement.height/this.scaleFactor);
      this.currIndex = -1;
      this.curves = [];
      //firebase.database().ref(`/boards/${this.boardId}/data`).update([]);   
      this.socket.emit('clear', {});
  }

}
