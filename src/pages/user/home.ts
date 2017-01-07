import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform} from 'ionic-angular';
import { LoginPage} from './login';
import { SignUpPage } from './signUp';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

//declare var LoginPage:any;
//declare var SignUpPage:any;
//declare var CameraViewPage:any;
declare var firebase : any;
declare var cordova;
var x;
@Component({
  templateUrl: 'home.html',
})
export class HomePage  implements OnInit{
  testPic:any;
  public auth:any;
  public images:FirebaseListObservable<any>;
  public storageRef: any;
  constructor(private af:AngularFire, private nav:NavController, private platform:Platform){
    var fileReader = new FileReader();
    //console.log(this.map["hello"]="hi");
    //console.log(downloadURL);
    this.auth = firebase.auth();
    /*
    this.images = this.af.database.list('images/');
    this.storageRef = firebase.storage().ref('pics/');
    var file;
    this.af.database.list('images/').subscribe((pics)=>{
    });
    var test = function(){
      console.log("HERE");
      console.log(this.auth);
    }
    test()
    */
  }
  ngOnInit(){
    //this.initPics();
  }
  navLogin(){
    this.nav.push(LoginPage)
  }
  navSignUp(){
    this.nav.push(SignUpPage)
  }
  navMain(){
    //this.nav.setRoot(CameraViewPage);
  }
  preview(){
      if(!this.platform.is('android')){
        localStorage.setItem('hasBeenHome', "true");
        let tapEnabled = false;
        let dragEnabled = false;
        let toBack = true;
        let rect = {
          x : 0,
          y : 0,
          width :  this.platform.width(),
          height: this.platform.height()
        };
        cordova.plugins.camerapreview.startCamera(rect, "rear", tapEnabled, dragEnabled,toBack);
        location.reload(true);
      }
      else{
        //this.nav.setRoot(CameraViewPage);
      }
  }
}
