import { MVenta } from "../models/MVenta";
import { VVenta } from "../views/VVenta";
import { MProducto } from '../models/MProducto';

export class CVenta {
  private id: number;
  private model: MVenta;
  private view: VVenta;
  private modelProducto: MProducto;

  constructor() {
    this.model = new MVenta();
    this.view = new VVenta();
    this.modelProducto = new MProducto();
    this.id = 0;
    this._initListener();
  }
  setId(id:number):void{
    this.id = id;
  }

  create(): HTMLElement {
    this.setProductos();
    
    this.list();
    this.view.clearData();
    return this.view.getHTML();
  }
  
  setProductos():void{
    const productos = this.modelProducto.list();
    this.view.setProductos(productos);
  }

  save(): HTMLElement {
    const dataVenta = this.view.getData();
    const dataDetalleVenta = this.view.getDataDetallesVenta();
    
    this.model.setData(dataVenta);
    this.model.setDataDetallesVenta(dataDetalleVenta);

    const model = this.model.save();

    !model ? this.view.setDataError('Error'): this.view.setData(model);
    
    this.list();
    return this.view.getHTML();
  }
  
  saveDetalleVenta(): HTMLElement {
    this.model.setData(this.view.getData());
    this.model.setDataDetallesVenta(this.view.getDataDetallesVenta());

    const model = this.model.saveDetalleVenta(this.model.getId());

    if (!model) {
      this.view.setDataError('Error');
      this.list();
      return this.view.getHTML();
    }
    
    this.listDetalleVenta();
    this.list();
    return this.view.getHTML();
  }

  delete(): void {
    const state = this.model.delete(this.id);
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

  find(): void {
    const data = this.model.find(this.id);
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
      if (element.getAttribute('data-type') == 'delete'){
        this.setId(Number(id));
        this.delete();
      }
        

      if (element.getAttribute('data-type') == 'view'){
        this.setId(Number(id));
        this.find();
      }
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
      this.view.inputDetallesVenta.removeChild(item);
    })
  }
}