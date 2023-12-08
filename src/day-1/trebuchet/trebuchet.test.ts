import {
  ITrebuchet,
  Trebuchet,
  parseLines,
  dropLetters,
  matchAndReplaceNumericChars,
} from "./trebuchet";

import { originalDoc } from "./utils";

const mockDocument = `
a1b2
c34d
ef5g
`;

/*
[
[1,2],
[3,4],
[5, 5]
]
12 + 24 + 55 = 
*/

const mockDocument2 = `
eightfivesssxxmgthreethreeone1sevenhnz
hzdlftdtfqfdbxgsix9onetwo13
29threelgxljfhrjr
pxvmbjprllmbfpzjxsvhc5
seven2jtgjltvzbcdnjtsfiveonebhkzld
twothreesixeight6eight6
nptjqqxoneninert1927
`;
/*
[8,7],
[6,3],
[2,3],
[5,5],
[7,1],
[2,6],
[1,7]
*/

describe("trebuchet", () => {
  let sut: ITrebuchet;

  const getSut = () => {
    return new Trebuchet(mockDocument);
  };

  describe("getSum", () => {
    it("✅ should return the correct sum", () => {
      sut = getSut();
      expect(sut.getSum()).toBe(101);
    });

    it("✅ should return the correct sum", () => {
      sut = new Trebuchet(originalDoc);

      expect(sut.getSum()).toEqual(342);
    });
  });
});

describe("utils", () => {
  describe("parseLines", () => {
    it("✅ should be defined", () => {
      expect(parseLines).toBeDefined();
    });

    it("✅ should return the correctly parsed lines", () => {
      const result = [
        [1, 2],
        [3, 4],
        [5, 5],
      ];

      expect(parseLines(mockDocument)).toEqual(result);
    });
  });

  describe("dropLetters", () => {
    it("✅ should be defined", () => {
      expect(dropLetters).toBeDefined();
    });

    it("✅ should return the correct value", () => {
      expect(dropLetters("1")).toEqual([1, 1]);
    });

    it("✅ should return zero if string is a single non-numeric character", () => {
      expect(dropLetters("a")).toEqual([0]);
    });

    it("✅ should return the correct value when only one character is number", () => {
      expect(dropLetters("a1")).toEqual([1, 1]);
    });

    it("✅ should return the correct value", () => {
      expect(dropLetters("a1b2")).toEqual([1, 2]);
    });
  });

  describe("matchAndReplaceNumericChars", () => {
    it("✅ should be defined", () => {
      expect(matchAndReplaceNumericChars).toBeDefined();
    });

    it("should return the correct string", () => {
      const input = "9fourxxmdqmmlrbpqgznone8lvtxftmfpseven";
      const result = "94xxmdqmmlrbpqgzn18lvtxftmfp7";

      expect(matchAndReplaceNumericChars(input)).toEqual(result);
    });
  });
});
