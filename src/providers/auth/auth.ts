import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import {Link, photoModel, Photo, MutablePhoto} from "../../models/model";
import {DbProvider} from "../db/db";
import * as Constants from '../../models/constants';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  public token: any;
  public host: string;
  options: any;

  constructor(public http: Http, public db: DbProvider) {
    this.host = 'http://172.104.233.151';
    this.token = null;
    this.options = { headers:{'Content.type':'application/json'}};
  }

  public send(imagen:Photo):Observable<boolean> {
    let envio = {'token':this.token,'data':JSON.stringify(imagen)};
    let server = this.host+'/api/photos/store';
    return this.http.post(server,envio,this.options)
      .map((result) =>{
        imagen.remoteId = result.json().photoId;
        imagen.remoteSrc = result.json().path;
        return result.json();
      })
  }

  public update(imagen:Photo,locally:boolean = true):Observable<boolean> {

    let envio = {'token':this.token,'data':JSON.stringify(new MutablePhoto(imagen))};
    let server = this.host+'/api/photos/'+imagen.remoteId;
    return this.http.put(server,envio,this.options)
      .map((result) =>{
        if (locally)
          this.db.saveData(new photoModel(),imagen);
        return result.json();
      })
  }
  public links(imagen:Photo):Observable<Link[]>{
    return this.http.get(this.host+'/api/photos/'+imagen.remoteId+'?token='+this.token)
      .map(res => {
        return res.json().map( item =>{
          return new Link(item.owner,item.name,item.phone,item.rhname,item.rhphone,item.link);
        })
      });
  }

  public recibidas(all:boolean):Observable<Photo[]>{
    let status = all?'all':Constants.PENDING;
    return this.http.get(this.host+'/api/photos/status/'+ status +'?token='+this.token)
      .map(res => {
        return res.json().map( item =>{
          let obj = JSON.parse(item.data);
          let remote = this.host+'/api/photos/storage/'+obj.remoteSrc+'?token='+this.token;
          return new Photo(obj.name,remote,obj.owner,obj.status,item.rowId,obj.remoteId,"",obj.people,obj.sharing,obj.log,item.timestamp);
        })
      });
  }

  public loginOrRegister(credentials): Promise<boolean>{
    this.token = null;
    if (credentials.name === null || credentials.phone === null || credentials.email === null || credentials.password === null ||
        credentials.name == "" || credentials.phone == "" || credentials.email == "" || credentials.password == "") {
      return Promise.reject(false);
    } else {
      return this.http.post(this.host + '/api/auth/login',credentials)
        .map((response: Response) => {
          // login successful if there's a jwt token in the response
          let token = response.json() && response.json().token;
          if (token) {
            // set token property
             this.token =  token;
             return true;
          }else{
            return false;
          }
        },error=> {return Promise.reject(false);}).toPromise();
    }


  }




}
