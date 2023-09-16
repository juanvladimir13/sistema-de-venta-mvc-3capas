import { Producto } from "../../interfaces/system";
import { DProducto } from "../datos/DProducto";

export class NProducto {
  private data:DProducto;

  constructor(){
    this.data = new DProducto();
  }

  setData(data:Producto): void{
    this.data.setData(data);
  }

  save(): Producto| undefined{
    return this.data.save();
  }

  delete(id:number):boolean{
    return this.data.delete(id);
  }

  list():Producto[] {
    return this.data.list();
  }
}