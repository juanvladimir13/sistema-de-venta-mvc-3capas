import { Categoria } from '../../interfaces/system';
import { TemplateMethod } from '../../utils/template_method';
import { NCategoria } from '../negocio/NCategoria';

export class PCategoria extends TemplateMethod {
  private id:number;
  private negocio: NCategoria;

  private component: HTMLElement;

  public btnSave: HTMLButtonElement;
  public btnCreate: HTMLButtonElement;

  private inputId: HTMLInputElement;
  private inputNombre: HTMLInputElement;
  private inputDescripcion: HTMLInputElement;

  public outputTable: HTMLTableElement;
  private outputError: HTMLParagraphElement;

  constructor() {
    super();
    const $template = document.querySelector<HTMLTemplateElement>('#categoria');
    const $templateContent = $template?.content.querySelector<HTMLElement>('#container');
    this.component = $templateContent?.cloneNode(true) as HTMLElement;

    this.component.querySelector('h3')!.textContent = 'Capas Categoria';

    this.btnCreate = this.component.querySelector('#btnCreate') as HTMLButtonElement;
    this.btnSave = this.component.querySelector('#btnSave') as HTMLButtonElement;

    this.inputId = this.component.querySelector('#id') as HTMLInputElement;
    this.inputNombre = this.component.querySelector('#nombre') as HTMLInputElement;
    this.inputDescripcion = this.component.querySelector('#descripcion') as HTMLInputElement;

    this.outputTable = this.component.querySelector('#table') as HTMLTableElement;
    this.outputError = this.component.querySelector('#errors') as HTMLParagraphElement;

    this.id = 0;
    this.negocio = new NCategoria();
    this._initListener();
  }
  
  setId(id:number):void {
    this.id = id;
  }

  getData(): Categoria {
    return {
      id: Number(this.inputId.value),
      nombre: this.inputNombre.value,
      descripcion: this.inputDescripcion.value
    }
  }

  setData(data: Categoria): void {
    this.inputId.value = String(data.id);
    this.inputNombre.value = data.nombre;
    this.inputDescripcion.value = data.descripcion;
  }

  clearData(): void {
    this.inputId.value = '0';
    this.inputNombre.value = '';
    this.inputDescripcion.value = '';
    this.outputError.textContent = '';
  }

  setDataError(message: string): void {
    this.outputError.textContent = message;
  }

  getTable(): HTMLTableSectionElement {
    return this.outputTable.querySelector('tbody') as HTMLTableSectionElement;
  }

  rowToString(row:any): string {
    return `<tr>
    <td>${row.nombre}</td>
    <td>${row.descripcion}</td>
    <td width="50px">
      <button data-id="${row.id}" data-type="view">🔎</button>
      <button data-id="${row.id}" data-type="delete">❌</button>
    </td>
    </tr>`;
  }

  getHTML(): HTMLElement {
    return this.component;
  }

  list(): void {
    const table = this.negocio.list();
    this.setTable(table);
  }

  create(): HTMLElement {
    this.list();
    this.clearData();
    return this.getHTML();
  }

  save(): HTMLElement {
    const data = this.getData();
    this.negocio.setData(data);
    const model = this.negocio.save();

    !model ? this.setDataError('Error') : this.setData(model);
    
    this.list();
    return this.getHTML();
  }

  delete(): void {
    const state = this.negocio.delete(this.id);
    if (!state)
      this.setDataError('Error');

    this.clearData();
    this.list();
  }

  find(): void {
    const data = this.negocio.find(this.id);
    if (!data) {
      this.setDataError('error');
      return;
    }

    this.setData(data!);
  }

  _initListener(): void {
    this.btnCreate.addEventListener('click', () => {
      this.create();
    });

    this.btnSave.addEventListener('click', () => {
      this.save();
    });

    this.outputTable.addEventListener('click', (evt) => {
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
  }
}