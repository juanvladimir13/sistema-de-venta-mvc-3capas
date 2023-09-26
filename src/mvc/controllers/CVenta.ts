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

    const table = this.model.list();
    this.view.setTable(table);
    this.view.clearData();
    return this.view.getHTML();
  }

  save(): HTMLElement {
    this.model.setData(this.view.getData());
    this.model.setDataDetallesVenta(this.view.getDataDetallesVenta());

    const model = this.model.save();

    if (!model) {
      this.view.setDataError('Error');
      this.view.setTable(this.model.list());
      return this.view.getHTML();
    }

    this.view.setData(model);
    this.view.setTable(this.model.list());
    return this.view.getHTML();
  }

  delete(id: number): void {
    const state = this.model.delete(id);
    if (!state)
      this.view.setDataError('Error');

    this.view.clearData();
    this.view.setTable(this.model.list());
  }

  find(id: number): void {
    const data = this.model.find(id);
    if (!data) {
      this.view.setDataError('error');
      return;
    }

    this.view.setData(data);
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

      const id = element.getAttribute('data-row') || '';
      const item = this.view.inputDetallesVenta.querySelector(`#${id}`) as HTMLDivElement;

      this.view.inputDetallesVenta.removeChild(item);
    })
  }
}