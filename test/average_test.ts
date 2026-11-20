import { assertEquals, assertRejects } from "@std/assert";
import { Average } from "../src/average.ts";
import { FileAccess } from "../src/file_access.ts";
import { FakeNumberSource } from "./doubles/fake_number_source.ts";
import {
  ConfigurableStubNumberSource,
  HardCodedStubNumberSource,
} from "./doubles/stub_number_source.ts";
import { MockNumberSource } from "./doubles/mock_number_source.ts";
import { SpyFileAccess } from "./doubles/spy_file_access.ts";

// Fake

function fakeWithFiles(path: string): FakeNumberSource {
  const fake = new FakeNumberSource(path);
  fake.addFile("/path/to/an/empty/file", []);
  fake.addFile("/path/to/some/other/file", [1, 2, 3, 4, 5]);
  fake.addFile("C:\\test-data\\third-file.txt", [7, 34, 2]);
  return fake;
}

Deno.test("fake: mean of [1..5] is 3", async () => {
  // Arrange
  const average = new Average(fakeWithFiles("/path/to/some/other/file"));
  // Act
  const result = await average.computeMeanOfFile();
  // Assert
  assertEquals(result, 3);
});

Deno.test("fake: mode of [7, 34, 2] contains all values", async () => {
  const average = new Average(fakeWithFiles("C:\\test-data\\third-file.txt"));
  assertEquals(await average.computeModeOfFile(), [7, 34, 2]);
});

Deno.test("fake: mean of empty file is NaN", async () => {
  const average = new Average(fakeWithFiles("/path/to/an/empty/file"));
  assertEquals(await average.computeMeanOfFile(), NaN);
});

Deno.test("fake: unknown path rejects", async () => {
  const average = new Average(fakeWithFiles("/does/not/exist"));
  await assertRejects(() => average.computeMeanOfFile(), Deno.errors.NotFound);
});

// Stub

Deno.test("stub (hard-coded): mean of [1..5] is 3", async () => {
  const average = new Average(new HardCodedStubNumberSource());
  assertEquals(await average.computeMeanOfFile(), 3);
});

Deno.test("stub (configurable): mean of [1..5] is 3", async () => {
  const average = new Average(
    new ConfigurableStubNumberSource([1, 2, 3, 4, 5]),
  );
  assertEquals(await average.computeMeanOfFile(), 3);
});

// Mock

Deno.test("mock: mean of [1..5] is 3, source read exactly once", async () => {
  const mock = new MockNumberSource();
  const average = new Average(mock);
  assertEquals(mock.calls, 0);

  const result = await average.computeMeanOfFile();

  assertEquals(result, 3);
  assertEquals(mock.calls, 1);
});

// Spy

Deno.test("spy: readNumbers called once and returns file numbers", async () => {
  // Arrange: real file in a temporary location
  const path = await Deno.makeTempFile({ suffix: ".txt" });
  try {
    await Deno.writeTextFile(path, "4\n8\n15\n16\n23\n42\n");
    const spy = new SpyFileAccess(new FileAccess(path));
    const average = new Average(spy);

    // Act
    const result = await average.computeMeanOfFile();

    // Assert
    assertEquals(result, 18);
    assertEquals(spy.calls, 1);
    assertEquals(spy.returned, [[4, 8, 15, 16, 23, 42]]);
  } finally {
    await Deno.remove(path);
  }
});
