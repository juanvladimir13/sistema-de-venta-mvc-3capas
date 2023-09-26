import { Venta, DetalleVenta, Producto } from '../../interfaces/system';
import { NProducto } from '../negocio/NProducto';
import { NVenta } from '../negocio/NVenta';

export class PVenta {
  private component: HTMLElement;

  public btnSave: HTMLButtonElement;
  public btnCreate: HTMLButtonElement;
  public btnAppend: HTMLButtonElement;

  private inputId: HTMLInputElement;
  private inputFecha: HTMLInputElement;
  private inputMontoTotal: HTMLInputElement;

  public inputDetallesVenta: HTMLDivElement;
  public outputTable: HTMLTableElement;
  private outputError: HTMLParagraphElement;

  private negocio: NVenta;

  constructor() {
    this.negocio = new NVenta();

    const $template = document.querySelector<HTMLTemplateElement>('#venta');
    const $templateContent = $template?.content.querySelector<HTMLElement>('#container');
    this.component = $templateContent?.cloneNode(true) as HTMLElement;

    this.component.querySelector('h3')!.textContent = 'Capas Venta';

    this.btnCreate = this.component.querySelector('#btnCreate') as HTMLButtonElement;
    this.btnSave = this.component.querySelector('#btnSave') as HTMLButtonElement;
    this.btnAppend = this.component.querySelector('#btnAppend') as HTMLButtonElement;

    this.inputId = this.component.querySelector('#id') as HTMLInputElement;
    this.inputFecha = this.component.querySelector('#fecha') as HTMLInputElement;
    this.inputMontoTotal = this.component.querySelector('#montoTotal') as HTMLInputElement;

    this.inputDetallesVenta = this.component.querySelector('#detallesVenta') as HTMLDivElement;
    this.outputTable = this.component.querySelector('#table') as HTMLTableElement;
    this.outputError = this.component.querySelector('#errors') as HTMLParagraphElement;

    this._initListener();
  }

  getData(): Venta {
    return {
      id: Number(this.inputId.value),
      fecha: this.inputFecha.value,
      montoTotal: Number(this.inputMontoTotal.value)
    };
  }

  getDataDetallesVenta(): DetalleVenta[] {
    const detalleVenta: DetalleVenta[] = [];

    this.inputDetallesVenta.childNodes.forEach((div) => {
      if (div.nodeName != 'DIV') return;

      const id = (div as HTMLDivElement).querySelector('input[name="id"]') as HTMLInputElement;
      const cantidad = (div as HTMLDivElement).querySelector('input[name="cantidad"]') as HTMLInputElement;
      const precio = (div as HTMLDivElement).querySelector('input[name="precio"]') as HTMLInputElement;
      const producto_id = (div as HTMLDivElement).querySelector('select[name="producto_id"]') as HTMLSelectElement;

      detalleVenta.push({
        id: Number(id.value),
        producto_id: Number(producto_id.value),
        venta_id: Number(this.inputId.value),
        cantidad: Number(cantidad.value),
        precio: Number(precio.value),
        subTotal: 0
      });
    });

    return detalleVenta;
  }

  setData(data: Venta): void {
    this._setData(data);
    this._setDataDetallesVenta(data.detallesVenta!);
  }

  _setData(data: Venta): void {
    this.inputId.value = String(data.id);
    this.inputFecha.value = data.fecha;
    this.inputMontoTotal.value = String(data.montoTotal);
  }

  _setDataDetallesVenta(detallesVenta: DetalleVenta[]): void {
    this.inputDetallesVenta.innerHTML = '';
    const divDetalleVenta = this.component.querySelector('#detalleVenta') as HTMLDivElement;

    detallesVenta.forEach(detalleVenta => {
      const id = `dv-${detalleVenta.id}`;

      const inputDetalleVenta = divDetalleVenta.cloneNode(true) as HTMLDivElement;
      inputDetalleVenta.removeAttribute('style');
      inputDetalleVenta.setAttribute('id', id);

      const btnDelete = inputDetalleVenta.querySelector('button') as HTMLButtonElement;
      const inputId = inputDetalleVenta.querySelector('input[name="id"]') as HTMLInputElement;
      const inputCantidad = inputDetalleVenta.querySelector('input[name="cantidad"]') as HTMLInputElement;
      const inputPrecio = inputDetalleVenta.querySelector('input[name="precio"]') as HTMLInputElement;
      const inputProducto_id = inputDetalleVenta.querySelector('select[name="producto_id"]') as HTMLSelectElement;

      btnDelete.setAttribute('data-row', id);

      inputId.value = String(detalleVenta.id);
      inputCantidad.value = String(detalleVenta.cantidad);
      inputPrecio.value = String(detalleVenta.precio);
      inputProducto_id.value = String(detalleVenta.producto_id);

      this.inputDetallesVenta.append(inputDetalleVenta);
    });
  }

