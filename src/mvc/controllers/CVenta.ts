import { MVenta } from "../models/MVenta";
import { VVenta } from "../views/VVenta";
import { MProducto } from '../models/MProducto';

export class CVenta {
  private model: MVenta;
  private view: VVenta;

  constructor() {
    this.model = new MVenta();
    this.view = new VVenta();

    this._initListener();
  }

  create(): HTMLElement {
    const producto = new MProducto();
    this.view.inflaterSelectProducto(producto.list());

    this.list();
    this.view.clearData();
    return this.view.getHTML();
  }

  save(): HTMLElement {
    this.model.setData(this.view.getData());
    this.model.setDataDetallesVenta(this.view.getDataDetallesVenta());

    const model = this.model.save();

    if (!model) {
      this.view.setDataError('Error');
      this.list();
      return this.view.getHTML();
    }

    this.view.setData(model);
    this.list();
    return this.view.getHTML();
  }
  
  saveDetalleVenta(): HTMLElement {
    this.model.setData(this.view.getData());
    this.model.setDataDetallesVenta(this.view.getDataDetallesVenta());

    const model = this.model.saveDetalleVenta();

    if (!model) {
      this.view.setDataError('Error');
      this.list();
      return this.view.getHTML();
    }
    
    this.listDetalleVenta();
    this.list();
    return this.view.getHTML();
  }

  delete(id: number): void {
    const state = this.model.delete(id);
    if (!state)
      this.view.setDataError('Error');

    this.view.clearData();
    this.list();
  }
  
  deleteDetalleVenta(): void {
    this.model.setData(this.view.getData());
    const state = this.model.deleteDetalleVenta(this.model.getId());
    if (!state)
      this.view.setDataError('Error');

    this.view.clearData();
    this.list();
  }
  
  deleteDetalleVentaItem(detalleVentaId:number): void {
    const state = this.model.deleteDetalleVenta(detalleVentaId);
    if (!state)
      this.view.setDataError('Error');

    this.listDetalleVenta();
  }

  find(id: number): void {
    const data = this.model.find(id);
    if (!data) {
      this.view.setDataError('error');
      return;
    }

    this.view.setData(data);
  }
  
  list(): void {
    const rows = this.model.list();
    this.view.setTable(rows);
  }
  
  listDetalleVenta(): void {
    this.model.setData(this.view.getData());    
    const rowsDetalle = this.model.findDetallesVenta(this.model.getId());    
    this.view.setDataDetallesVenta(rowsDetalle);
  }

  _initListener(): void {
    this.view.btnCreate.addEventListener('click', () => {
      this.create();
    });

    this.view.btnSave.addEventListener('click', () => {
      this.save();
    });

    this.view.outputTable.addEventListener('click', (evt) => {
      const element = evt.target as HTMLElement;
      if (element.nodeName != 'BUTTON')
        return;

      const id = element.getAttribute('data-id') || 0;
      if (element.getAttribute('data-type') == 'delete')
        this.delete(Number(id));

      if (element.getAttribute('data-type') == 'view')
        this.find(Number(id));
    });

    this.view.btnAppend.addEventListener('click', () => {
      this.view.appendDetalleVenta();
    });

    this.view.inputDetallesVenta.addEventListener('click', (evt) => {
      const element = evt.target as HTMLElement;
      if (element.nodeName != 'BUTTON')
        return;

      const detalleId = element.getAttribute('data-id') || 0;
      const id = element.getAttribute('data-row') || '';
      const item = this.view.inputDetallesVenta.querySelector(`#${id}`) as HTMLDivElement;

      this.deleteDetalleVentaItem(Number(detalleId));
      this.view.inputDetallesVenta.removeChild(item);
    })
  }
}