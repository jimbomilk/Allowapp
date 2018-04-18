/**
 * Created by jimbomilk on 12/04/2018.
 */
export class superModel{

  table : any;
  cols : any;
  orderby : any;

  constructor(table,cols,orderby){

    this.table = table;
    this.cols = cols;
    this.orderby = orderby;
  }

  getSqlCols(){
    var ret="(rowid INTEGER PRIMARY KEY";
    for(var prop in this.cols){
      ret += ","
      ret += prop;
      ret += " ";
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
  // values  : {id:'2342423',name:'pepe',email:'qwerwer@ee.com',phone:'234234234',backup:true,twitter:true}
  setSqlValues(values) {
    var setValues = [];
    // Primero guardamos los indices
    for (var prop in  this.cols) {
      if (prop != 'extra') {
        if (values[prop]) {
          setValues.push(values[prop]);
        }
        else {
          if (this.cols[prop] == 'TEXT')
            setValues.push("");
          else if (this.cols[prop] == 'BOOLEAN')
            setValues.push(false);
          else if (this.cols[prop] == 'NUMBER')
            setValues.push(-1);
        }
      }else{
        // Extra has all the data because is gonna be very useful to keep the integrity of the data and to make backups!
        setValues.push(JSON.stringify(values));
      }
    }
    return setValues;

  }

}

export class userModel extends superModel
{
  constructor(){
    let cols = {id:'TEXT',name:'TEXT',phone:'TEXT',email:'TEXT',extra:'TEXT'};
    let orderby = "ORDER BY name DESC";
    super('users',cols,orderby);
  }
}
