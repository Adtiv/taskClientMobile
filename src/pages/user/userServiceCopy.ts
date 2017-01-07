import {Injectable,OnInit,NgZone} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable,FirebaseAuth} from 'angularfire2';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class UserService implements OnInit{
    uid: string;
    user: FirebaseObjectObservable<any[]>;
    users: FirebaseListObservable<any[]>;
    userTasks: FirebaseListObservable<any[]>;
    newUser;
    email;
    fName;
    lName;
    userEmail;
    constructor(public af: AngularFire, private auth:FirebaseAuth,private zone:NgZone) {
        this.af = af;
        //this.getCurrentUser();
        this.users = this.af.database.list('users');
        this.af.auth.subscribe((auth) => {
            if(auth==null){
                console.log("not logged in");
            }
            else{
                if(this.uid==null){
                    this.setUid(auth.uid);
                }
                else if(auth.uid!=this.uid){
                    this.setUid(auth.uid);
                }
                //alert(this.uid);
                //this.setUser();
            }
                //alert(this.uid);
        });
        this.af.database.list('users').subscribe(users=>console.log(users));
    }
    ngOnInit(){
        this.newUser=false;
    }
    setUid(uid){
        if(uid!=null){
            this.uid=uid;
            if(this.newUser==true){
                this.user = this.af.database.object('users/'+this.uid);
                console.log('new User');
                this.newUser=false;
                this.user.set({uid:this.uid,email:this.email,fName:this.fName,lName:this.lName});
            }
        }
        this.user = this.af.database.object('users/'+this.uid);

    }
    addUserTask(postId){

        //this.userTasks = this.af.database.list('users/:'+ this.userKey+'/tasks');   
        //this.userTasks.push({postId});
    }
    createUser(email, password, fName, lName){
        this.af.auth.createUser({ email: email, password: password });
        this.email=email;
        this.fName=fName;
        this.lName=lName;
        this.newUser=true;
        //this.users.push({uid:this.uid,email:email,fName:fName,lName:lName});
    }
    logout(){
        this.af.auth.logout();
        this.uid="";
        this.email="";
        this.fName="";
        this.lName="";
        //location.reload();
    }
    loginUser(email, password){
        this.af.auth.login({ email: email, password: password });
        console.log("login");
        //this.loginMS();
    }
    /*
    loginMS(){
        let authContext = new Microsoft.ADAL.AuthenticationContext("https://login/microsoftonline.com/common");
        authContext.acquireTokenAsync("https://graph.microsoft.com",
            "f22fc90b-0095-4466-90f8-44d92fe55601", "urn:ietf:wg:oauth:2.0:oob").then(function(result:Microsoft.ADAL.AuthenticationResult){
                alert(result.accessToken);
            });
        alert(authContext);
    }
    */
    //e2b87dbe-2ecf-403e-8ec3-13d517606e06
}