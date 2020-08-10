import { SeguroService } from './../../services/seguro.service';
import { MarcaCarroService } from './../../services/marca-carro.service';
import { Component, OnInit } from '@angular/core';
import { Seguro } from 'src/app/models/Seguro';
import { Observable } from 'rxjs';
import { MarcaCarro } from 'src/app/models/MarcaCarro';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-cadastro-seguro',
  templateUrl: './cadastro-seguro.component.html',
  styleUrls: ['./cadastro-seguro.component.css']
})
export class CadastroSeguroComponent implements OnInit {

  public seguro = new Seguro();
  public marcasCarro$: Observable<MarcaCarro[]>;

  constructor(private marcaCarroService: MarcaCarroService,
              private seguroService: SeguroService,
              private pushNotificationService: PushNotificationService) { }

  ngOnInit(): void {
    this.marcasCarro$ = this.marcaCarroService.getMarcas();
  }

  cadastrar() {
    this.seguro.id = this.seguro.placaCarro;
    this.seguroService.cadastrar(this.seguro);
  }

  enviarNotificacao() {
    this.pushNotificationService.enviar();
  }

}
