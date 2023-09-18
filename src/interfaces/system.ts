export interface Categoria {
  id: number;
  nombre:string;
  descripcion:string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria_id:number;
}

export interface Venta {
  id:number;
  fecha: string;
  montoTotal:number;
  detallesVenta?: DetalleVenta[];
}

export interface DetalleVenta {
  id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  subTotal: number;
}