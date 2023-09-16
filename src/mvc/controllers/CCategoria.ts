import { MCategoria } from "../models/MCategoria";
import { VCategoria } from '../views/VCategoria';

export class CCategoria {
  private model: MCategoria;
  private view: VCategoria;

  constructor() {
    this.model = new MCategoria();
    this.view = new VCategoria();

    this._initListener();
  }

  create(): HTMLElement {
    const table = this.model.list();

    this.view.setTable(table);
    this.view.clearData();
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
    window.location.assign('/mvccategoria');
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