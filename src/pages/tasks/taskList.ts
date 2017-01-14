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
  editTaskTypes:boolean;
  addTypeBool:boolean;
  newType:string;
  constructor(private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    //console.log("box " + BoxSDK);
    //console.log('BOX??');
    this.taskType="All Tasks";
    this.editTaskTypes=false;
    this.addTypeBool=false;
  	this.auth.subscribe((auth)=>{
  	  	if(auth!=null){
  	  		this.tasks= this.taskService.getTasks('All Tasks');
          this.customTaskTypes = this.taskService.customTaskTypes;
          this.taskType="All Tasks"
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
  filterTasks(taskType){
    if(taskType!=="Add Filters"){
      this.taskType=taskType;
      this.tasks = this.taskService.getTasks(this.taskType);
    }
    else{
      this.editTaskTypes = !this.editTaskTypes;
    }
    return false;
  }
  closeEditTypes(){
    this.editTaskTypes=!this.editTaskTypes;
    this.taskType='All Tasks';
  }
  filterByColor(filterColor){
    this.taskService.filterByColor(filterColor);
    this.tasks = this.taskService.getTasks(this.taskService.taskFilter);
  }
  addFilter(){
    console.log(this.newType);
    this.taskService.addTaskType(this.newType);
  }
  removeFilter(filter){
    console.log(filter);
    this.taskService.removeTaskType(filter);
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
