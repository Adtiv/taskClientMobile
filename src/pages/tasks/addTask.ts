import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService'
import {TaskService} from './taskService'
import {ClientService} from '../clients/clientService';
import * as moment from 'moment';
let now = moment().format('LLLL');

@Component({
  templateUrl: 'addTask.html'
})
export class AddTaskPage implements OnInit {
  tasks:FirebaseListObservable<any[]>
  clients:FirebaseListObservable<any[]>
  taskType:string;
  title:string;
  description:string;
  client;
  date:string;
  constructor(private clientService:ClientService,private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    this.auth.subscribe((auth)=>{
      if(auth!=null){
        this.clients=this.clientService.getClients();
      }
    });
  }
  addTask(){
    var curr = new Date();
    var currentDate=moment(curr).startOf('day');
    var futureDate =moment(this.date).startOf('day');
    var differenceInDays = futureDate.diff(currentDate, 'days');
    console.log("difference" + differenceInDays);
    this.date = moment(this.date).format('MM/DD/YYYY');
    console.log(this.taskType + this.title + this.description+ this.date + this.client);
    this.taskService.addTask(this.title,this.description,this.date,this.taskType,differenceInDays,this.client);
  }

}
