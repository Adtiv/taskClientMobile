import {Component, OnInit} from '@angular/core';
import {NavController,AlertController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService';
import {TaskService} from './taskService';
import {TaskListPage} from './taskList';
import {EditTaskPage} from './editTask'
@Component({
  templateUrl: 'taskDetail.html'
})
export class TaskDetailPage implements OnInit {
  taskClients:FirebaseListObservable<any[]>
  taskType:string;
  title:string;
  description:string;
  task:FirebaseObjectObservable<any>;
  date:string;
  constructor(private alert:AlertController,private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    this.auth.subscribe((auth)=>{
      if(auth!=null){
        this.task=this.taskService.getTask();
        this.taskClients=this.taskService.getTaskClients();
      }
    });
  }
  navEditTask(){
    this.navCtrl.push(EditTaskPage);
  }
  deleteTask(key,taskType){
    let alert = this.alert.create({
      title: 'Delete Task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.taskService.deleteTask(key,taskType);
            this.navCtrl.setRoot(TaskListPage);
          }
        }
      ]
    });
    alert.present();
  }
}
