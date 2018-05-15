import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {DbProvider} from "../db/db";
import {Photo, photoModel, User, userModel} from "../../models/model";
import * as Constants from '../../models/constants';
import {AuthProvider} from "../auth/auth";
import {Observable} from "rxjs/Observable";


@Injectable()
export class DataProvider {
  public photos : Array <Photo>;
  public recibidas : Array <Photo>;
  public persons : Array <any>;
  public user : User;

  constructor(private db:DbProvider,private auth:AuthProvider) {
    this.photos= new Array();
    this.recibidas= new Array();
    this.user = new User('');
  }

  public parsePhoto(elem){
    let obj = JSON.parse(elem.data);
    return new Photo(obj.name,obj.src,obj.owner,obj.status,elem.rowId,obj.remoteId,obj.remoteSrc,obj.people,obj.sharing,obj.log,elem.timestamp);

  }

  public loadPhotos(){
    return this.db.getData(new photoModel()).then((res)=>{
      this.photos.length=0;
      let items:any = res;
      for (let i in items){
        this.photos.push(this.parsePhoto(items[i]));
      }
      return this.photos;
    });
  }


  public update(image:Photo,locally:boolean) :Observable<boolean> {
    return this.auth.update(image,locally).map( (res) => {
      return res;
    });
  }

  public getRecibidas(all:boolean=true) :Observable<Photo[]> {
    return this.auth.recibidas(all).map( (res) => {
      this.recibidas = res;
      return res;
    });
  }

  public getCapturadas() {
    return this.photos.filter( photo => photo.status  === Constants.STATUS_CREADA);
  }

  public getEnviadas() {
    return this.photos.filter( photo => photo.status  === Constants.STATUS_PENDING);
  }


  public loadDataTest(){
    this.saveProfile(this.user).then( () =>
    {

    }).catch( () => {});

  }


  public saveProfile(profile): Promise<boolean>{

    if (profile.name === null || profile.phone === null || profile.email === null || profile.password === null ||
      profile.name == "" || profile.phone == "" || profile.email == "" || profile.password == "") {
      return Promise.reject(false);
    }
    //Guardar datos
    return this.db.saveData(new userModel, profile).then ( (res) =>{
      // Recogemos el token
      this.user = profile;

      return this.auth.loginOrRegister(this.user).then( allowed => {
        console.log("Token listo.");
        return Promise.resolve(true);
      }).catch( ()=>{
        console.log("Error al recuperar profile.");
        return Promise.reject(false);
      })
    });
  }

  public getProfile() : Promise<User> {

      return this.db.getData(new userModel()).then( val =>{
        try {
          this.user = JSON.parse(val[0].data);
          this.user.rowid = val[0].rowid;
          if (val[0].timestamp)
            this.user.timestamp = val[0].timestamp;
        }catch (e){
          return Promise.reject("Error al recuperar profile.");
        }

        if (this.user.name === null || this.user.phone === null || this.user.email === null || this.user.password === null ||
          this.user.name == "" || this.user.phone == "" || this.user.email == "" || this.user.password == "") {
          return Promise.reject("Error faltan campos de usuario");
        }
        // Recogemos el token
        return this.auth.loginOrRegister(this.user).then( allowed => {
          console.log("Token listo.");
          return this.user;
        }).catch( () =>{
          console.log("Error al recuperar profile.");
        });
    })

  }

  public saveImagen(imagen) : Promise<any> {
    return this.db.saveData(new photoModel(), imagen).then( ()=>
    {
      this.photos.push(imagen);
    });
  }

  public restore(){
    this.db.connect()

      .then(() => this.db.dropTables())
      .then(() => this.db.createTables())
      .then(() => this.loadDataTest())

      .catch( e=> {
        console.log("Error",e);
      })
  }

}


