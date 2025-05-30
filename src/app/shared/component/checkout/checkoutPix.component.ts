import { Component, Input } from "@angular/core";
import { PixPaymentRespons } from "../../core/types/paymentPagamentopix";
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-checkoutPix",
  standalone: true,
  imports: [QRCodeComponent, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./checkoutPix.component.html",
  styleUrl: "checkoutPix.component.scss"
})

export class CheckoutPixComponent {
  btnActive = false;
  titule: "Copie a chave Pix" | "Copiado" = "Copie a chave Pix";
  @Input() qr: PixPaymentRespons = {
    qrCodeLink: ''
  }
  cortarTexto(texto: string, limite: number): string {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  }
  colcarTexto(valor: string) {
    this.titule = "Copiado"
    navigator.clipboard.writeText(valor).then(() => {
      this.btnActive = true;

    })
  }

  
}

