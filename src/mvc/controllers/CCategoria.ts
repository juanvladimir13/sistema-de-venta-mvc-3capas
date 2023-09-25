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
  
  list(): void {
    const table = this.model.list();
    this.view.setTable(table);
  }

  create(): HTMLElement {
    this.list();
    this.view.clearData();
    return this.view.getHTML();
  }

  save(): HTMLElement {
    const data = this.view.getData();
    this.model.setData(data);
    const model = this.model.save();
    
    !model ? this.view.setDataError('Error') : this.view.setData(model);
    
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