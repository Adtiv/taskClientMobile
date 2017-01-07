import { Component } from '@angular/core';

import { TaskListPage } from '../tasks/taskList';
import { ClientListPage } from '../clients/clientList';
import { CalendarPage } from '../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TaskListPage;
  tab2Root: any = ClientListPage;
  tab3Root: any = CalendarPage;

  constructor() {

  }
}
