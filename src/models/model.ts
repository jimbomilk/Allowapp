/**
 * Created by jimbomilk on 12/04/2018.
 */
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

  getSqlCols(){
    var ret="(rowid INTEGER PRIMARY KEY";
    for(var prop in this.cols){
      ret += ","
      ret += prop;
      ret += " ";
      if (this.cols[prop].charAt(0)=='*') {
        ret += this.cols[prop].substring(1, this.cols[prop].length);
        ret += this.unique;
      }
      else
        ret += this.cols[prop];

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

  getSqlColValues(){
    let ret="(";
    let i=0;
    for(let prop in this.cols){
      if (i++>0)
        ret += ","
      ret += "?";
    }
    ret += ")";
    return ret;
  }

  setUpdateValues(values){
    let ret = "";
    let i=0;
    for (var prop in  this.cols) {
      if (i++>0)
        ret += ","
      ret += prop;
      ret += "=";
      ret += values[prop];
    }
  }

  // values  : {id:'2342423',name:'pepe',email:'qwerwer@ee.com',phone:'234234234',backup:true,twitter:true}
  // output : ['2342423','pepe','qwerwer@ee.com',...]
  setSqlValues(values) {
    this.values = [];
    // Primero guardamos los indices
    for (var prop in  this.cols) {
      if (prop != 'extra') {
        if (values[prop]) {
          this.values.push(values[prop]);
        }
        else {
          if (this.cols[prop] == 'TEXT' || this.cols[prop] == '*TEXT')
            this.values.push('');
          else if (this.cols[prop] == 'BOOLEAN' || this.cols[prop] == '*BOOLEAN')
            this.values.push(false);
          else if (this.cols[prop] == 'NUMBER' || this.cols[prop] == '*NUMBER')
            this.values.push(-1);
          else if (this.cols[prop] == 'DATE' || this.cols[prop] == '*DATE')
            this.values.push(0);
          else if (this.cols[prop] == 'DATETIME' || this.cols[prop] == '*DATETIME')
            this.values.push(0);
        }
      }else{
        // Extra has all the data because is gonna be very useful to keep the integrity of the data and to make backups!
        this.values.push(JSON.stringify(values));
      }
    }
    return this.values;

  }


}

export class logModel extends superModel
{
  constructor(){
    let cols = {action:'TEXT',timestamp:'DATETIME',extra:'TEXT'};
    let orderby = "ORDER BY timestamp DESC";
    super('logs',cols,orderby);
  }
}

export class userModel extends superModel
{
  constructor(){
    let cols = {phone:'*TEXT',email:'TEXT',extra:'TEXT'};
    let orderby = "ORDER BY phone DESC";
    super('users',cols,orderby);
  }
}

export class socialNetworkModel extends superModel
{
  constructor(){
    let cols = {name:"TEXT",picto:"TEXT",link:"TEXT",extra:'TEXT'}
    let orderby = "ORDER BY name DESC";
    super('social_networks',cols,orderby);
  }
}

export class photoModel extends superModel
{
  constructor(){
    let cols = {owner:"NUMBER",timestamp:"DATETIME",source:"TEXT",extra:'TEXT',status:"NUMBER",statusTime:"DATETIME"}
    let orderby = "ORDER BY timestamp DESC";
    super('photos',cols,orderby);
  }
}

export class peoplePhotoModel extends superModel
{
  constructor(){
    let cols = {photoId:"NUMBER",personId:"NUMBER",extra:'TEXT'}
    let orderby = "ORDER BY photoId DESC";
    super('people_photo',cols,orderby);
  }
}

export class rightHolderModel extends superModel
{
  constructor(){
    let cols = {personId:"NUMBER",rightHolderId:"NUMBER",relation:"TEXT",extra:'TEXT'}
    let orderby = "ORDER BY rightHolderId DESC";
    super('rightholders',cols,orderby);
  }
}

export class personModel extends superModel
{
  constructor(){
    let cols = {id:"NUMBER",name:"TEXT",phone:"NUMBER",email:"TEXT",extra:'TEXT'}
    let orderby = "ORDER BY name,phone,email DESC";
    super('persons',cols,orderby);
  }
}

export class photoRightModel extends superModel
{
  constructor(){
    let cols = {photoId:"NUMBER",rightHolderId:"NUMBER",status:"NUMBER",timestamp:"DATE",extra:'TEXT'}
    let orderby = "ORDER BY rightHolderId,status DESC";
    super('photo_rights',cols,orderby);
  }
}

export class photoShare extends superModel
{
  constructor(){
    let cols = {photoId:"NUMBER",socialNetworkId:"NUMBER",timestamp:"DATE",socialLink:"TEXT",extra:'TEXT'}
    let orderby = "ORDER BY timestamp DESC";
    super('photo_shares',cols,orderby);
  }
}
