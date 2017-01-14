import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService'
import {TaskService} from './taskService';
@Component({
  templateUrl: 'editTask.html'
})
export class EditTaskPage implements OnInit {
  taskClients:FirebaseListObservable<any[]>
  taskType:string;
  title:string;
  description:string;
  task:FirebaseObjectObservable<any[]>;
  date:string;
  constructor(private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    this.auth.subscribe((auth)=>{
      if(auth!=null){
        this.task=this.taskService.task;
        this.title=this.taskService.taskTitle;
        this.description=this.taskService.taskDescription;
       //this.taskType=this.taskService.taskType;
        //this.date=this.taskService.taskDueDate;
      }
    });
  }
}
