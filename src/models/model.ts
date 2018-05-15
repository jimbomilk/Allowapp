
import * as Constants from './constants';

/*************************************** DDBB MODEL *********************************/
export class superModel{

  table : any;
  cols : any;
  orderby : any;
  unique = " UNIQUE";
  values : any [];


  constructor(table,cols,orderby){

    this.table = table;
    this.cols = cols;
    this.orderby = orderby;
    this.values = [];
  }

  getSqlCols(insert=false){
    let i=0;let ret=" (";
    for(var prop in this.cols){
      if(i++>0){
       ret += ",";
      }
      ret += prop;
      if (!insert) {
        ret += " ";
        if (prop == "rowid") {
          ret += this.cols[prop];
          ret += " PRIMARY KEY AUTOINCREMENT"
        }
        else if (prop == "timestamp") {
          ret += this.cols[prop];
          ret += " DEFAULT CURRENT_TIMESTAMP"
        }
        else if (this.cols[prop].charAt(0) == '*') {
          ret += this.cols[prop].substring(1, this.cols[prop].length);
          ret += this.unique;
        }
        else
          ret += this.cols[prop];
      }

    }
    ret += ")";
    return ret;
  }

  getSqlColNames(){
    let ret="(";
    let i=0;
    for(let prop in this.cols){
      if (i++>0)
        ret += ","
      ret += prop;
    }
    ret += ")";
    return ret;
  }

  getSqlColValues(values){
    let ret="(";
    let i=0;
    for(let prop in this.cols){

      if (i++>0)
        ret += ",";
      if(prop == 'rowid' && values[prop] == -1)
        ret += 'NULL';
      else
        ret += "?";
    }
    ret += ")";
    return ret;
  }

  // values  : {id:'2342423',name:'pepe',email:'qwerwer@ee.com',phone:'234234234',backup:true,twitter:true}
  // output : ['2342423','pepe','qwerwer@ee.com',...]
  setSqlValues(values) {
    this.values = [];
    // Primero guardamos los indices
    for (var prop in  this.cols) {
      if (prop == 'data') {
        this.values.push(JSON.stringify(values));
      }else if (prop == 'rowid' && values.rowid != -1) {
          this.values.push(values.rowid);
      }else if (this.cols[prop] == 'TIMESTAMP') {
        this.values.push(this.currentTimestamp());
      }

    }
    return this.values;
  }

  dateFromUTC( dateAsString, ymdDelimiter ) {
    var pattern = new RegExp( "(\\d{4})" + ymdDelimiter + "(\\d{2})" + ymdDelimiter + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})" );
    var parts = dateAsString.match( pattern );
    return new Date( Date.UTC(
      parseInt( parts[1] )
      , parseInt( parts[2], 10 ) - 1
      , parseInt( parts[3], 10 )
      , parseInt( parts[4], 10 )
      , parseInt( parts[5], 10 )
      , parseInt( parts[6], 10 )
      , 0
    ));
  }

  currentTimestamp(){
    var date = new Date();
    return date.toISOString();
  }

}



export class userModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',data:'TEXT',timestamp:'TIMESTAMP'};
    let orderby = "ORDER BY timestamp DESC";
    super('users',cols,orderby);
  }
}

export class photoModel extends superModel
{
  constructor(){
    // status : 0  - creada
    //          10 - enviada
    //          20 - recibida
    let cols = {rowid:'INTEGER',data:"TEXT",timestamp:"TIMESTAMP"}
    let orderby = "ORDER BY timestamp DESC";
    super('photos',cols,orderby);
  }
}


/*********************************   DATA MODEL *********************************/

export class Link{
  owner:string;
  name:string;
  phone:string;
  rhname:string;
  rhphone:string;
  link:string;
  constructor(owner,name,phone,rhname,rhphone,link){
    this.owner=owner;
    this.name=name;
    this.phone=phone;
    this.rhname=rhname;
    this.rhphone=rhphone;
    this.link=link;
  }
}

export class Sharing{
  facebook:string;
  instagram:string;
  twitter:string;
  web:string;
  constructor(facebook="",instagram="",twitter="",web=""){
    this.facebook=facebook;
    this.instagram=instagram;
    this.twitter=twitter;
    this.web=web;
  }
}


export class Rightholder{
  documentId:string;
  relation:string;
  name:string;
  phone:string;
  sharing:Sharing;
  status: number; // indica si ha aprobado o no la foto.

  constructor(relation , name,phone, documentId){
    this.relation = relation;
    this.name = name;
    this.phone = phone;
    this.documentId = documentId;
    this.sharing = new Sharing();
    this.status = Constants.PENDING; // Por defecto todos los rightholders tienen status pending para cada nueva foto
  }
}


export class Person{
  id:number;
  name:string;
  phone:string;
  minor:boolean;
  rightholders:Array<Rightholder>;
  constructor(name,phone,minor){
    this.id = -1;
    this.name = name;
    this.phone = phone;
    this.minor = minor;
    this.rightholders = new Array();
  }

}


export class MutablePhoto{
  status: number;
  sharing:Sharing;
  people:Array<Person>;
  log: Log;

