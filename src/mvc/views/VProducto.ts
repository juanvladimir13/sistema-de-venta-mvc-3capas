import { Categoria, Producto } from '../../interfaces/system';
export class VProducto {
  private component: HTMLDivElement;

  public btnSave: HTMLButtonElement;
  public btnCreate: HTMLButtonElement;

  private inputId: HTMLInputElement;
  private inputNombre: HTMLInputElement;
  private inputPrecio: HTMLInputElement;
  private inputCategoria: HTMLSelectElement;

  private outputError: HTMLParagraphElement;

  constructor() {
    const $template = document.querySelector<HTMLTemplateElement>('#producto');
    const $templateContent = $template?.content.querySelector<HTMLElement>('.container');
    this.component = $templateContent?.cloneNode(true) as HTMLDivElement;

    this.component.querySelector('h3')!.textContent = 'MVC Producto';

    this.btnCreate = this.component.querySelector('#btnCreate') as HTMLButtonElement;
    this.btnSave = this.component.querySelector('#btnSave') as HTMLButtonElement;

    this.inputId = this.component.querySelector('#id') as HTMLInputElement;
    this.inputNombre = this.component.querySelector('#nombre') as HTMLInputElement;
    this.inputPrecio = this.component.querySelector('#precio') as HTMLInputElement;

    this.inputCategoria = this.component.querySelector('#categoria_id') as HTMLSelectElement;

    this.outputError = this.component.querySelector('#errors') as HTMLParagraphElement;
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
  }

  clearData(): void {
    this.inputId.value = '0';
    this.inputNombre.value = '';
    this.inputPrecio.value = '';
  }

  setDataError(message: string): void {
    this.outputError.textContent = message;
  }

  setCategorias(rows: Categoria[]): void {
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

  setTable(rows: Producto[]): void {
    let tbody = ''

    rows.forEach(row => {
      tbody += `<tr>
      <td>${row.nombre}</td>
      <td>${row.precio}</td>
      <td>${row.categoria_id}</td>
      <td><a href="/mvcproducto/${row.id}">Eliminar</a></td>
      </tr>`
    });

    const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoria</th>
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