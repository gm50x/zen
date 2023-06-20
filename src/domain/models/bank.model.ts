export class Bank {
  constructor(
    readonly id: string,
    readonly compe: string,
    readonly ispb: string,
    readonly name: string,
  ) {
    this.compe = compe?.toUpperCase() === 'N/A' ? null : compe;
  }
}