  constructor (photo:Photo){
    this.status = photo.status;
    this.sharing = photo.sharing;
    this.people = photo.people;
    this.log = photo.log;
  }
}

export class Photo{
  rowid:number;
  remoteId: number;
  remoteSrc: string;
  name: string;
  src: string;
  owner: string;
  status : number;
  timestamp : string;
  sharing : Sharing;
  people : Array<Person>;
  log: Log;

  constructor(name:string='',
              src:string='',
              owner:string='',
              status:number=Constants.STATUS_CREADA,
              rowid:number=-1,
              remoteid:number=-1,
              remoteSrc:string="",
              people:Array<Person>=new Array(),
              sharing:Sharing=new Sharing(),
              log:Log = new Log(),
              timestamp:string = ''){
    this.rowid = rowid;
    this.remoteId = remoteid;
    this.name=name;
    this.src=src;
    this.owner=owner;
    this.status=status;
    this.people = people;
    this.sharing = sharing;
    this.log =log;
    this.timestamp = timestamp;
    this.remoteSrc = remoteSrc;
  }



  addPerson(name,phone,minor){
    this.people.push(new Person(name,phone,minor))
  }

  public findRightHolder(phone)
  {
    if (!this.people)
      return null;

    for (let i in this.people) {
      for (let j in this.people[i].rightholders) {
        if (this.people[i].rightholders[j].phone && this.people[i].rightholders[j].phone == phone) {
          return this.people[i].rightholders[j];
        }
      }
    }
  }

  public rightholders()
  {
    let rightholders = new Array();
    for (let i in this.people) {
      for (let j in this.people[i].rightholders){
        rightholders.push(this.people[i].rightholders[j])
      }
    }
    return rightholders;
  }
  //buscamos ese rightholder en la imagen
  public changeRightHolderStatus(phone,newstatus) {
    if (!this.people)
      return false;

    let rh = this.findRightHolder(phone);
    if (rh)
      rh.status = newstatus;
    else
      return false;

  }

  public getSharing(profile){
    if (!profile)
      return this.sharing;
    if (this.owner == profile.phone) {
      return this.sharing;
    }else{
      let rh = this.findRightHolder(profile.phone);
      if (rh){
        return rh.sharing;
      }else {
        return null;
      }
    }
  }

  public getTextSharing() {
    if (this.status == Constants.STATUS_CREADA) {
     return "Plataformas en las que solicitas compartir la imagen (click para cambiar):";
    }else if (this.status == Constants.STATUS_PROCESED){
      return "Consentimiento solicitado para las siguientes plataformas:";
    }else if (this.status == Constants.STATUS_PENDING){
      return "Plataformas en las que has solicitado consentimiento";
    }
    return "";
  }

}

export class Entry_log{
  public text:string;
  public timestamp:any;
  constructor(text){
    this.text = text;
    this.timestamp = new Date();
  }
}

export class Log{
  public entries: Array <Entry_log>;
  constructor(){
    this.entries = new Array();
  }
  add(text){
    this.entries.push(new Entry_log(text));
  }
}

export class User{
  rowid:number;
  name: string;
  phone: string;
  dni:string;
  email:string;
  password:string;
  facebook:string;
  instagram:string;
  twitter:string;
  web:string;
  timestamp:string;

  constructor(name){
    this.rowid=-1;
    this.name=name;
    this.phone="";
    this.dni="";
    this.email="";
    this.password="";
    this.facebook="";
    this.twitter="";
    this.instagram="";
    this.web="";
  }
}
/*
export class socialNetworkModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',name:"TEXT",picto:"TEXT",link:"TEXT",extra:'TEXT'}
    let orderby = "ORDER BY name DESC";
    super('social_networks',cols,orderby);
  }
}

export class peoplePhotoModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',photoId:"INTEGER",personId:"INTEGER",extra:'TEXT',timestamp:'TIMESTAMP'}
    let orderby = "ORDER BY photoId DESC";
    super('people_photo',cols,orderby);
  }
}

export class rightHolderModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',personId:"INTEGER",phone:"INTEGER*",email:"TEXT",relation:"TEXT",extra:'TEXT'}
    let orderby = "ORDER BY rightHolderId DESC";
    super('rightholders',cols,orderby);
  }
}

export class personModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',name:"TEXT",minor:"BOOLEAN",extra:'TEXT'}
    let orderby = "ORDER BY name,phone,email DESC";
    super('persons',cols,orderby);
  }
}

export class photoRightModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',photoId:"INTEGER",rightHolderId:"INTEGER",status:"INTEGER",timestamp:"TIMESTAMP",extra:'TEXT'}
    let orderby = "ORDER BY rightHolderId,status DESC";
    super('photo_rights',cols,orderby);
  }
}

export class photoShare extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',photoId:"INTEGER",socialNetworkId:"INTEGER",timestamp:"TIMESTAMP",socialLink:"TEXT",extra:'TEXT'}
    let orderby = "ORDER BY timestamp DESC";
    super('photo_shares',cols,orderby);
  }
}
*/
