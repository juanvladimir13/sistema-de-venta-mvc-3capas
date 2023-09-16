import { Categoria } from "../../interfaces/system";
import { DCategoria } from "../datos/DCategoria";

export class NCategoria {
  private data: DCategoria;

  constructor() {
    this.data = new DCategoria();
  }

  setData(data: Categoria): void {
    this.data.setData(data);
  }

  save(): Categoria | undefined {
    return this.data.save();
  }

  delete(id: number): boolean {
    return this.data.delete(id);
  }

  find(id: number): Categoria | undefined {
    return this.data.find(id);
  }

  list(): Categoria[] {
    return this.data.list();
  }
}