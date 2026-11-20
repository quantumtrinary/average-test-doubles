import { NumberSource } from "../../src/number_source.ts";

/** Stub: always returns the same hard-coded numbers. */
export class HardCodedStubNumberSource implements NumberSource {
  public readNumbers(): Promise<Array<number>> {
    return Promise.resolve([1, 2, 3, 4, 5]);
  }
}

/** Stub: returns the numbers passed to the constructor. */
export class ConfigurableStubNumberSource implements NumberSource {
  constructor(private numbers: Array<number>) {}

  public readNumbers(): Promise<Array<number>> {
    return Promise.resolve([...this.numbers]);
  }
}
