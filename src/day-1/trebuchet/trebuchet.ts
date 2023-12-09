export interface ITrebuchet {
  originalDocument: string;
  getSum: () => number;
}

export class Trebuchet implements ITrebuchet {
  originalDocument: string;

  constructor(originalDocument: string) {
    this.originalDocument = originalDocument;
  }

  getSum = () => {
    const parsedLines = parseLines(this.originalDocument);

    return parsedLines.reduce((sum: number, numberTuple: number[]) => {
      const [a, b] = numberTuple;
      const combinedNum = Number(`${a}${b}`);

      return sum + combinedNum;
    }, 0);
  };
}

export const parseLines = (s: string): number[][] => {
  const lines = s
    .split("\n")
    .filter((s) => s)
    .map((s) => dropLetters(s));

  return lines;
};

export const dropLetters = (s: string): number[] => {
  // handle single character edge case
  if (s.length === 1 && isNaN(Number(s))) {
    return [0];
  }

  const parsedS = matchAndReplaceNumericChars(s);
  const nonNumericMatcher = new RegExp(/[^0-9]/, "g");
  const numberChars: string[] = parsedS
    .replace(nonNumericMatcher, "")
    .split("");

  if (numberChars.length === 1) {
    return [Number(numberChars), Number(numberChars)];
  }

  const q = numberChars
    .map((char: string, index) => {
      if (index === 0) {
        return Number(char);
      }

      if (index === numberChars.length - 1) {
        return Number(char);
      }

      return;
    })
    .filter((s) => s);

  return q as number[];
};

const nameToNumberMap: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

export const matchAndReplaceNumericChars = (s: string): string => {
  let modifiedString = s;
  const combinedMatchers = getComibnedMatcherArray(s);

  if (combinedMatchers.length > 0) {
    combinedMatchers.forEach((matcher: string) => {
      modifiedString = s.replace(
        matcher,
        (match: keyof typeof combinedMatchersToValuesMap) =>
          combinedMatchersToValuesMap[match]
      );
    });
  }

  const matchers = Object.keys(nameToNumberMap).join("|");
  const numericMatcher = new RegExp(`(${matchers})`, "g");

  return modifiedString.replace(
    numericMatcher,
    (match: keyof typeof nameToNumberMap) => nameToNumberMap[match]
  );
};

const combinedMatchersToValuesMap: Record<string, string> = {
  twone: "21",
  oneight: "18",
  twoneight: "218",
  sevenine: "79",
  threeight: "38",
  eightwo: "82",
  threeeighttwo: "382",
};

export const getComibnedMatcherArray = (s: string): RegExpMatchArray | [] => {
  const matcher = new RegExp(
    `(${Object.keys(combinedMatchersToValuesMap).join("|")})`,
    "g"
  );
  return s.match(matcher) ?? [];
};
