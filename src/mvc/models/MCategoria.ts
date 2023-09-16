import { Categoria } from "../../interfaces/system";
import { DatabaseJson } from "../../utils/database_json";

export class MCategoria {
  private id: number;
  private nombre: string;
  private descripcion: string;

  private database: DatabaseJson<Categoria>;

  constructor() {
    this.id = 0;
    this.nombre = '';
    this.descripcion = '';

    this.database = new DatabaseJson('categoria');
  }

  setData(data: Categoria): void {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
  }

  save(): Categoria | undefined {
    const data: Categoria = {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion
    };

    return this.id == 0 ?
      this.database.insert(data) :
      this.database.update(data);
  }

  delete(id:number):boolean {
    return this.database.delete(id);
  }

  list(): Categoria[] {
    return this.database.list();
  }
}