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
      if(prop=='rowid' && !values[prop])
        ret += 'NULL';
      else
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
          if (prop == 'rowid') {
            // no se pone nada
          }
          else if (this.cols[prop] == 'TEXT' || this.cols[prop] == '*TEXT') {
            this.values.push("''");
            values[prop] = "";
          }
          else if (this.cols[prop] == 'BOOLEAN' || this.cols[prop] == '*BOOLEAN') {
            this.values.push(false);
            values[prop] = false;
          }
          else if (this.cols[prop] == 'INTEGER' || this.cols[prop] == '*INTEGER') {
            this.values.push(0);
            values[prop] = 0;
          }
          else if (this.cols[prop] == 'DATE' || this.cols[prop] == '*DATE' || this.cols[prop] == 'DATETIME' || this.cols[prop] == '*DATETIME') {
            this.values.push(0);
            values[prop] = 0;
          }
          else if (this.cols[prop] == 'TIMESTAMP' || this.cols[prop] == '*TIMESTAMP') {
            this.values.push(this.currentTimestamp());
            values[prop] =  this.currentTimestamp() ;
          }
        }
      }
    }
    if (values.extra)
      this.values.push(JSON.stringify(values.extra));
    else
      this.values.push(JSON.stringify(values));



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

export class logModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',photoId:'INTEGER',action:'TEXT',timestamp:'TIMESTAMP',extra:'TEXT'};
    let orderby = "ORDER BY timestamp DESC";
    super('logs',cols,orderby);
  }
}

export class userModel extends superModel
{
  constructor(){
    let cols = {rowid:'INTEGER',name:'TEXT',phone:'TEXT',email:'TEXT',timestamp:'TIMESTAMP',extra:'TEXT'};
    let orderby = "ORDER BY phone DESC";
    super('users',cols,orderby);
  }
}

export class photoModel extends superModel
{
  constructor(){
    // status : 0  - creada
    //          10 - enviada
    //          20 - recibida
    let cols = {rowid:'INTEGER',owner:"TEXT",timestamp:"TIMESTAMP",status:"INTEGER",statusTime:"TIMESTAMP",extra:'TEXT'}
    let orderby = "ORDER BY timestamp DESC";
    super('photos',cols,orderby);
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
