import { DetalleVenta, Venta } from "../../interfaces/system";
import { DVenta } from "../datos/DVenta";

export class NVenta {
  private dato: DVenta;

  constructor() {
    this.dato = new DVenta();
  }

  setData(data: Venta): void {
    this.dato.setData(data);
  }

  setDataDetallesVenta(data: DetalleVenta[]): void {
    this.dato.setDataDetallesVenta(data);
  }

  save(): Venta | undefined {
    return this.dato.save();
  }

  delete(id: number): boolean {
    return this.dato.delete(id);
  }

  find(id: number): Venta | undefined {
    return this.dato.find(id);
  }

  list(): Venta[] {
    return this.dato.list();
  }
}