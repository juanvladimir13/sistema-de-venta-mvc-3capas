import { Producto } from "../../interfaces/system";
import { DatabaseJson } from "../../utils/database_json";

export class DProducto {
  private id: number;
  private nombre: string;
  private precio: number;
  private categoria_id:number;

  private database: DatabaseJson<Producto>;

  constructor() {
    this.id = 0;
    this.nombre = '';
    this.precio = 0;
    this.categoria_id = 0;

    this.database = new DatabaseJson('producto');
  }

  setData(data: Producto): void {
    this.id = data.id;
    this.nombre = data.nombre;
    this.precio = data.precio;
    this.categoria_id = data.categoria_id;
  }

  save(): Producto | undefined {
    const data: Producto = {
      id: this.id,
      nombre: this.nombre,
      precio: this.precio,
      categoria_id: this.categoria_id
    };

    return this.id == 0 ?
      this.database.insert(data) :
      this.database.update(data);
  }

  delete(id:number):boolean {
    return this.database.delete(id);
  }

  list(): Producto[] {
    return this.database.list();
  }
}