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
    customTaskTypes: FirebaseListObservable<any[]>;
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
    typeCount:Number;
    constructor(private auth:FirebaseAuth,private af: AngularFire,private userService: UserService){ 
      this.userService.auth.onAuthStateChanged((user)=>{
            this.userId=this.userService.uid;
            this.startAtVal=0;
            this.endAtVal=1000;
            this.taskFilter="All Tasks";
            this.setTasks();
            this.setTaskTypes();
      });

      setInterval(() => { this.taskDateCountdown() }, 60000*1);   
    }
    ngOnInit(){
    }
    setTasks(){
      this.tasks = this.af.database.list('tasks/'+this.userId, { preserveSnapshot: true });
      this.af.database.list('tasks/'+this.userId).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.calculateNewDaysTillDue(snapshot);
        });  
      })
    }
    setTaskTypes(){
      this.customTaskTypes=this.af.database.list("users/"+this.userService.uid+"/types");
      var typeCount=0;
      this.af.database.list("users/"+this.userService.uid+"/types").subscribe(types=>{
        types.forEach(type=>{
          typeCount++;
        })
      })
      this.typeCount=typeCount;
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
    calculateNewTimeDue(task){
      var differenceInHours="0";
      //console.log("GETS HERER??");
        var currentHour = moment(new Date());
        var hourDue;
        if(task.dueTime.substring(6,8)=='AM'){
          hourDue=moment(task.dueTime, 'hh:mm: A');
        }
        else{
          var time = (parseInt(task.dueTime.substring(0,2))+12).toString()+task.dueTime.substring(2,8);
          hourDue=moment(time,'hh:mm: P');
        }
        var duration = moment.duration(hourDue.diff(currentHour));
        differenceInHours = duration.asHours().toString();
      differenceInHours=differenceInHours.substring(0,4);
      console.log(differenceInHours);
      this.task=this.af.database.object('tasks/'+this.userId+'/'+task.$key);
      this.task.update({hoursTillDue:differenceInHours});
      this.filteredTask=this.af.database.object('customTaskFilters/'+this.userId+'/'+task.taskType+'/'+task.$key);
      this.filteredTask.update({hoursTillDue:differenceInHours});
    }
    calculateNewDaysTillDue(task){
      var curr = new Date();
      var currentDate=moment(curr).startOf('day');
      var due = this.parseDateISO(task.dueDate);
      var futureDate =moment(due).startOf('day');
      var differenceInDays = futureDate.diff(currentDate, 'days');
      /*
      var differenceInHours="0";
      if(differenceInDays==0){
        var currentHour = moment(new Date());
        var hourDue;
        if(task.dueTime.substring(6,8)=='AM'){
          hourDue=moment(task.dueTime, 'hh:mm: A');
        }
        else{
          var time = (parseInt(task.dueTime.substring(0,2))+12).toString()+task.dueTime.substring(2,8);
          hourDue=moment(time,'hh:mm: P');
        }
        var duration = moment.duration(hourDue.diff(currentHour));
        differenceInHours = duration.asHours().toString();
      }
      differenceInHours=differenceInHours.substring(0,4);
      console.log(differenceInHours);
      */
      this.task=this.af.database.object('tasks/'+this.userId+'/'+task.$key)
      this.filteredTask=this.af.database.object('customTaskFilters/'+this.userId+'/'+task.taskType+'/'+task.$key);
      if(differenceInDays>=-30){
        this.task.update({daysTillDue:differenceInDays});
        if(task.taskType!=""){
          this.filteredTask.update({daysTillDue:differenceInDays});
        }
        this.af.database.list('taskClients/'+task.$key).subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            this.af.database.object('clientTasks/'+snapshot.$key+'/'+task.$key).update({days:differenceInDays});
            if(task.dueTime!=null){
              this.af.database.object('clientTasks/'+snapshot.$key+'/'+task.$key).update({timeDue:task.dueTime});
            }
          }); 
        })
      }
      else{
        this.task.remove();
        this.filteredTask.remove();
        this.af.database.list('taskClients/'+task.$key).subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            this.af.database.object('clientTasks/'+snapshot.$key+'/'+task.$key).remove();
          })
        })
      }
    }
    getTask(){
      return this.task;
    }
    getTaskClients(){
      return this.taskClients;
    }
    getTasks(filter){
      console.log(this.userId);
      this.taskFilter=filter;
      console.log("STARTING AT?"+this.startAtVal)
      if(this.userId!==null){
        if(this.taskFilter==='All Tasks'){
          this.tasks = this.af.database.list('tasks/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:this.startAtVal,
              endAt:this.endAtVal
            }
          });
          return this.tasks;
        }
        if(this.taskFilter==='past'){
          this.tasks = this.af.database.list('tasks/'+this.userId,{
            query: {
              orderByChild: 'daysTillDue',
              startAt:-30,
              endAt:-1
            }
          });
          return this.tasks;
        }
        else{
          this.filteredTasks = this.af.database.list('customTaskFilters/'+this.userId+'/'+filter,{
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
      this.filteredTask=this.af.database.object('customTaskFilters/'+this.userId+'/'+taskType+'/'+taskKey);
      this.filteredTask.remove();
      this.tasks.remove(taskKey);
      this.af.database.list('taskClients/'+taskKey).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.af.database.object('clientTasks/'+snapshot.$key+'/'+taskKey).remove();
        }); 
      })
      this.af.database.list('taskClients/'+taskKey).remove();  
    }
    deletePastTasks(){
      this.tasks = this.af.database.list('tasks/'+this.userId,{
        query: {
          orderByChild: 'daysTillDue',
          startAt:-30,
          endAt:0
        }
      })
      this.tasks.subscribe(snapshots=>{
        snapshots.forEach(snapshot=>{
          this.af.database.object('tasks/'+this.userId+'/'+snapshot.$key).remove();
          this.af.database.object('tasks/'+snapshot.taskType+'/'+this.userId+'/'+snapshot.$key).remove();
          this.af.database.object('customTaskFilters/'+this.userId+'/'+snapshot.taskType+'/'+snapshot.$key);
          this.af.database.list('taskClients/'+snapshot.$key).subscribe(snapshots => {
            snapshots.forEach(snap => {
              this.af.database.object('clientTasks/'+snap.$key+'/'+snapshot.$key).remove();
            })
          })          
        })
      })  
    }
    parseClient(client){
      for(var i=0;i<client.length;i++){
        if(client.charAt(i)=='/' && client.charAt(i+1)=='/'){
          this.clientName=client.substring(0,i);
          this.clientKey=client.substring(i+2,client.length);
        }
      }
    }
    addTaskType(type){
      this.af.database.list("users/"+this.userService.uid+"/types").push({type});
      this.setTaskTypes();
    }
    removeTaskType(types){
      console.log("TYPES" + types);
      this.af.database.object("users/"+this.userService.uid+"/types/"+types.$key).remove();
      this.af.database.list('customTaskFilters/'+this.userService.uid+'/'+types.type).remove();
      this.af.database.list('tasks/'+this.userId).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
           if(snapshot.taskType==types.type){
             this.af.database.object('tasks/'+this.userId+'/'+snapshot.$key).update({taskType:""});
           }
        });  
      })
      this.setTaskTypes();
    }
    addTask(title, description, dueDate,taskType,daysTillDue,client,dueTime,differenceInHours){
      console.log(title+"   "+description+" "+dueDate+" " + taskType);
      this.tasks=this.af.database.list('tasks/'+this.userService.uid);
      this.taskKey = this.tasks.push({uid:this.userService.uid,title:title,description:description,dueDate:dueDate,dueTime:dueTime,taskType:taskType,daysTillDue:daysTillDue,hoursTillDue:differenceInHours}).key;
      this.filteredTask=this.af.database.object('customTaskFilters/'+this.userService.uid+'/'+taskType+'/'+this.taskKey);
      this.filteredTask.set({uid:this.userService.uid,title:title,description:description,dueDate:dueDate,dueTime:dueTime,taskType:taskType,daysTillDue:daysTillDue,hoursTillDue:differenceInHours});
      if(client!=""){
        this.parseClient(client);
        this.addClientTask(this.clientKey,this.clientName,this.taskKey,title,daysTillDue);
      }
      //this.userService.addUserTask(this.taskKey);
    }
    addClientTask(clientKey,clientName,taskKey,title,daysTillDue){
      this.af.database.object('clientTasks/'+clientKey+'/'+taskKey).set({task:title,days:daysTillDue});
      this.af.database.object('taskClients/'+taskKey+'/'+clientKey).set({client:clientName});
    }
    updateTask(taskKey,title,description,dueDate,taskType,daysTillDue,dueTime,oldType){
      this.task=this.af.database.object('tasks/'+this.userService.uid+'/'+taskKey);
      this.task.update({uid:this.userService.uid,title:title,description:description,dueDate:dueDate,taskType:taskType,daysTillDue:daysTillDue,dueTime:dueTime});
      if(oldType!=taskType){
        this.filteredTask=this.af.database.object('customTaskFilters/'+this.userId+'/'+oldType+'/'+taskKey);
        this.filteredTask.remove();
      }
      this.filteredTask=this.af.database.object('customTaskFilters/'+this.userId+'/'+taskType+'/'+taskKey);
      this.filteredTask.update({uid:this.userService.uid,title:title,description:description,dueDate:dueDate,taskType:taskType,daysTillDue:daysTillDue,dueTime:dueTime});
      this.af.database.list('taskClients/'+taskKey).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.af.database.object('clientTasks/'+snapshot.$key+'/'+taskKey).update({task:title});
        }); 
      })
    }
}