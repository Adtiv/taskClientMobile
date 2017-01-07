import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService'
import {ClientService} from './clientService'
import {TaskService} from '../tasks/taskService';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'editClient.html'
})
export class EditClientPage implements OnInit {
  clientTasks:FirebaseListObservable<any[]>
  client:FirebaseObjectObservable<any>;
  name:string;
  email:string;
  phoneNumber:string;
  address:string;
  key:string;
  constructor(private clientService:ClientService,private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    this.auth.subscribe((auth)=>{
      if(auth!=null){
        this.client=this.clientService.getClient();
        this.name=this.clientService.clientName;
        this.email=this.clientService.clientEmail;
        this.phoneNumber=this.clientService.clientPhoneNumber;
        this.address=this.clientService.clientAddress;
        this.key=this.clientService.clientKey;
      }
    });
  }
  editClient(){
    //console.log(this.name + this.email + this.phoneNumber + this.address + this.key);
    this.clientService.updateClient(this.key,this.name,this.email,this.phoneNumber,this.address);
    this.navCtrl.pop();
  }
}
