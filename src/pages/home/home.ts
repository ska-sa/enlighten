import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Todo, TodoService } from '../../app/services/todo/todo';
import { ToastController, AlertController, Loading, LoadingController, MenuController } from 'ionic-angular';
import { TutorAccess } from '../../app/services/tutor-data/tutor.data';
import { Events } from 'ionic-angular';
import { LessonPage } from '../lesson/lesson';
import { MessagesPage } from '../messages/messages';

//Importing pages

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loader: Loading;
  todos: Todo[];
  tutors: TutorAccess[];
  private lessonPage;
  private messagesPage;
  constructor(
    public navCtrl: NavController,
    private todoService: TodoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private tutorAccess: TutorAccess,
    private menuController: MenuController,
    public loadingCtrl: LoadingController,
    public events: Events) {
      this.tutors = this.tutorAccess.getTutors()
      this.menuController.enable(true, 'myMenu')
      this.lessonPage = LessonPage;
      this.messagesPage = MessagesPage;
      //setTimeout(this.lessonReady,2000);
  }
  
  ngOnInit() {
    this.initLoader();
    this.loadTodos();
  }
  openPage(p) {
    this.navCtrl.push(p)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Conversation',
      subTitle: 'You are about to request a tutor and begin a conversation. You will be charged a request fee. Proceed?',
      buttons: [{text:'OK',
                handler: () => {
                  this.openPage(this.messagesPage)
                } }, {text: 'Cancel'}]
    });
    alert.present();
  }

  showInputAlert() {
    let prompt = this.alertCtrl.create({
      title: 'Add New Item',
      message: "Add a new item to the todo list",
      inputs: [{ name: 'title', placeholder: 'e.g Buy groceries' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Add',
          handler: data => {
            this.todoService.add(data.title, []).subscribe(
              response => {
                let todo: Todo = {
                  name: data.title,
                  done: false,
                  tags: []
                };
                this.todos.unshift(todo)
              }
            );
          }
        }
      ]
    });
    prompt.present();
  }

  updateItemState(evt:any, todo: Todo) {
    if (evt) {
      let index: number = this.todos.indexOf(todo);

      if (~index) {
        if (todo.done == true) {
          todo = this.todos[index]
          this.todos.splice(index, 1);
          this.todos.push(todo)
        }
        this.todoService.saveAll(this.todos).subscribe(
          done => {
            this.presentToast(
              "Item marked as " + (todo.done ? "completed" : "not completed")
            )
          }
        );
      }
    }
  }
  private presentToast(message: string) {
    this.toastCtrl.create({message: message, duration: 2000}).present();
  }

  private initLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Loading items..."
    });
  }

  private loadTodos() {
    this.loader.present().then(() => {
      this.todoService.fetch().subscribe(
        data => {
          this.todos = data;
          this.loader.dismiss();
        }
      );
    })
  }

  
}
