import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {Platform} from "ionic-angular";
import {photoModel, userModel} from "../../models/model";
import {LinkedList} from "../../models/linkedlist";

@Injectable()
export class DbProvider {
  dbConnection : any;
  // Instructions
  drop    = "DROP TABLE IF EXISTS ";
  create    = "CREATE TABLE IF NOT EXISTS ";
  selectAll = "SELECT * FROM ";
  insert    = "REPLACE INTO ";
  update    = "UPDATE ";
  delete    = "DELETE FROM ";
  values : any = [];
  database : SQLiteObject;
  platform;
  tables: LinkedList;
  development = false;


  constructor(private sqlite: SQLite,platform: Platform) {
    this.database = null;
    this.dbConnection = {
      name: 'allowapp.db',
      location: 'default'
    };
    this.platform = platform;
    this.tables = new LinkedList(new userModel())
    this.tables.append(new photoModel());

  }

  connect() : Promise<any>{
    if (this.database == null){
      return this.sqlite.create(this.dbConnection).then((db: SQLiteObject) => {
        this.database = db;
        return this.database;
      })
    }else{
      return Promise.resolve(this.database);
    }

  }


   dropTables(){
    if(!this.database)
      return Promise.reject("Error no existe base de datos");

    // Llamada recursiva sobre todas las tablas
    return this.dropTable(this.tables.head);
  }

  createTables(){
    if(!this.database)
      return Promise.reject("Error no existe base de datos");

    // Llamada recursiva sobre todas las tablas
    return this.createTable(this.tables.head);
  }


  createTable(model){
    let sql = this.create + model.value.table + model.value.getSqlCols();
    if (this.development)
      console.log("CREATE, SQL: "+sql);
    if(!this.database)
      return Promise.reject("Error no existe base de datos");

    return this.database.executeSql(sql, {}).then(res => {
        console.log('Creada la tabla,'+model.value.table);
        if (model.next != null)
          return this.createTable(model.next);

      }).catch(e => {
        console.log("Error creando "+sql,e)
      });

  }

  dropTable(model){
    let sql = this.drop + model.value.table;
    if (this.development)
      console.log("DROP, SQL: "+sql);
    if(!this.database)
      return Promise.reject("Error no existe base de datos");

    this.database.executeSql(sql, {}).then(() => {
        console.log('Destruida la tabla,'+model.value.table);
        if (model.next != null)
          return this.dropTable(model.next);

      })
      .catch(e => {
        console.log("Error creando "+sql,e)
      });
  }

  getData(model,where?:string){

    let sql = this.selectAll + model.table + " " + model.orderby;
    if (where) {
      sql += " WHERE ";
      sql += where;
    }
    if (this.development)
      console.log("SELECT, SQL: "+sql);

    return this.connect().then( () => {
      return this.database.executeSql(sql, {})
        .then( (res) => {
          let values = [];
          for (var i = 0; i < res.rows.length; i++) {
            let value = res.rows.item(i);
            values.push(value);
          }
          return values;
        })

    });

  }

  saveData(model,values):  Promise<any> {
    let sql= this.insert + model.table + model.getSqlCols(true) +" VALUES " + model.getSqlColValues(values);

    if (this.development)
      console.log("INSERT, SQL: "+ sql);

    if(!this.database)
      return Promise.reject("Error no existe base de datos");

    let v = model.setSqlValues(values);
    return this.database.executeSql(sql,v)
      .then((res) => {
        console.log("Fila insertada "+res.insertId + ", sql:"+sql + ",values: " + v.toString());
        values.rowid = res.insertId;
        return res;

      })
      .catch(e => {
        console.log("Error guardando datos en sql: "+sql + ",values: " + v.toString(),e);
      });

  }

  updateData(model,namevalue,newvalue,nameid,id) {

    let sql = this.update + model.table + " SET ?=? WHERE ? = ?";

    if (this.development)
      console.log("UPDATE, SQL: "+sql);

    if(!this.database)
      return Promise.reject("Error no existe base de datos");


    return this.database.executeSql(sql,[namevalue,newvalue,nameid,id])
      .then(res => {
        console.log(res);

      })
      .catch(e => {
        console.log(e);

      });
  }

  deleteData(model,nameid,id) {

    let sql = 'DELETE FROM ' + model + ' WHERE '+ nameid + '=' +id;

    if (this.development)
      console.log("DELETE, SQL: "+sql);

    if(!this.database)
      return Promise.reject("Error no existe base de datos");


    this.database.executeSql(sql,[])
      .then(res => {
        console.log(res);
      })
      .catch(e => console.log(e));
  }

}
