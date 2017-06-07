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
 
  	constructor(public http: Http) {
 
  	}
 
  	setAccessToken(token) {
    	this.accessToken = token;
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
		var xhr;
		if ((<any>window).XMLHttpRequest) {
		    xhr= new XMLHttpRequest();
		} else {
		    xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		var self = this;
		xhr.onreadystatechange = function() {
		    if (xhr.readyState === 4 && xhr.status === 200) {
		        result = xhr.responseText;
		        loading.dismiss();
		    	console.log(xhr.getResponseHeader('content-type'));
		    	console.log(xhr.responseURL);
		        //console.log("result "+result);
		        let browser = new InAppBrowser(xhr.responseURL);
		        browser.show();
				/*FileOpener.open(
				    xhr.responseURL, 
				    xhr.getResponseHeader('content-type')
				);*/
		    }
		}
		xhr.open("GET", url, true);
		// xhr.setRequestHeader("access_token", token);
		xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
		xhr.send();
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