import { MCategoria } from "../models/MCategoria";
import { MProducto } from "../models/MProducto";
import { VProducto } from '../views/VProducto';


export class CProducto {
  private model: MProducto;
  private view: VProducto;

  private modelCategoria: MCategoria;

  constructor() {
    this.model = new MProducto();
    this.view = new VProducto();
    this.modelCategoria = new MCategoria();

    this._initListener();
  }

  create(): HTMLElement {
    const table = this.model.list();

    this.view.setTable(table);
    this.view.clearData();
    
    this.setCategorias();
    
    return this.view.getHTML();
  }
  
  setCategorias():void {
    const categorias = this.modelCategoria.list();
    this.view.setCategorias(categorias);
  }

  save(): HTMLElement {
    const data = this.view.getData();
    this.model.setData(data);
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

    this.view.setData(data!);
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
  }
}