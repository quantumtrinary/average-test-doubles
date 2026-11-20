import { NumberSource } from "../../src/number_source.ts";

/** Fake: in-memory "file system" mapping pseudo paths to number series. */
export class FakeNumberSource implements NumberSource {
  private files: Map<string, Array<number>> = new Map();

  constructor(private path: string) {}

  public addFile(path: string, numbers: Array<number>): void {
    this.files.set(path, [...numbers]);
  }

  public readNumbers(): Promise<Array<number>> {
    const numbers = this.files.get(this.path);
    if (numbers === undefined) {
      return Promise.reject(new Deno.errors.NotFound(this.path));
    }
    return Promise.resolve([...numbers]);
  }
}
