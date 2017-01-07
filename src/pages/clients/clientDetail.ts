import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService'
import {ClientService} from './clientService'
import {TaskService} from '../tasks/taskService';
@Component({
  templateUrl: 'clientDetail.html'
})
export class ClientDetailPage implements OnInit {
  clientTasks:FirebaseListObservable<any[]>
  client:FirebaseObjectObservable<any[]>;
  constructor(private clientService:ClientService,private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    this.auth.subscribe((auth)=>{
      if(auth!=null){
        this.client=this.clientService.getClient();
        this.clientTasks=this.clientService.getClientTasks();
      }
    });
  }
  getStyle(clientTask){
    if(clientTask.days<=2){
      return "rgba(255,0,0,.8)";
    }
    else if(clientTask.days<=5){
      return "rgba(255,255,0,.8)";
    }
    else{
      return "rgba(0,255,0,.8)";
    }
  }
}
