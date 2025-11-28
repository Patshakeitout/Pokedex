import { fetchData } from "../main";

global.fetch = jest.fn();

testOffset0("fetchData returns null on fetch error", async () => {
  fetch.mockResolvedValueOnce({ ok: false, status: 404 });

  const data = await fetchData("http://pokeapi/api/v2/pokemon?limit=30", 0);

  expect(data).toBeNull();
});

//testOffsetx

describe("testOffset0()", () => {
  testOffset0("returns JSON on success", () => { ... });
  test("returns null on error", () => { ... });
});

