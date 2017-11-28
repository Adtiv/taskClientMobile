import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { TaskListPage } from '../tasks/taskList';
import { Dropbox } from './dropboxService';
 
@Component({
  selector: 'login-dropbox',
  templateUrl: 'loginDropbox.html'
})
export class LoginDropboxPage {
 
  constructor(public navCtrl: NavController, public dropbox: Dropbox) {
 
  }
 
  login() {
   
    this.dropbox.login().then((success) => {
      this.navCtrl.setRoot(TaskListPage);
    }, (err) => {
      console.log(err);
    });
  
  }
 
}