import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService'
import {ClientService} from './clientService'
import {TaskService} from '../tasks/taskService';
@Component({
  templateUrl: 'addClient.html'
})
export class AddClientPage implements OnInit {
  tasks:FirebaseListObservable<any[]>
  name:string;
  email:string;
  phoneNumber:string;
  client:any;
  address:string;
  constructor(private clientService:ClientService,private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
  }
  addClient(){
    console.log("FIRST " + this.clientService.clientList.length);
    this.clientService.addClient(this.name, this.email,this.phoneNumber,this.address);
    console.log("SECOND " + this.clientService.clientList.length);
    this.navCtrl.pop();
  }
}