  clearData(): void {
    this.inputId.value = '0';
    this.inputFecha.value = '';
    this.inputMontoTotal.value = '';
    this.inputDetallesVenta.innerHTML = '';
  }

  setDataError(message: string): void {
    this.outputError.textContent = message;
  }

  setTable(rows: Venta[]): void {
    let cells = ''

    rows.forEach(row => {
      cells += `<tr>
      <td>${row.fecha}</td>
      <td>${row.montoTotal}</td>
      <td width="50px">
        <button data-id="${row.id}" data-type="view">🔎</button>
        <button data-id="${row.id}" data-type="delete">❌</button>
      </td>
      </tr>`
    });

    const tbody = this.outputTable.querySelector('tbody') as HTMLTableSectionElement;
    tbody.innerHTML = cells;
  }

  getHTML(): HTMLElement {
    return this.component;
  }

  inflaterSelectProducto(productos: Producto[]): void {
    const inputDetalleVenta = this.component.querySelector('#detalleVenta') as HTMLDivElement;
    const inputProductoId = inputDetalleVenta.querySelector('select') as HTMLSelectElement;

    inputProductoId.innerHTML = '';
    productos.forEach((producto) => {
      const option = document.createElement('option') as HTMLOptionElement;
      option.value = String(producto.id);
      option.textContent = producto.nombre;
      inputProductoId.append(option);
    });
  }

  appendDetalleVenta(): void {
    const id = 'dv-' + String(Date.now());

    const divDetalleVenta = this.component.querySelector('#detalleVenta') as HTMLDivElement;
    const inputDetalleVenta = divDetalleVenta.cloneNode(true) as HTMLDivElement;
    const btnDelete = inputDetalleVenta.querySelector('button') as HTMLButtonElement;

    inputDetalleVenta.removeAttribute('style');
    inputDetalleVenta.setAttribute('id', id);
    btnDelete.setAttribute('data-row', id);

    this.inputDetallesVenta.append(inputDetalleVenta);
  }

  create(): HTMLElement {
    const producto = new NProducto();
    this.inflaterSelectProducto(producto.list());

    const table = this.negocio.list();
    this.setTable(table);
    this.clearData();
    return this.getHTML();
  }

  save(): HTMLElement {
    this.negocio.setData(this.getData());
    this.negocio.setDataDetallesVenta(this.getDataDetallesVenta());

    const model = this.negocio.save();

    if (!model) {
      this.setDataError('Error');
      this.setTable(this.negocio.list());
      return this.getHTML();
    }

    this.setData(model);
    this.setTable(this.negocio.list());
    return this.getHTML();
  }

  delete(id: number): void {
    const state = this.negocio.delete(id);
    if (!state)
      this.setDataError('Error');

    this.clearData();
    this.setTable(this.negocio.list());
  }

  find(id: number): void {
    const data = this.negocio.find(id);
    if (!data) {
      this.setDataError('error');
      return;
    }

    this.setData(data);
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
      if (element.getAttribute('data-type') == 'delete')
        this.delete(Number(id));

      if (element.getAttribute('data-type') == 'view')
        this.find(Number(id));
    });

    this.btnAppend.addEventListener('click', () => {
      this.appendDetalleVenta();
    });

    this.inputDetallesVenta.addEventListener('click', (evt) => {
      const element = evt.target as HTMLElement;
      if (element.nodeName != 'BUTTON')
        return;

      const id = element.getAttribute('data-row') || '';
      const item = this.inputDetallesVenta.querySelector(`#${id}`) as HTMLDivElement;

      this.inputDetallesVenta.removeChild(item);
    })
  }
}