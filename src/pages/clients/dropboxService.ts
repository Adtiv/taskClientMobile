import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {FileOpener} from 'ionic-native';
import {InAppBrowser} from 'ionic-native';
import 'rxjs/add/operator/map';

declare var ActiveXObject:any;
declare var cordova:any;
@Injectable()
export class Dropbox {
 
	accessToken: any;
	folderHistory: any = [];
	appKey: any;
	redirectURI: any;
	url: any;
 
  	constructor(public http: Http) {
   		this.appKey = 'cm4wdj4ieymomyi';
    	this.redirectURI = 'http://localhost';
    	this.url = 'https://www.dropbox.com/1/oauth2/authorize?client_id=' + this.appKey + '&redirect_uri=' + this.redirectURI + '&response_type=token';
  	}
 
  	setAccessToken(token) {
    	this.accessToken = token;
  	}
	login(){
		
	  return new Promise((resolve, reject) => {
	 
	    let browser = new InAppBrowser(this.url,'_blank','location=no,zoom=no,hidden=no');
	    //let browser = InAppBrowser.open(this.url,'_blank');
	    //this.iab.open(this.url,'_blank','location=yes');
	 
	    let listener = browser.on('loadstart').subscribe((event: any) => {
	 	//browser.addEventListener('loadstart', function(event) {
	      //Ignore the dropbox authorize screen
	      if(event.url.indexOf('oauth2/authorize') > -1){
	        return;
	      }
	 
	      //Check the redirect uri
	      if(event.url.indexOf(this.redirectURI) > -1 ){
	        listener.unsubscribe();
	        browser.close();
	        let token = event.url.split('=')[1].split('&')[0];
	        this.accessToken = token;
	        resolve(event.url);
	      } else {
	        reject("Could not authenticate");
	      }
	 
	    });
	 
	  });
	}
	getUserInfo(){
	 
	  let headers = new Headers();
	 
	  headers.append('Authorization', 'Bearer ' + this.accessToken);
	  headers.append('Content-Type', 'application/json');
	 
	  return this.http.post('https://api.dropboxapi.com/2-beta-2/users/get_current_account', "null", {headers: headers})
	    .map(res => res.json());
	 
	}
	getFolders(path?){
	 
	  let headers = new Headers();
	 
	  headers.append('Authorization', 'Bearer ' + this.accessToken);
	  headers.append('Content-Type', 'application/json');
	 
	  let folderPath;
	 
	  if(typeof(path) == "undefined" || !path){
	 
	    folderPath = {
	      path: ""
	    };    
	 
	  } else {
	 
	    folderPath = {
	      path: path
	    }; 
	 
	    if(this.folderHistory[this.folderHistory.length - 1] != path){
	      this.folderHistory.push(path);
	    }
	 
	  }
	 
	  return this.http.post('https://api.dropboxapi.com/2-beta-2/files/list_folder', JSON.stringify(folderPath), {headers: headers})
	    .map(res => res.json());
	 
	}
	downloadFile(path,loading){
		var url = "https://api-content.dropbox.com/1/files/auto/" + path;
		var result;
		//InAppBrowser.open(url, '_system', 'location=yes');
		loading.dismiss();
	}
	goBackFolder(){
	 
	  if(this.folderHistory.length > 0){
	 
	    this.folderHistory.pop();
	    let path = this.folderHistory[this.folderHistory.length - 1];
	 
	    return this.getFolders(path);
	  }
	  else {
	    return this.getFolders();
	  }
	}
 
}