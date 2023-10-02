import { DetalleVenta, Venta } from '../../interfaces/system';
import { DatabaseJson } from '../../utils/database_json';

import { MDetalleVenta } from './MDetalleVenta';

export class MVenta {
  private id: number;
  private fecha: string;
  private montoTotal: number;

  private detallesVenta: MDetalleVenta[];

  private database: DatabaseJson<Venta>;

  constructor() {
    this.id = 0;
    this.fecha = '';
    this.montoTotal = 0;
    this.detallesVenta = [];

    this.database = new DatabaseJson('venta');
  }

  getId(): number {
    return this.id;
  }

  setData(data: Venta): void {
    this.id = data.id;
    this.fecha = data.fecha;
    this.montoTotal = data.montoTotal;
  }

  setDataDetallesVenta(data: DetalleVenta[]): void {
    this.detallesVenta = [];

    data.forEach((detalle) => {
      const modelDetalle = new MDetalleVenta();
      modelDetalle.setData(detalle);
      this.addDetallesVenta(modelDetalle);
    });
  }

  addDetallesVenta(detalleVenta: MDetalleVenta): void {
    this.detallesVenta.push(detalleVenta);
  }

  save(): Venta | undefined {
    const data: Venta = {
      id: this.id,
      fecha: this.fecha,
      montoTotal: this.montoTotal
    };

    const venta = this.database.save(data);

    if (!venta) return undefined;

    this.setData(venta);
    this.saveDetalleVenta(this.id);

    const montoTotal = new MDetalleVenta().getMontoTotal(this.id);

    this.setMontoTotal(montoTotal);

    const ventaTmp = this.database.update({
      id: this.id,
      fecha: this.fecha,
      montoTotal: this.montoTotal

    });

    if (!ventaTmp) return undefined;

    return {
      ...ventaTmp,
      detallesVenta: this.findDetallesVenta(venta.id)
    }
  }

  setMontoTotal(montoTotal: number): void {
    this.montoTotal = montoTotal;
  }

  saveDetalleVenta(ventaId:number): boolean {
    this._savePrepareDetalleVenta(ventaId);

    this.detallesVenta.forEach((detalleVenta) => {
      detalleVenta.setVentaId(ventaId);
      detalleVenta.save();
    });

    return true;
  }

  _savePrepareDetalleVenta(ventaId: number): void {
    const modelDetalleVenta = new MDetalleVenta();
    const detallesVentas = modelDetalleVenta.list(ventaId);

    detallesVentas.forEach(item => {
      const detalleVenta = this.detallesVenta.find(index =>
        index.getId() == item.id
      );

      if (!detalleVenta)
        modelDetalleVenta.delete(item.id);
    });
  }

  delete(id: number): boolean {
    return this.database.delete(id);
  }

  deleteDetalleVenta(ventaId: number): boolean {
    const modelDetalleVenta = new MDetalleVenta();
    return modelDetalleVenta.deleteDetalleVenta(ventaId);
  }

  deleteDetalleVentaItem(id: number): boolean {
    const modelDetalleVenta = new MDetalleVenta();
    return modelDetalleVenta.delete(id);
  }

  find(id: number): Venta | undefined {
    const venta = this.database.find(id);
    if (!venta) return undefined;

    return {
      ...venta,
      detallesVenta: this.findDetallesVenta(venta.id)
    }
  }

  findDetallesVenta(ventaId: number): DetalleVenta[] {
    const detallesVenta = new MDetalleVenta();
    return detallesVenta.list(ventaId);
  }

  list(): Venta[] {
    return this.database.list();
  }
}