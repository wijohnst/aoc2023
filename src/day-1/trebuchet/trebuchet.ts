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

  //   console.log(lines);
  return lines;
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

export const dropLetters = (s: string): number[] => {
  // handle sing character edge case
  if (s.length === 1 && isNaN(Number(s))) return [0];

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

export const matchAndReplaceNumericChars = (s: string): string => {
  const numericMatcher = new RegExp(
    /(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/,
    "g"
  );

  return s.replace(
    numericMatcher,
    (match: keyof typeof nameToNumberMap) => nameToNumberMap[match]
  );
};
