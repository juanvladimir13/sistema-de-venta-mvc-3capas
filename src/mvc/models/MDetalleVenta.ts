import { DetalleVenta } from "../../interfaces/system";
import { DatabaseJson } from "../../utils/database_json";

export class MDetalleVenta {
  private id: number;
  private venta_id: number;
  private producto_id: number;
  private cantidad: number;
  private precio: number;

  private montoTotal: number;

  private database: DatabaseJson<DetalleVenta>;

  constructor() {
    this.id = 0;
    this.venta_id = 0;
    this.producto_id = 0;
    this.cantidad = 0;
    this.precio = 0;
    this.montoTotal = 0;

    this.database = new DatabaseJson('detalleventa');
  }

  getId(): number {
    return this.id;
  }

  setVentaId(ventaId: number): void {
    this.venta_id = ventaId;
  }

  setData(data: DetalleVenta): void {
    this.id = data.id;
    this.venta_id = data.venta_id;
    this.producto_id = data.producto_id;
    this.cantidad = data.cantidad;
    this.precio = data.precio;
    this.montoTotal = data.cantidad * data.precio;
  }

  save(): DetalleVenta | undefined {
    const data: DetalleVenta = {
      id: this.id,
      venta_id: this.venta_id,
      producto_id: this.producto_id,
      cantidad: this.cantidad,
      precio: this.precio,
      montoTotal: this.montoTotal
    };

    return this.id == 0 ?
      this.database.insert(data) :
      this.database.update(data);
  }

  delete(id: number): boolean {
    return this.database.delete(id);
  }

  find(id: number): DetalleVenta | undefined {
    return this.database.find(id);
  }

  list(ventaId: number): DetalleVenta[] {
    const rows = this.database.list();
    return rows.filter(item => item.venta_id == ventaId);
  }

  getMontoTotal(ventaId: number): number {
    const rows = this.list(ventaId);
    let sum = 0;
    rows.forEach(row => sum += row.montoTotal ?? 0);
    return sum;
  }
}