import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService'
import {TaskService} from './taskService'
import {AddTaskPage} from './addTask'
import {TaskDetailPage} from './taskDetail'
import {EditTaskPage} from './editTask'

import * as BoxSDK from 'box-node-sdk';

@Component({
  selector:'task-list',
  templateUrl: 'taskList.html'
})
export class TaskListPage implements OnInit {
  tasks:FirebaseListObservable<any[]>
  taskClients:FirebaseListObservable<any[]>
  customTaskTypes:FirebaseListObservable<any[]>
  taskType:string;
  constructor(private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    //console.log("box " + BoxSDK);
    //console.log('BOX??');
    this.taskType="none";
  	this.auth.subscribe((auth)=>{
  	  	if(auth!=null){
  	  		this.tasks= this.taskService.getTasks('none');
          this.customTaskTypes = this.taskService.customTaskTypes;
          this.taskType="All Tasks"
          this.customTaskTypes.subscribe((types)=>{
            console.log(types)
          })
  	  	}
  	})
  }
  getStyle(task){
    if(task.daysTillDue<=2){
      return "rgba(255,0,0,.8)";
    }
    else if(task.daysTillDue<=5){
      return "rgba(255,255,0,.8)";
    }
    else{
      return "rgba(0,255,0,.8)";
    }
  }
  navTask(task){
    this.taskService.task=task;
    this.taskService.taskClients=this.af.database.list('taskClients/'+task.$key);
    this.navCtrl.push(TaskDetailPage);
  }
  filterTasks(){
    console.log(this.taskType);
    this.tasks = this.taskService.getTasks(this.taskType);
    return false;
  }
  filterByColor(filterColor){
    this.taskService.filterByColor(filterColor);
    this.tasks = this.taskService.getTasks(this.taskService.taskFilter);
  }
  deleteTask(task){
    this.taskService.deleteTask(task.$key, task.taskType);
    return false;
  }
  navAdd(){
    this.navCtrl.push(AddTaskPage);
  }
  navEditTask(task){
    this.taskService.task=task;
    this.taskService.taskTitle=task.title;
    this.taskService.taskDescription=task.description;
    this.taskService.taskDueDate=task.dueDate;
    this.taskService.taskType=task.taskType;
    this.navCtrl.push(EditTaskPage);
  }
}
