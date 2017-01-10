import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ClientListPage } from '../pages/clients/clientList';
import { AddClientPage } from '../pages/clients/addClient';
import { EditClientPage } from '../pages/clients/editClient';
import { ClientDetailPage } from '../pages/clients/clientDetail';
import { ClientService } from '../pages/clients/clientService';
import { SearchPipe } from '../pages/clients/search.pipe'

import { CalendarPage } from '../pages/calendar/calendar';
import { NgCalendarModule  } from 'ionic2-calendar';

import { TaskListPage } from '../pages/tasks/taskList';
import { AddTaskPage } from '../pages/tasks/addTask';
import { EditTaskPage } from '../pages/tasks/editTask';
import { TaskDetailPage } from '../pages/tasks/taskDetail';
import { TaskService } from '../pages/tasks/taskService';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/user/home';
import { LoginPage } from '../pages/user/login';
import { SignUpPage } from '../pages/user/signUp';
import { UserService } from '../pages/user/userService';
// Import the AF2 Module
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';


// AF2 Settings
export const firebaseConfig = {
    apiKey: "AIzaSyAZcXxUL6IgxKoLy3qt_75i-ApGtlQUJkA",
    authDomain: "lawyermanagementsys-2df1f.firebaseapp.com",
    databaseURL: "https://lawyermanagementsys-2df1f.firebaseio.com",
    storageBucket: "lawyermanagementsys-2df1f.appspot.com",
    messagingSenderId: "109616746212"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    ClientListPage,
    AddClientPage,
    EditClientPage,
    ClientDetailPage,
    CalendarPage,
    SearchPipe,
    TaskListPage,
    AddTaskPage,
    EditTaskPage,
    TaskDetailPage,
    TabsPage,
    HomePage,
    LoginPage,
    SignUpPage
  ],
  imports: [
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp,MyApp],
  entryComponents: [
    MyApp,
    ClientListPage,
    AddClientPage,
    EditClientPage,
    ClientDetailPage,
    CalendarPage,
    TaskListPage,
    AddTaskPage,
    EditTaskPage,
    TaskDetailPage,
    TabsPage,
    HomePage,
    LoginPage,
    SignUpPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    ClientService,
    TaskService
  ]
})
export class AppModule {}