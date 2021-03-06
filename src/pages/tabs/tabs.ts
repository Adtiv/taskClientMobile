import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TaskListPage } from '../tasks/taskList';
import { ClientListPage } from '../clients/clientList';
import { LoginDropboxPage } from '../clients/loginDropbox';
import { CalendarPage } from '../calendar/calendar';
import { UserService } from '../user/userService';
import { HomePage } from '../user/home'

@Component({
  templateUrl: 'tabs.html'
})
/*
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TaskListPage;
  tab2Root: any = ClientListPage;
  tab3Root: any = CalendarPage;

  constructor() {

  }
}
*/

export class TabsPage {

  private rootPage;
  private taskPage;
  private clientPage;
  private calendarPage;
  private loginDropboxPage;
  private userName;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
    this.rootPage = TaskListPage;
    this.taskPage = TaskListPage;
    this.clientPage = ClientListPage;
    this.calendarPage = CalendarPage;
    this.loginDropboxPage = LoginDropboxPage;
    this.userService.auth.onAuthStateChanged((user)=>{
        this.userName=this.userService.currentUser;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  openPage(p) {
    this.rootPage = p;
  }
  logout(){
    this.userService.logout();
    this.rootPage = HomePage;
  }

}