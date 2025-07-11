import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OpcoesCategoriaComponent } from '../../../../shared/component/opcoes-categoria/opcoes-categoria.component';
import { CarrosselComponent } from '../../../../shared/component/carrossel/carrossel.component';
import { MaisPostadosComponent } from '../../../../shared/component/mais-postados/mais-postados.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiV1Loja } from '../../../../services/apiCategorias/apiV1Loja.service';
import { footerComponent } from '../../../../shared/component/foother/footer.component';
import { headerComponent } from '../../../../shared/component/header/header.component';
import { MobileNavbarComponent } from '../../../../shared/component/mobile-navbar/mobile-navbar.component';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CarrinhoComponent } from '../carrinho/carrinho.component';

@Component({
  selector: 'app-homeZapdai',
  standalone: true,
  imports: [headerComponent, OpcoesCategoriaComponent,
    CarrosselComponent, MaisPostadosComponent, footerComponent,
    MobileNavbarComponent, MatTabsModule, CarrinhoComponent, MatIconModule],
  templateUrl: './homeZapdai.component.html',
  styleUrl: './homeZapdai.component.scss'
})
export class HomeZapdaiComponent implements OnInit, AfterViewInit {
  @ViewChild("element") elemnt!: ElementRef;
  ativo?: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private apiCategosrias: ApiV1Loja, public router: Router) { }
  categorias: any;
  produtos: any
  ativaCar?: boolean;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.elemnt.nativeElement;
      element.addEventListener('scroll', this.setTop.bind(this));
    } 
  }
  async ngOnInit() {
    this.getAllCategorias()
    this.getAllProdutos()
  }
  async getAllCategorias() {
    try {
      const response = await await firstValueFrom(this.apiCategosrias.findAllCategorias());
      this.categorias = response.categorias;
    } catch (erro) {
    }
  }
  @HostListener('scroll', ['$event'])
  setTop() {
    const scrollHeight = this.elemnt.nativeElement.scrollHeight;
    const clientHeight = this.elemnt.nativeElement.clientHeight;
    const scrollTop = this.elemnt.nativeElement.scrollTop;
    if (scrollTop + clientHeight > scrollHeight - 10) {
      this.ativo = true;


    } else {
      this.ativo = false;
    }
  }

  async getAllProdutos() {
    try {
      const response = await firstValueFrom(this.apiCategosrias.findAllProdutos());

      const listaFiltrada = response?.filter((empresa: any) => empresa != null) ?? [];

      this.produtos = listaFiltrada.map((empresa: any) => ({
        ...empresa,
        produtos: Array.isArray(empresa.produtos) ? empresa.produtos : []
      }));
    } catch (error) {
      this.produtos = [];
    }
  }





  onWindows() {
    this.elemnt.nativeElement.scroll(
      {
        top: 0,
        behavior: "smooth"
      }
    )
  }
  navigate(name: any) {
    this.router.navigateByUrl(`/categoria/${name}`)
  }
  navigateDetalhesProdutos(name: any) {
    this.router.navigate([`/produto/detalhes/${String(name)}`])
  }

  async getNomesCategorias(): Promise<any[]> {
    return this.categorias;
  }
  ativaCarrinho() {
    this.ativaCar = !this.ativaCar;
  }

}
