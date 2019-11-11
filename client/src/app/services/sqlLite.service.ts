import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public database: SQLiteObject;
  public nameModel = '';
  public rowData: any = [];
  public rowDataDelete: any = [];
  readonly databaseName: string = 'pyps.db';
  readonly tableName: string = 'notes';
  readonly tableDelete: string = 'del';

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
    }).catch(e => console.log(e));
  }

  public createTable() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableName + ' (LiteId INTEGER PRIMARY KEY, id, title, text, photos, completed, latLng, userId)', [])
      .then(() => {
        console.log('Table Created!');
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public tableForDelete() {
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableDelete + ' (LiteId INTEGER PRIMARY KEY, id, title, text, photos, completed, latLng, userId, del)', [])
      .then(() => {
        console.log('Table Created!');
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public async insertRowDelete(note: any) {
    note.latLng = JSON.stringify(note.latLng);
    note.photos = JSON.stringify(note.photos);
    const del = 'delete';
    const { id, title, text, photos, completed, latLng, userId } = note;
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableDelete + '(id, title, text, photos, completed, latLng, userId, del) VALUES (?,?,?,?,?,?,?,?)', [id, title, text, photos, completed, latLng, userId, del])
      .then((a) => {
        console.log('Row Inserted');
      })
      .catch(e => console.log(e));
  }

  public async insertRow(note: any) {
    note.latLng = JSON.stringify(note.latLng);
    note.photos = JSON.stringify(note.photos);
    const { id, title, text, photos, completed, latLng, userId } = note;
    // tslint:disable-next-line: max-line-length
    await this.database.executeSql('INSERT INTO ' + this.tableName + '(id, title, text, photos, completed, latLng, userId) VALUES (?,?,?,?,?,?,?)', [id, title, text, photos, completed, latLng, userId])
      .then((a) => {
        console.log('Row Inserted');
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
            res.rows.item(i).completed = JSON.parse(res.rows.item(i).completed);
            res.rows.item(i).latLng = JSON.parse(res.rows.item(i).latLng);
            res.rows.item(i).photos = JSON.parse(res.rows.item(i).photos);
            this.rowDataDelete.push(res.rows.item(i));
          }
        }
        console.log(this.rowDataDelete);
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
            res.rows.item(i).photos = JSON.parse(res.rows.item(i).photos);
            this.rowData.push(res.rows.item(i));
          }
        }
        console.log(this.rowData);
        return this.rowData;
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
    return this.rowData;
  }

  public deleteRowDelete(item) {
    this.database.executeSql('DELETE FROM ' + this.tableDelete + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        console.log('Row Deleted ADAWDSADSADDSASAD!');
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowOnl(item) {
    this.database.executeSql('DELETE FROM ' + this.tableName + ' WHERE id = ' + "'" + item + "'", [])
      .then(() => {
        console.log('Row Deleted!');
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public deleteRowOff(item) {
    this.database.executeSql('DELETE FROM ' + this.tableName + ' WHERE LiteId = ' + item, [])
      .then(() => {
        console.log('Row Deleted!');
        this.getRows();
      })
      .catch(e => {
        console.log('error ' + JSON.stringify(e));
      });
  }

  public updateId(note) {
    const id = note.id;
    const LiteId = note.LiteId;
    this.database.executeSql('UPDATE ' + this.tableName + ' SET id = ' + "'" + id + "'" + ' WHERE LiteId = ' + "'" + LiteId + "'", []);
  }

  public updateDataOff(note) {
    note.latLng = JSON.stringify(note.latLng);
    note.photos = JSON.stringify(note.photos);
    const { LiteId, title, text, photos, completed, latLng } = note;
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('UPDATE ' + this.tableName + ' SET title = ' + "'" + title + "'" + ', text = ' + "'" + text + "'" + ', photos = ' + "'" + photos + "'" + ', completed = ' + "'" + completed + "'" + ', latLng = ' + "'" + latLng + "'" + ' WHERE LiteId = ' + "'" + LiteId + "'", [])
      .then(() => {
        console.log('ROW UPDATE');
      })
      .catch(e => console.log(e));
  }

  public updateDataOnl(note) {
    note.latLng = JSON.stringify(note.latLng);
    note.photos = JSON.stringify(note.photos);
    const { id, title, text, photos, completed, latLng } = note;
    // tslint:disable-next-line: max-line-length
    this.database.executeSql('UPDATE ' + this.tableName + ' SET title = ' + "'" + title + "'" + ', text = ' + "'" + text + "'" + ', photos = ' + "'" + photos + "'" + ', completed = ' + "'" + completed + "'" + ', latLng = ' + "'" + latLng + "'" + ' WHERE id = ' + "'" + id + "'", [])
      .then(() => {
        console.log('ROW UPDATE');
      })
      .catch(e => console.log(e));
  }

  public dropDB() {
    this.database.executeSql('DROP TABLE ' + this.tableName, []);
  }

  public dropDBDel() {
    this.database.executeSql('DROP TABLE ' + this.tableDelete, []);
  }
}
