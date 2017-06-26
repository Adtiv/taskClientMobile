/*

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
 
  depth: number = 0;
  folders: any;
  files: any;
  constructor(public navCtrl: NavController, public dropbox: Dropbox, public Loading: LoadingController) {
 
  }
 
  ionViewDidLoad(){
 
      this.dropbox.setAccessToken("vSWm2_Qnc1IAAAAAAAAOrliJEIDiA7VJNsm-XIqKhn5cCS9nht5jdBcm9xvyS7uB");
      this.folders = [];
 	  this.files = [];
      let loading = this.Loading.create({
        content: 'Syncing from Dropbox...'
      });
 
      loading.present();
 
      this.dropbox.getFolders().subscribe(data => {
        this.folders = data.entries;
        loading.dismiss();
      }, (err) => {
        console.log(err);
      });
 
  }
 
  openFolder(path){
 	console.log(path);
    let loading = this.Loading.create({
      content: 'Syncing from Dropbox...'
    });
 
    loading.present();
 
    this.dropbox.getFolders(path).subscribe(data => {
      this.folders = data.entries;
      this.depth++;
      loading.dismiss();
    }, err => {
      console.log(err);
    });
 
  }
  goBack(){
 
    let loading = this.Loading.create({
      content: 'Syncing from Dropbox...'
    });
 
    loading.present();
 
    this.dropbox.goBackFolder().subscribe(data => {
      this.folders = data.entries;
      this.depth--;
      loading.dismiss();
    }, err => {
      console.log(err);
    });
 
}
 
}

*/