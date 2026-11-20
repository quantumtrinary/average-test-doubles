import { assertEquals, assertRejects } from "@std/assert";
import { Average } from "../src/average.ts";
import { FakeNumberSource } from "./doubles/fake_number_source.ts";

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
