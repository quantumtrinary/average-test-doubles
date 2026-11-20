import { NumberSource } from "../../src/number_source.ts";

/** Mock: returns hard-coded numbers and counts its invocations. */
export class MockNumberSource implements NumberSource {
  public calls = 0;

  public readNumbers(): Promise<Array<number>> {
    this.calls++;
    return Promise.resolve([1, 2, 3, 4, 5]);
  }
}
