/** Supplies a series of numbers, e.g. read from a file. */
export interface NumberSource {
  readNumbers(): Promise<Array<number>>;
}
