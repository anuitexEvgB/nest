import { Note } from 'src/app/models';
import { Sql } from './../models/sqLite.model';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public database: SQLiteObject;
  public nameModel = '';
  public rowData: Note[] = [];
  public rowDataDelete: Note[] = [];
  public rowDataUpdate: Note[] = [];
  readonly databaseName: string = 'pyps.db';
  readonly tableName: string = 'notes';
  readonly tableDelete: string = 'del';
  readonly tableUpdate: string = 'up';

  constructor(
    public sqlite: SQLite,
    private storage: Storage,
  ) {
  }

  public createDB() {
    this.sqlite.create({
      name: this.databaseName,
      location: 'default',
    }).then((db: SQLiteObject) => {
      console.log(JSON.stringify(db));
      this.database = db;
      this.createTable();
      this.tableForDelete();
      this.tableForUpdate();
    }).catch(e => console.log(e));
  }

  public createTable() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableName + ' (LiteId INTEGER PRIMARY KEY, id, title, text, completed, latLng, userId)', [])
      .then(() => {
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public tableForDelete() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableDelete + ' (id, userId)', [])
      .then(() => {
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public tableForUpdate() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableUpdate + ' (LiteId INTEGER PRIMARY KEY, id, title, text, completed, latLng, userId)', [])
      .then(() => {
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public async insertRowUpdate(note: Sql) {
    note.latLng = JSON.stringify(note.latLng);
    const { id, title, text, completed, latLng, userId } = note;
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableUpdate + '(id, title, text, completed, latLng, userId) VALUES (?,?,?,?,?,?)', [id, title, text, completed, latLng, userId])
      .then((a) => {
      })
      .catch(e => console.log(e));
  }

  public async insertRowDelete(id: { id: number; userId: string; }) {
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableDelete + '(id, userId) VALUES (?, ?)', [id.id, id.userId])
      .then((a) => {
      })
      .catch(e => console.log(e));
  }

  public async insertRow(note: Sql) {
    note.latLng = JSON.stringify(note.latLng);
    const { id, title, text, completed, latLng, userId } = note;
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableName + '(id, title, text, completed, latLng, userId) VALUES (?,?,?,?,?,?)', [id, title, text, completed, latLng, userId])
      .then((a) => {
      })
      .catch(e => console.log(e));
  }

  public async getRowsForDelete() {
    let userId = '';
    await this.storage.get('USER_ID').then(user => {
      userId = user;
    });
    await this.database.executeSql('SELECT * FROM ' + this.tableDelete + ' WHERE userId = ' + "'" + userId + "'", [])
      .then((res) => {
        this.rowDataDelete = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            this.rowDataDelete.push(res.rows.item(i));
          }
        }
        return this.rowDataDelete;
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
    return this.rowDataDelete;
  }

  public async getRows() {
    let userId = '';
    await this.storage.get('USER_ID').then(user => {
      userId = user;
    });
    await this.database.executeSql('SELECT * FROM ' + this.tableName + ' WHERE userId = ' + "'" + userId + "'", [])
      .then((res) => {
        this.rowData = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            res.rows.item(i).completed = JSON.parse(res.rows.item(i).completed);
            res.rows.item(i).latLng = JSON.parse(res.rows.item(i).latLng);
            this.rowData.push(res.rows.item(i));
          }
        }
        return this.rowData;
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
    return this.rowData;
  }

   public async getRowsForUpdate() {
    let userId = '';
    await this.storage.get('USER_ID').then(user => {
      userId = user;
    });
    await this.database.executeSql('SELECT * FROM ' + this.tableUpdate + ' WHERE userId = ' + "'" + userId + "'", [])
      .then((res) => {
        this.rowDataUpdate = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            res.rows.item(i).completed = JSON.parse(res.rows.item(i).completed);
            res.rows.item(i).latLng = JSON.parse(res.rows.item(i).latLng);
            this.rowDataUpdate.push(res.rows.item(i));
          }
        }
        return this.rowDataUpdate;
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
    return this.rowDataUpdate;
  }

  public deleteRowDelete(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableDelete + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowUpdate(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableUpdate + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowOnl(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableName + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowOff(item: number) {
    this.database.executeSql('DELETE FROM ' + this.tableName + ' WHERE LiteId = ' + item, [])
      .then(() => {
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public updateId(note: Note) {
    const id = note.id;
    const LiteId = note.LiteId;
    this.database.executeSql('UPDATE ' + this.tableName + ' SET id = ' + "'" + id + "'" + ' WHERE LiteId = ' + "'" + LiteId + "'", []);
  }

  public updateDataOff(note: Sql) {
    note.latLng = JSON.stringify(note.latLng);
    const { LiteId, title, text, completed, latLng } = note;
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('UPDATE ' + this.tableName + ' SET title = ' + "'" + title + "'" + ', text = ' + "'" + text + "'" + ', completed = ' + "'" + completed + "'" + ', latLng = ' + "'" + latLng + "'" + ' WHERE LiteId = ' + "'" + LiteId + "'", [])
      .then(() => {
      })
      .catch(e => console.log(e));
  }

  public updateDataOnl(note: Sql) {
    note.latLng = JSON.stringify(note.latLng);
    const { id, title, text, completed, latLng } = note;
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('UPDATE ' + this.tableName + ' SET title = ' + "'" + title + "'" + ', text = ' + "'" + text + "'" + ', completed = ' + "'" + completed + "'" + ', latLng = ' + "'" + latLng + "'" + ' WHERE id = ' + "'" + id + "'", [])
      .then(() => {
      })
      .catch(e => console.log(e));
  }

  public dropDB() {
    this.database.executeSql('DROP TABLE ' + this.tableName, []);
  }

  public dropDBDel() {
    this.database.executeSql('DROP TABLE ' + this.tableDelete, []);
  }

  public dropDBUpdate() {
    this.database.executeSql('DROP TABLE' + this.tableUpdate, []);
  }
}
