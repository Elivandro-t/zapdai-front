import { Injectable } from "@angular/core";
import { ApiV1Loja } from "../../../services/apiCategorias/apiV1Loja.service";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class LojaZapdaiService {
    constructor(private apiCategosrias:ApiV1Loja){

    }
    
  async getNomesCategorias(): Promise<string[]> {
    const response = await firstValueFrom(this.apiCategosrias.findAllCategorias());
    // Garante que response.categorias seja um array
    return Array.isArray(response?.categorias) ? response.categorias : [];
  }
   async getNomesProduto(): Promise<any[]> {
    const response = await firstValueFrom(this.apiCategosrias.findAllProdutos());
    const empresas =  Array.isArray(response) ? response : [];
      const produtos = empresas.flatMap(e =>
      Array.isArray(e?.produtos) ? e.produtos : []
    );
     return produtos;

   }
  async retonrIdEmpres(): Promise<any[]>{
     const response = await firstValueFrom(this.apiCategosrias.findAllProdutos());
    return Array.isArray(response) ? response : [];
   }
   



   
}