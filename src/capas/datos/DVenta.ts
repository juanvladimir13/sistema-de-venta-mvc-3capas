import { DetalleVenta, Venta } from '../../interfaces/system';
import { DatabaseJson } from '../../utils/database_json';

import { DDetalleVenta } from './DDetalleVenta';

export class DVenta {
  private id: number;
  private fecha: string;
  private montoTotal: number;

  private detallesVenta: DDetalleVenta[];

  private database: DatabaseJson<Venta>;

  constructor() {
    this.id = 0;
    this.fecha = '';
    this.montoTotal = 0;
    this.detallesVenta = [];

    this.database = new DatabaseJson('venta');
  }

  setData(data: Venta): void {
    this.id = data.id;
    this.fecha = data.fecha;
    this.montoTotal = data.montoTotal;
  }

  setDataDetallesVenta(data: DetalleVenta[]): void {
    this.detallesVenta = [];

    data.forEach((detalle) => {
      const modelDetalle = new DDetalleVenta();
      modelDetalle.setData(detalle);
      this.detallesVenta.push(modelDetalle);
    });
  }

  save(): Venta | undefined {
    const data: Venta = {
      id: this.id,
      fecha: this.fecha,
      montoTotal: this.montoTotal
    };

    const venta = this.id == 0 ?
      this.database.insert(data) :
      this.database.update(data);

    if (!venta) return undefined;

    this._savePrepareDetalleVenta(venta.id);

    this.detallesVenta.forEach((detalleVenta) => {
      detalleVenta.setVentaId(venta.id);
      detalleVenta.save();
    });

    venta.montoTotal = new DDetalleVenta().getMontoTotal(venta.id);
    const ventaTmp = this.database.update(venta);

    if (!ventaTmp) return undefined;

    return {
      ...ventaTmp,
      detallesVenta: this._findDetallesVenta(venta.id)
    }
  }

  _savePrepareDetalleVenta(ventaId: number): void {
    const modelDetalleVenta = new DDetalleVenta();
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

  find(id: number): Venta | undefined {
    const venta = this.database.find(id);
    if (!venta) return undefined;

    return {
      ...venta,
      detallesVenta: this._findDetallesVenta(venta.id)
    }
  }

  _findDetallesVenta(ventaId: number): DetalleVenta[] {
    const detallesVenta = new DDetalleVenta();
    return detallesVenta.list(ventaId);
  }

  list(): Venta[] {
    return this.database.list();
  }
}