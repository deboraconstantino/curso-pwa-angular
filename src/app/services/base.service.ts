import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { OnlineOfflineService } from './online-offline.service';
import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
export abstract class BaseService<T extends {id: string}> {

  private db: Dexie;
  private table: Dexie.Table<T, any> = null;

  protected http: HttpClient;
  protected onlineOfflineService: OnlineOfflineService;

  constructor(protected injector: Injector,
              protected nomeTabela: string,
              protected urlAPI: string) {
    this.http = this.injector.get(HttpClient);
    this.onlineOfflineService = this.injector.get(OnlineOfflineService);

    this.ouvirStatusConexao();
    this.iniciarIndexedDb();
   }

  private iniciarIndexedDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      [this.nomeTabela]: 'id'
    });
    this.table = this.db.table(this.nomeTabela);
  }

  private salvarAPI(tabela: T) {
    this.http.post(this.urlAPI, tabela)
      .subscribe(
        () => alert('Seguro cadastrado com sucesso!'),
        (erro) => console.log(erro)
      );
  }

  private async salvarIndexedDb(tabela: T) {
    try {
      await this.table.add(tabela);
      const todosTabelas: T[] = await this.table.toArray();
      console.log('Seguro foi salvo no indexedDb', todosTabelas);
    } catch (error) {
      console.log('Erro ao incluir seguro no indexedDb', error);
    }
  }

  private async enviarIndexedDbParaApi() {
    const todosTabelas: T[] = await this.table.toArray();

    for (const tabela of todosTabelas) {
      this.salvarAPI(tabela);
      await this.table.delete(tabela.id);
      console.log(`Seguro com o id ${tabela.id} foi excluído com sucesso.`);
    }
  }

    cadastrar(tabela: T) {
      if (this.onlineOfflineService.isOnline) {
        this.salvarAPI(tabela);
      } else {
        this.salvarIndexedDb(tabela);
      }
    }

    listar(): Observable<T[]> {
      return this.http.get<T[]>(this.urlAPI);
    }

    private ouvirStatusConexao() {
      this.onlineOfflineService.statusConexao
      .subscribe(online => {
        if (online) {
          this.enviarIndexedDbParaApi();
        } else {
          console.log('Estou offline');
        }
      });
    }
}
