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
  files:any;
  constructor(private userService: UserService,private navCtrl: NavController,private clientService:ClientService) {
    //setTimeout(() => {this.clientList=this.clientService.getLocalClientList();console.log("LIST "+this.clientList)}, 30000);  
    console.log("CLIENTLIST CONSTRUCTOR");
  }
  ionViewDidEnter() {
        console.log("VIEW ENTERED");
    this.clientList=this.clientService.getLocalClientList();
    this.clientListLength=this.clientList.length;  
    console.log("len" + this.clientListLength);
  }
  ngOnInit(){
    this.userService.auth.onAuthStateChanged((auth)=>{
        this.clients=this.clientService.getClients();
        if(this.clientService.initLocalClient){
          this.clientList=this.clientService.getLocalClientList();
          this.clientListLength=this.clientList.length;
        }
        /*
        clientService.localClientObservable.subscribe((clients)=>{
          this.clientList=this.clientService.getLocalClientList();
        })*/
    })
    this.searchClient="";
    //this.clientService.initAddClient=true;
    //setTimeout(() => { this.searchClient="" }, 1);          
  }
  navAdd(){
    this.searchClient="";
    this.navCtrl.push(AddClientPage);
  }
  deleteClient(clientKey){
    this.clientService.deleteClient(clientKey);
    this.searchClient="";
    this.clientListLength=this.clientList.length;
  }
  navClient(client, name){
    this.clientService.client=client;
    this.clientService.clientName=name;
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
