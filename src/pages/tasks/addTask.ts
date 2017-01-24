import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService';
import {TaskService} from './taskService';
import {ClientService} from '../clients/clientService';
import {TaskListPage} from './taskList';
import * as moment from 'moment';
let now = moment().format('LLLL');

@Component({
  templateUrl: 'addTask.html'
})
export class AddTaskPage implements OnInit {
  tasks:FirebaseListObservable<any[]>
  clients:FirebaseListObservable<any[]>
  customTaskTypes:FirebaseListObservable<any[]>
  taskType:string;
  title:string;
  description:string;
  client:any;
  time:any;
  date:string;
  constructor(private clientService:ClientService,private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    this.auth.subscribe((auth)=>{
      if(auth!=null){
        this.clients=this.clientService.getClients();
        this.customTaskTypes = this.taskService.customTaskTypes;
      }
    });
  }
  addTask(){
    var curr = new Date();
    var due = this.date;
    var currentDate=moment(curr).startOf('day');
    var futureDate =moment(due).startOf('day');
    var differenceInDays = futureDate.diff(currentDate, 'days');
    var currentHour = moment(new Date());
    var hourDue;
    if(this.time.substring(0,2)<12){
      this.time+=":AM";
    }
    else{
      this.time+=":PM";
    }
    console.log("time " +this.time);
    if(this.time.substring(6,8)=='AM'){
      hourDue=moment(this.time, 'hh:mm: A');
    }
    else{
      hourDue=moment(this.time,'hh:mm: P');
    }
    var duration = moment.duration(hourDue.diff(currentHour));
    var differenceInHours = duration.asHours().toString();
    this.taskService.addTask(this.title,this.description,this.date,this.taskType,differenceInDays,this.client,this.time,differenceInHours);   
    this.navCtrl.setRoot(TaskListPage);
  }

}
