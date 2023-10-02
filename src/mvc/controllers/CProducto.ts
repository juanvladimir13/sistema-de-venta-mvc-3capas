import { MCategoria } from "../models/MCategoria";
import { MProducto } from "../models/MProducto";
import { VProducto } from '../views/VProducto';


export class CProducto {
  private id: number;
  private model: MProducto;
  private view: VProducto;

  private modelCategoria: MCategoria;

  constructor() {
    this.model = new MProducto();
    this.view = new VProducto();
    this.modelCategoria = new MCategoria();

    this.id = 0;

    this._initListener();
  }

  setId(id: number): void {
    this.id = id;
  }

  create(): HTMLElement {
    this.list();
    this.view.clearData();

    this.setCategorias();

    return this.view.getHTML();
  }

  setCategorias(): void {
    const categorias = this.modelCategoria.list();
    this.view.setCategorias(categorias);
  }

  save(): HTMLElement {
    const data = this.view.getData();
    this.model.setData(data);
    const model = this.model.save();

    !model ? this.view.setDataError('Error') : this.view.setData(model);

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

  find(): void {
    const data = this.model.find(this.id);
    if (!data) {
      this.view.setDataError('error');
      return;
    }

    this.view.setData(data!);
  }

  list(): void {
    const rows = this.model.list();
    this.view.setTable(rows);
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
      if (element.getAttribute('data-type') == 'delete') {
        this.setId(Number(id));
        this.delete();
      }


      if (element.getAttribute('data-type') == 'view') {
        this.setId(Number(id));
        this.find();
      }
    });
  }
}