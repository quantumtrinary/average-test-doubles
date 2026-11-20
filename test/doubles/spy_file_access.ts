import { FileAccess } from "../../src/file_access.ts";
import { NumberSource } from "../../src/number_source.ts";

/** Spy: wraps the real FileAccess, records call count and returned values. */
export class SpyFileAccess implements NumberSource {
  public calls = 0;
  public returned: Array<Array<number>> = [];

  constructor(private fileAccess: FileAccess) {}

  public async readNumbers(): Promise<Array<number>> {
    this.calls++;
    const numbers = await this.fileAccess.readNumbers();
    this.returned.push([...numbers]);
    return numbers;
  }
}
