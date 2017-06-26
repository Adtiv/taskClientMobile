import {Component, OnInit} from '@angular/core';
import {NavController,LoadingController} from 'ionic-angular';
import {AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService'
import {ClientService} from './clientService'
import {TaskService} from '../tasks/taskService';
import { Dropbox } from '../clients/dropboxService';
@Component({
  templateUrl: 'clientDetail.html'
})
export class ClientDetailPage implements OnInit {
  clientTasks:FirebaseListObservable<any[]>
  client:FirebaseObjectObservable<any>;
  name:string;
  files:any;
  path:string;
  constructor(private Loading:LoadingController,private dropbox: Dropbox,private clientService:ClientService,private taskService:TaskService,private userService:UserService,private af:AngularFire,private auth:AngularFireAuth,private navCtrl: NavController) {
  }
  ngOnInit(){
    this.auth.subscribe((auth)=>{
      if(auth!=null){
        this.files = [];
        this.dropbox.setAccessToken("vSWm2_Qnc1IAAAAAAAAOrliJEIDiA7VJNsm-XIqKhn5cCS9nht5jdBcm9xvyS7uB");
        var name;
        this.client=this.clientService.getClient();
        this.clientTasks=this.clientService.getClientTasks();
        console.log("before");
        this.name=this.clientService.clientName;
        console.log("NAME " + this.name);
        this.path = '/clients/'+this.name;
        console.log("path"+this.path);
        this.dropbox.getFolders(this.path).subscribe(data => {
          this.files = data.entries;
          //this.depth++;
        }, err => {
          console.log(err);
        });  
    
      }
    });
  }
  downloadFile(filename){
    console.log("fileName"+filename);
    let loading = this.Loading.create({
        content: 'Downloading from Dropbox...'
      });
 
      loading.present();
    this.dropbox.downloadFile(this.path+'/'+filename,loading);
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
