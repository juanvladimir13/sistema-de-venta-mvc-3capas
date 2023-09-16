import { Categoria } from '../../interfaces/system';

export class VCategoria {
  private component: HTMLDivElement;

  public btnSave: HTMLButtonElement;
  public btnCreate: HTMLButtonElement;

  private inputId: HTMLInputElement;
  private inputNombre: HTMLInputElement;
  private inputDescripcion: HTMLInputElement;

  private outputError: HTMLParagraphElement;

  constructor() {
    const $template = document.querySelector<HTMLTemplateElement>('#categoria');
    const $templateContent = $template?.content.querySelector<HTMLElement>('.container');
    this.component = $templateContent?.cloneNode(true) as HTMLDivElement;

    this.component.querySelector('h3')!.textContent = 'MVC Categoria';

    this.btnCreate = this.component.querySelector('#btnCreate') as HTMLButtonElement;
    this.btnSave = this.component.querySelector('#btnSave') as HTMLButtonElement;

    this.inputId = this.component.querySelector('#id') as HTMLInputElement;
    this.inputNombre = this.component.querySelector('#nombre') as HTMLInputElement;
    this.inputDescripcion = this.component.querySelector('#descripcion') as HTMLInputElement;

    this.outputError = this.component.querySelector('#errors') as HTMLParagraphElement;
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
  }

  setDataError(message: string): void {
    this.outputError.textContent = message;
  }

  setTable(rows: Categoria[]): void {
    let tbody = ''

    rows.forEach(row => {
      tbody += `<tr>
      <td>${row.nombre}</td>
      <td>${row.descripcion}</td>
      <td><a href="/mvccategoria/${row.id}">Eliminar</a></td>
      </tr>`
    });

    const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th></th>
        </tr>
      </thead>
      ${tbody}
    </table>
    `

    const table = this.component.querySelector('#table') as HTMLTableElement;
    table.innerHTML = tableHTML;
  }

  getComponent(): HTMLDivElement {
    return this.component;
  }
}