import { Categoria } from "../interfaces/system";

export abstract class TemplateMethod {

  setTable(rows: Categoria[]): void {
    let cells = ''

    rows.forEach(row => {
      cells += this.rowToString(row);
    });

    const tbody = this.getTable();
    tbody.innerHTML = cells;
  }

  abstract rowToString(row:any): string;
  abstract getTable(): HTMLTableSectionElement;
}