import { Categoria, Producto } from '../../interfaces/system';
import { TemplateMethod } from '../../utils/template_method';
import { NCategoria } from '../negocio/NCategoria';
import { NProducto } from '../negocio/NProducto';

export class PProducto extends TemplateMethod {
  private id:number;
  private negocio: NProducto;
  private negocioCategoria: NCategoria;

  private component: HTMLElement;

  public btnSave: HTMLButtonElement;
  public btnCreate: HTMLButtonElement;

  private inputId: HTMLInputElement;
  private inputNombre: HTMLInputElement;
  private inputPrecio: HTMLInputElement;
  private inputCategoria: HTMLSelectElement;

  public outputTable: HTMLTableElement;
  private outputError: HTMLParagraphElement;

  constructor() {
    super();

    this.id = 0;
    this.negocio = new NProducto();
    this.negocioCategoria = new NCategoria();

    const $template = document.querySelector<HTMLTemplateElement>('#producto');
    const $templateContent = $template?.content.querySelector<HTMLElement>('#container');
    this.component = $templateContent?.cloneNode(true) as HTMLElement;

    this.component.querySelector('h3')!.textContent = 'Capas Producto';

    this.btnCreate = this.component.querySelector('#btnCreate') as HTMLButtonElement;
    this.btnSave = this.component.querySelector('#btnSave') as HTMLButtonElement;

    this.inputId = this.component.querySelector('#id') as HTMLInputElement;
    this.inputNombre = this.component.querySelector('#nombre') as HTMLInputElement;
    this.inputPrecio = this.component.querySelector('#precio') as HTMLInputElement;

    this.inputCategoria = this.component.querySelector('#categoria_id') as HTMLSelectElement;

    this.outputTable = this.component.querySelector('#table') as HTMLTableElement;
    this.outputError = this.component.querySelector('#errors') as HTMLParagraphElement;

    this._initListener();
  }
  
  setId(id:number):void {
    this.id = id;
  }

  getData(): Producto {
    return {
      id: Number(this.inputId.value),
      nombre: this.inputNombre.value,
      precio: Number(this.inputPrecio.value),
      categoria_id: Number(this.inputCategoria.value)
    }
  }

  setData(data: Producto): void {
    this.inputId.value = String(data.id);
    this.inputNombre.value = data.nombre;
    this.inputPrecio.value = String(data.precio);
    this.inputCategoria.value = String(data.categoria_id);
  }

  clearData(): void {
    this.inputId.value = '0';
    this.inputNombre.value = '';
    this.inputPrecio.value = '';
  }

  setDataError(message: string): void {
    this.outputError.textContent = message;
  }

  setCategoriasList(rows: Categoria[]): void {
    this.inputCategoria.innerHTML = '';
    rows.forEach(
      item => {
        const option = document.createElement('option');
        option.value = String(item.id);
        option.textContent = item.nombre;

        this.inputCategoria.append(option);
      }
    )
  }
  
  rowToString(row:any): string {
    return `<tr>
    <td>${row.nombre}</td>
    <td>${row.precio}</td>
    <td width="50px">
      <button data-id="${row.id}" data-type="view">🔎</button>
      <button data-id="${row.id}" data-type="delete">❌</button>
    </td>
    </tr>`
  }

  getTable(): HTMLTableSectionElement{
    return this.outputTable.querySelector('tbody') as HTMLTableSectionElement;
  }

  create(): HTMLElement {
    this.list();
    this.clearData();
    this.setCategorias();
    return this.getHTML();
  }

  setCategorias(): void {
    const categorias = this.negocioCategoria.list();
    this.setCategoriasList(categorias);
  }

  save(): HTMLElement {
    const data = this.getData();
    this.negocio.setData(data);
    const model = this.negocio.save();

    if (!model) {
      this.setDataError('Error');
      this.list();
      return this.getHTML();
    }

    this.setData(model);
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

  getHTML(): HTMLElement {
    return this.component;
  }

  list(): void {
    const table = this.negocio.list();
    this.setTable(table);
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