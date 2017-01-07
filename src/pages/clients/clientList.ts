import {Component,OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable,FirebaseAuth} from 'angularfire2';
import {ClientService} from './clientService';
import {AddClientPage} from './addClient'
import {ClientDetailPage} from './clientDetail'
import {EditClientPage} from './editClient'
import {SearchPipe} from './search.pipe'


@Component({
  templateUrl: 'clientList.html'
})
export class ClientListPage implements OnInit{
  clients:FirebaseListObservable<any[]>;
  searchClient:string;
  clientList;
  constructor(private navCtrl: NavController,private auth:FirebaseAuth,private clientService:ClientService) {
    console.log("popped?");
    //this.searchClient="";    
    /*
    if(clientService.initAddClient){
      this.clientList=clientService.getLocalClientList();
       for(let i=0;i<this.clientList.length;i++){
         console.log(this.clientList[i]);
       }
    }
    */
  }
  ngOnInit(){
    //this.clientService.initAddClient=true;
  	this.auth.subscribe((auth)=>{
  		if(auth!=null){
  			this.clients=this.clientService.getClients();
        this.clientList=this.clientService.getLocalClientList();
  		}
  	})
    this.searchClient="";
    console.log(this.clientList)
    //setTimeout(() => { this.searchClient="" }, 1);          
  }
  navAdd(){
    this.searchClient=" ";
    this.navCtrl.push(AddClientPage);
  }
  deleteClient(clientKey){
    this.clientService.deleteClient(clientKey);
    this.searchClient="";
  }
  navClient(client){
    this.clientService.client=client;
    this.clientService.setClientTasks(client.$key);
    this.navCtrl.push(ClientDetailPage);
  }
  navEditClient(client){
    this.clientService.setEditClientData(client,client.name,client.email,client.phoneNumber,client.address, client.$key);
    this.navCtrl.push(EditClientPage);
  }
  onInput(event){
    console.log(event)
    console.log("list "+this.clientList)
    //this.clientService.initAddClient=false;
  }
}
