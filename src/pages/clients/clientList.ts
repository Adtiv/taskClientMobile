import {Component,OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable,FirebaseAuth} from 'angularfire2';
import {ClientService} from './clientService';
import {AddClientPage} from './addClient'
import {ClientDetailPage} from './clientDetail'
import {EditClientPage} from './editClient'
import {SearchPipe} from './search.pipe'
import {UserService} from '../user/userService'


@Component({
  templateUrl: 'clientList.html'
})
export class ClientListPage implements OnInit{
  clients:FirebaseListObservable<any[]>;
  searchClient:string;
  clientList:any;
  clientListLength:Number;
  constructor(private userService: UserService,private navCtrl: NavController,private clientService:ClientService) {
    this.userService.auth.onAuthStateChanged((auth)=>{
        this.clients=this.clientService.getClients();
        if(this.clientService.initLocalClient){
          console.log("GETS TO INIT LOCAL");
          this.clientList=this.clientService.getLocalClientList();
          this.clientListLength=this.clientList.length;
        }
        /*
        clientService.localClientObservable.subscribe((clients)=>{
          this.clientList=this.clientService.getLocalClientList();
        })*/
    })
    this.searchClient="";
    //setTimeout(() => {this.clientList=this.clientService.getLocalClientList();console.log("LIST "+this.clientList)}, 30000);  
  }
  ngOnInit(){
    //this.clientService.initAddClient=true;
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
    //this.clientService.initAddClient=false;
  }
}
