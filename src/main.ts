import { createRouter } from 'routerjs';

import './style.css';

import { CCategoria } from './mvc/controllers/CCategoria';
import { CProducto } from './mvc/controllers/CProducto';
import { PCategoria } from './capas/presentacion/PCategoria';
import { PProducto } from './capas/presentacion/PProducto';

const root = document.querySelector('#app') as HTMLDivElement;

const mvcCategoria = new CCategoria();
const mvcProducto = new CProducto();
const capaCategoria = new PCategoria();
const capaProducto = new PProducto();

createRouter()
  .get('/mvccategoria', () => {
    mvcCategoria.create();

    root.innerHTML = '';
    root.append(mvcCategoria.showForm());
  })
  .get('/mvccategoria/:id', (req: any) => {
    const id = req.params.id;
    mvcCategoria.delete(id);

    root.innerHTML = '';
    root.append(mvcCategoria.showForm());
  }).get('/mvcproducto', () => {
    mvcProducto.create();
    
    root.innerHTML = '';
    root.append(mvcProducto.showForm());
  })
  .get('/mvcproducto/:id', (req: any) => {
    const id = req.params.id;
    mvcProducto.delete(id);

    root.innerHTML = '';
    root.append(mvcProducto.showForm());
  })
  .get('/capacategoria', () => {
    capaCategoria.create();

    root.innerHTML = '';
    root.append(capaCategoria.showForm());
  })
  .get('/capacategoria/:id', (req: any) => {
    const id = req.params.id;
    capaCategoria.delete(id);

    root.innerHTML = '';
    root.append(capaCategoria.showForm());
  })

  .get('/capaproducto', () => {
    capaProducto.create();

    root.innerHTML = '';
    root.append(capaProducto.showForm());
  })
  .get('/capaproducto/:id', (req: any) => {
    const id = req.params.id;
    capaProducto.delete(id);

    root.innerHTML = '';
    root.append(capaProducto.showForm());
  })
  .run();