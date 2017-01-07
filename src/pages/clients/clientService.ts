import {Injectable, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../user/userService';
import {FirebaseAuth, FirebaseListFactory} from 'angularfire2';

//deleting client from one source without typing anything in search copies local list
//adding client before typing anything in search copies list for both sources if other source hasnt typed anything in search
//same with update
@Injectable()
export class ClientService implements OnInit{
    clients: FirebaseListObservable<any[]>;
    clientTasks: FirebaseListObservable<any[]>;
    client: FirebaseObjectObservable<any>;
    af: AngularFire;
    userService: UserService;
    userId;
    clientList: Client[];
    clientName:string;
    clientEmail:string;
    clientPhoneNumber:string;
    clientAddress:string;
    clientKey:string;
    initAddClient:boolean;
    initLocalClient:boolean;
    constructor(af: AngularFire,userService: UserService){
      this.af=af;
      this.userService=userService;
      this.clientList=[];
      this.initLocalClient=true;
      this.userService.auth.onAuthStateChanged((user)=>{
            this.userId=this.userService.uid;
            this.setClients();        
      })
      /*
      this.userService.af.auth.subscribe((auth)=>{
        if(auth!=null){
            this.userId=this.userService.uid;
            this.setClients();
            //this.clients.subscribe((snapshots)=> console.log(snapshots) );
          }
        else{
          this.clients=null;
        }
      });
      */
    }
    ngOnInit(){

    }
    setClients(){
      this.clients = this.af.database.list('clients/'+this.userId, { preserveSnapshot: true });
      this.clientList = [];
      this.af.database.list('clients/'+this.userId,{
            query: {
              orderByChild: 'name',
            }
          }).subscribe(snapshots => {
               snapshots.forEach(snapshot => {
                   if(this.initLocalClient){
                     this.setLocalClients(snapshot.$key,snapshot.name,snapshot.email,snapshot.phoneNumber,snapshot.address);
                     console.log(this.clientList.length);
                   }
                               //this.initLocalClient=false;

                })
          })
    }
    setClientTasks(clientKey){
      this.clientTasks=this.af.database.list('clientTasks/'+clientKey,{
        query: {
          orderByChild: 'days',
        }
      });
    }
    getClientTasks(){
      return this.clientTasks;
    }
    setLocalClients(key,name,email,phoneNumber,address){
      this.clientList.push(new Client(key,name,email,phoneNumber,address));
    }
    getClients(){
      if(this.userId!=null){
        this.clients = this.af.database.list('clients/'+this.userId,{
            query: {
              orderByChild: 'name',
            }
          });
        return this.clients;
      }
    }
    getClient(){
      return this.client;
    }
    setEditClientData(client,name,email,phoneNumber,address, key){
      this.client=client;
      this.clientName=name;
      this.clientEmail=email;
      this.clientPhoneNumber=phoneNumber;
      this.clientAddress=address;
      this.clientKey=key;
    }
    getLocalClientList(){
      return this.clientList;
    }
    addClient(name, email,phoneNumber,address){
      /*
      if(this.initAddClient){
        this.clientList = [];
      }
      */
      this.clients=this.af.database.list('clients/'+this.userService.uid);
      this.clientKey = this.clients.push({uid:this.userService.uid,name:name,email:email,phoneNumber:phoneNumber,address:address}).key;
      this.addSortLocalClientArray(new Client(this.clientKey,name,email,phoneNumber,address));
    }
    addSortLocalClientArray(client){
      this.clientList.push(client);
      this.clientList.sort(function(a,b){
        var alc = a.name.toLowerCase(), blc = b.name.toLowerCase();
        return alc > blc ? 1 : alc < blc ? -1 : a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      });
    }
    updateSortLocalClient(key,name,email,phoneNumber,address){
      for(let i=0;i<this.clientList.length;i++){
        if(this.clientList[i].key==key){
          this.clientList[i].name=name;
          this.clientList[i].email=email;
          this.clientList[i].phoneNumber=phoneNumber;
          this.clientList[i].address=address;
        }
      }
      this.clientList.sort(function(a,b){
        var alc = a.name.toLowerCase(), blc = b.name.toLowerCase();
        return alc > blc ? 1 : alc < blc ? -1 : a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      });
    }
    updateClient(clientKey,name,email,phoneNumber,address){
      this.client=this.af.database.object('clients/'+this.userService.uid+'/'+clientKey);
      this.client.update({name:name,email:email,phoneNumber:phoneNumber,address:address});
      this.af.database.list('clientTasks/'+clientKey).subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            this.af.database.object('taskClients/'+snapshot.$key+'/'+clientKey).update({client:name});
          })
      })
      this.updateSortLocalClient(clientKey,name,email,phoneNumber,address);
      //console.log(taskKey + title + description + dueDate + taskType + daysTillDue);
    }
    deleteLocalClient(clientKey){
      console.log(clientKey);
      for(let i=0;i<this.clientList.length;i++){
        if(this.clientList[i].key==clientKey){
          this.clientList.splice(i,1);
        }
      }
    }
    deleteClient(clientKey){
      this.clients=this.af.database.list('clients/'+this.userService.uid);
      this.clients.remove(clientKey);
      this.af.database.list('clientTasks/'+clientKey).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          console.log("is this working??")
          this.af.database.object('taskClients/'+snapshot.$key+'/'+clientKey).remove();
        }); 
      })
      this.af.database.list('clientTasks/'+clientKey).remove(); 
      this.deleteLocalClient(clientKey);
    }
}
export class Client{
  key;
  name;
  email;
  phoneNumber;
  address;
  constructor(key,
              name,
              email,
              phoneNumber,
              address){
    this.key=key;
    this.name=name;
    this.email=email;
    this.phoneNumber=phoneNumber;
    this.address=address;
  }
}