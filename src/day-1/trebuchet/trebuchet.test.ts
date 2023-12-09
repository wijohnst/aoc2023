import axios from "axios";
import { config } from "dotenv";

import {
  ITrebuchet,
  Trebuchet,
  parseLines,
  dropLetters,
  matchAndReplaceNumericChars,
  getComibnedMatcherArray,
} from "./trebuchet";

const mockDocument = `
a1b2
c34d
ef5g
`;

const mockDocument2 = `
eightfivesssxxmgthreethreeone1sevenhnz
hzdlftdtfqfdbxgsix9onetwo13
29threelgxljfhrjr
pxvmbjprllmbfpzjxsvhc5
seven2jtgjltvzbcdnjtsfiveonebhkzld
twothreesixeight6eight6
nptjqqxoneninert1927
`;

// Other test case from aoc
const mockDocument3 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

/* 
[2,9]
[8,3],
[1,3],
[2,4],
[4,2],
[1,4].
[7,6] = 
*/

config();
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

    it("✅ should return the correct sum", async () => {
      const input = await axios.get(
        "https://adventofcode.com/2023/day/1/input",
        {
          headers: {
            Cookie: `session=${process.env.SESSION}`,
          },
        }
      );
      sut = new Trebuchet(input.data);

      expect(sut.getSum()).not.toEqual(54780); //too hight
      expect(sut.getSum()).not.toEqual(54491); //too low
      expect(sut.getSum()).toEqual(54770);
    });

    it("✅ should return the correct sum - document 3", () => {
      sut = new Trebuchet(mockDocument3);

      expect(sut.getSum()).toEqual(281);
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

    const cases: [string, number[]][] = [
      ["eightfivesssxxmgthreethreeone1sevenhnz", [8, 7]],
      ["7beighttwob", [7, 2]],
      ["jxcgpx5ninemsqqfmkpnj", [5, 9]],
      ["7onesztpkqmjlfourhrrcf3threeone", [7, 1]],
      ["7qcnb", [7, 7]],
      ["hhtqxplnxconeninenine5sixxqgrjccpb3four", [1, 4]],
      ["42", [4, 2]],
      ["1sixbl9seventwotgtfcstqgv4lc", [1, 4]],
      ["sevenjbs2fourmjglztjfive", [7, 5]],
      ["8j", [8, 8]],
      ["six33", [6, 3]],
      ["5sixhxdjmkkmdbskls", [5, 6]],
      ["t43", [4, 3]],
      ["inesevensrzxkzpmgz8kcjxsbdftwoner", [7, 1]],
    ];

    test.each(cases)(`%p should be %p`, (testString, tuple) => {
      expect(dropLetters(testString)).toEqual(tuple);
    });
  });

  describe("matchAndReplaceNumericChars", () => {
    it("✅ should be defined", () => {
      expect(matchAndReplaceNumericChars).toBeDefined();
    });

    const cases: [string, string][] = [
      ["dblfhbt7sevenninesix2threethree", "dblfhbt7796233"],
      [
        "9fourxxmdqmmlrbpqgznone8lvtxftmfpseven",
        "94xxmdqmmlrbpqgzn18lvtxftmfp7",
      ],
      ["ninesevensrzxkzpmgz8kcjxsbdftwoner", "97srzxkzpmgz8kcjxsbdf21r"],
    ];

    test.each(cases)("%p should return %p", (input, output) => {
      expect(matchAndReplaceNumericChars(input)).toEqual(output);
    });
  });

  describe("includesComibedMatcher", () => {
    it("✅ should be defined", () => {
      expect(getComibnedMatcherArray).toBeDefined();
    });

    it("✅ should return true", () => {
      expect(getComibnedMatcherArray("twone")).toEqual(["twone"]);
    });
  });
});
