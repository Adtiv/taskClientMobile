import {Injectable, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {FirebaseAuth} from 'angularfire2';
import {UserService} from '../user/userService';
import * as moment from 'moment';
let now = moment().format('LLLL');
/*
import {ClientService} from '../clients/clients.service';
import * as moment from 'moment';
let now = moment().format('LLLL');
*/
@Injectable()
export class TaskService implements OnInit{
    task: FirebaseObjectObservable<any[]>;
    tasks: FirebaseListObservable<any[]>;
    filteredTask: FirebaseObjectObservable<any[]>;
    filteredTasks: FirebaseListObservable<any[]>;
    taskClients: FirebaseListObservable<any[]>;
    taskKey;
    userId;
    startAtVal;
    endAtVal;
    taskFilter;
    clients;
    clientKey;
    clientName;
    taskTitle:string;
    taskDescription:string;
    taskDueDate:string;
    taskType:string;
    constructor(private auth:FirebaseAuth,private af: AngularFire,private userService: UserService){ 
      this.userService.auth.onAuthStateChanged((user)=>{
            this.userId=this.userService.uid;
            this.setTasks();
      });
      /*
      this.auth.subscribe((auth)=>{
        if(auth!=null){
            this.userId=this.userService.uid;
            this.setTasks();
          }
        else{
          this.tasks=null;
          this.clients=null;
        }
      });
      */
      setInterval(() => { this.taskDateCountdown() }, 60000*1);   
    }
    ngOnInit(){
      this.startAtVal=0;
      this.endAtVal=1000;
      this.taskFilter="none";
    }
    setTasks(){
      this.tasks = this.af.database.list('tasks/'+this.userId, { preserveSnapshot: true });
      this.af.database.list('tasks/'+this.userId).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.calculateNewDaysTillDue(snapshot);
        });  
      })
    }
    taskDateCountdown(){
      this.af.database.list('tasks/'+this.userId).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.calculateNewDaysTillDue(snapshot);
        });  
      })      
    }
    parseDateISO(date){
      var parsedDate="";
      parsedDate=date.substring(6,10)+"-"+date.substring(0,2)+"-"+date.substring(3,5);
      return parsedDate;
    }
    calculateNewDaysTillDue(task){
      var curr = new Date();
      var currentDate=moment(curr).startOf('day');
      var due = this.parseDateISO(task.dueDate);
      var futureDate =moment(due).startOf('day');
      var differenceInDays = futureDate.diff(currentDate, 'days');
      this.task=this.af.database.object('tasks/'+this.userId+'/'+task.$key);
      this.task.update({daysTillDue:differenceInDays});
      this.filteredTask=this.af.database.object('tasks/'+task.taskType+'/'+this.userId+'/'+task.$key);
      this.filteredTask.update({daysTillDue:differenceInDays});
      this.af.database.list('taskClients/'+task.$key).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.af.database.object('clientTasks/'+snapshot.$key+'/'+task.$key).update({days:differenceInDays});
        }); 
      })
    }
    getTask(){
      return this.task;
    }
    getTaskClients(){
      return this.taskClients;
    }
    getTasks(filter){
      console.log(this.userId);
      this.startAtVal;
      this.endAtVal;
      this.taskFilter=filter;
      if(this.userId!=null){
        if(this.taskFilter=='none'){
          this.tasks = this.af.database.list('tasks/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:this.startAtVal,
              endAt:this.endAtVal
            }
          });
          return this.tasks;
        }
        else if(this.taskFilter=='discovery'){
          this.filteredTasks = this.af.database.list('tasks/Discovery Response/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:this.startAtVal,
              endAt:this.endAtVal
            }
          });
          return this.filteredTasks;
        }
        else if(this.taskFilter=='motion'){
          this.filteredTasks = this.af.database.list('tasks/Motion Response/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:this.startAtVal,
              endAt:this.endAtVal
            }
          });
          return this.filteredTasks;
        }
        else if(this.taskFilter=='mediation'){
          this.filteredTasks = this.af.database.list('tasks/Mediation Statement/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:this.startAtVal,
              endAt:this.endAtVal
            }
          });
          return this.filteredTasks;
        }
        else if(this.taskFilter=='pleading'){
          this.filteredTasks = this.af.database.list('tasks/Pleading Response/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:this.startAtVal,
              endAt:this.endAtVal
            }
          });
          return this.filteredTasks;
        }
        else if(this.taskFilter=='other'){
          this.filteredTasks = this.af.database.list('tasks/Other/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:this.startAtVal,
              endAt:this.endAtVal
            }
          });
          return this.filteredTasks;
        }
      }
    }
    filterByColor(color){
      console.log(color);
      if(color=="none"){
        this.startAtVal=0;
        this.endAtVal=1000;
      }
      else if(color=="green"){
        this.startAtVal=6;
        this.endAtVal=1000;
      }
      else if(color=="yellow"){
        this.startAtVal=3;
        this.endAtVal=5;
      }
      else{
        this.startAtVal=0;
        this.endAtVal=2;
      }
    }
    deleteTask(taskKey,taskType){
      this.tasks=this.af.database.list('tasks/'+this.userService.uid);
      this.filteredTasks = this.af.database.list('tasks/'+taskType+'/'+this.userService.uid);
      this.filteredTasks.remove(taskKey);
      this.tasks.remove(taskKey);
      console.log(taskKey)
      this.af.database.list('taskClients/'+taskKey).subscribe(snapshots => {
        console.log("HERERERERER?????");
        snapshots.forEach(snapshot => {
          console.log("MADE IT?");
          console.log(snapshot);
          //console.log('clientTasks/'+snapshot.$key+'/'+taskKey);
          //this.af.database.object('clientTasks/'+snapshot.$key+'/'+taskKey).remove();
        }) 
      })
      this.af.database.list('taskClients/'+taskKey).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.af.database.object('clientTasks/'+snapshot.$key+'/'+taskKey).remove();
        }); 
      })
      this.af.database.list('taskClients/'+taskKey).remove();  
    }
    parseClient(client){
      for(var i=0;i<client.length;i++){
        if(client.charAt(i)=='/' && client.charAt(i+1)=='/'){
          this.clientName=client.substring(0,i);
          this.clientKey=client.substring(i+2,client.length);
        }
      }
    }
    addTask(title, description, dueDate,taskType,daysTillDue,client){
      console.log(title+"   "+description+" "+dueDate+" " + taskType);
      this.tasks=this.af.database.list('tasks/'+this.userService.uid);
      this.taskKey = this.tasks.push({uid:this.userService.uid,title:title,description:description,dueDate:dueDate,taskType:taskType,daysTillDue:daysTillDue}).key;
      this.filteredTask=this.af.database.object('tasks/'+taskType+'/'+this.userService.uid+'/'+this.taskKey);
      this.filteredTask.set({uid:this.userService.uid,title:title,description:description,dueDate:dueDate,taskType:taskType,daysTillDue:daysTillDue});
      this.parseClient(client);
      this.addClientTask(this.clientKey,this.clientName,this.taskKey,title,daysTillDue);
      //this.userService.addUserTask(this.taskKey);
    }
    addClientTask(clientKey,clientName,taskKey,title,daysTillDue){
      this.af.database.object('clientTasks/'+clientKey+'/'+taskKey).set({task:title,days:daysTillDue});
      this.af.database.object('taskClients/'+taskKey+'/'+clientKey).set({client:clientName});
    }
}