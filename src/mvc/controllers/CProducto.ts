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

    const categorias = this.modelCategoria.list();
    this.view.setCategorias(categorias);
    return this.view.getHTML();
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
    this.model.delete(id);
    window.location.assign('/mvcproducto');
  }

  _initListener(): void {
    this.view.btnCreate.addEventListener('click', () => {
      this.create();
    });

    this.view.btnSave.addEventListener('click', () => {
      this.save();
    })
  }
}