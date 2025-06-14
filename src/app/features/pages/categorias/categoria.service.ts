import { Injectable } from "@angular/core";
import { ApiCategorias } from "../../../services/apiCategorias/apiCategorias.service";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class CategoriaServiceNome{
    constructor(private apiCategosrias:ApiCategorias){

    }
    
  async getNomesCategorias(): Promise<string[]> {
    const response = await firstValueFrom(this.apiCategosrias.findAllCategorias());
    // Garante que response.categorias seja um array
    return Array.isArray(response?.categorias) ? response.categorias : [];
  }
   async getNomesProduto(): Promise<any[]> {
    const response = await firstValueFrom(this.apiCategosrias.findAllProdutos());
    const empresas =  Array.isArray(response) ? response : [];
     const produtos = empresas.flatMap(e => e.produtos || []);
     return produtos;

   }
}