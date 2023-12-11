import axios from "axios";
import { config } from "dotenv";

import {
  Game,
  IGame,
  IHand,
  Roll,
  Hand,
  getRollTotal,
  areCubesValid,
  IGameParser,
  GameParser,
  ParsedGame,
  parseGameIdString,
  parseRawHands,
  IMatchParser,
  MatchParser,
  getSumOfValidGamesIds,
} from "./index";
config();

const defaultRuleSet: Roll = {
  red: 5,
  green: 5,
  blue: 5,
};

const defaultRoll = { red: 1, green: 1, blue: 1 };
describe("Game", () => {
  let sut: IGame;

  const defaultRolls: Roll[] = [defaultRoll];

  const getSut = (
    ruleSet: Roll = defaultRuleSet,
    rolls: Roll[] = defaultRolls
  ) => {
    return new Game(ruleSet, 1, rolls);
  };
  it("✅ should be defined", () => {
    sut = getSut();

    expect(sut).toBeDefined();
  });

  it("✅ should return the correct id", () => {
    sut = getSut();

    expect(sut.getId()).toEqual(1);
  });

  it("✅ should return true", () => {
    sut = getSut();

    expect(sut.isValid()).toBe(true);
  });
});

describe("Hand", () => {
  let sut: IHand;

  const getSut = (ruleSet: Roll = defaultRuleSet, roll: Roll = defaultRoll) => {
    return new Hand(ruleSet, roll);
  };

  it("✅ should be defined", () => {
    sut = getSut();

    expect(sut).toBeDefined();
  });

  it("✅ Hand.isValid should be false when rule set total is less than roll total", () => {
    sut = getSut(defaultRuleSet, { red: 20, green: 0, blue: 0 });

    expect(sut.isValid()).toBe(false);
  });

  it("✅ Hand.isValid should be true when rule set total is more than roll total", () => {
    sut = getSut();

    expect(sut.isValid()).toBe(true);
  });
});

describe("getRollTotal", () => {
  it("✅ should return the corect total", () => {
    expect(getRollTotal(defaultRoll)).toEqual(3);
  });
});

describe("areCubesValid", () => {
  it("✅ should return true", () => {
    expect(areCubesValid(defaultRoll, defaultRoll)).toBe(true);
  });

  it("✅ shold return false", () => {
    expect(areCubesValid(defaultRoll, { red: 20, green: 0, blue: 0 })).toBe(
      false
    );
  });
});

const defaultRawGameString =
  "Game 1: 1 green, 2 red, 6 blue; 4 red, 1 green, 3 blue; 7 blue, 5 green; 6 blue, 2 red, 1 green";

const otherRawGameString =
  "Game 2: 3 green, 10 red, 20 blue; 4 red, 1 green, 3 blue; 7 blue, 5 red; 6 blue, 2 red, 1 green";

const defaultRawHands = [
  " 1 green, 2 red, 6 blue",
  " 4 red, 1 green, 3 blue",
  " 7 blue, 5 green",
  " 6 blue, 2 red, 1 green",
];

const defaultRolls: Roll[] = [
  {
    red: 2,
    green: 1,
    blue: 6,
  },
  {
    red: 4,
    green: 1,
    blue: 3,
  },
  {
    red: 0,
    blue: 7,
    green: 5,
  },
  {
    red: 2,
    green: 1,
    blue: 6,
  },
];

const otherRolls: Roll[] = [
  {
    red: 10,
    green: 3,
    blue: 20,
  },
  {
    red: 4,
    green: 1,
    blue: 3,
  },
  {
    red: 5,
    blue: 7,
    green: 0,
  },
  {
    red: 2,
    green: 1,
    blue: 6,
  },
];
describe("GameParser", () => {
  let sut: IGameParser;

  const getSut = (rawGameString: string = defaultRawGameString) => {
    return new GameParser(rawGameString);
  };

  it("✅ should be defined", () => {
    sut = getSut();

    expect(sut).toBeDefined();
  });

  it("✅ GameParser.getParsedGame should return the correctly parsed game", () => {
    sut = getSut();

    const result: ParsedGame = {
      id: 1,
      rolls: defaultRolls,
    };

    expect(sut.getParsedGame()).toEqual(result);
  });

  it("✅ GameParser.getParsedGame should return the correctly parsed game", () => {
    sut = getSut(otherRawGameString);

    const result: ParsedGame = {
      id: 2,
      rolls: otherRolls,
    };

    expect(sut.getParsedGame()).toEqual(result);
  });
});

describe("parseGameIdString", () => {
  it("✅ should return the correct id", () => {
    expect(parseGameIdString("Game 1")).toEqual(1);
  });

  it("✅ should return `0` when id cannot be parsed", () => {
    expect(parseGameIdString("Game Foo")).toEqual(0);
  });
});

describe("parseRawhands", () => {
  it("✅ should be defined", () => {
    expect(parseRawHands).toBeDefined();
  });

  it("✅ should return the correct Roll array", () => {
    expect(parseRawHands(defaultRawHands)).toEqual(defaultRolls);
  });
});

describe("MatchParser", () => {
  let sut: IMatchParser;

  const getSut = (rawGameString: string = defaultRawGameString) => {
    return new MatchParser(rawGameString);
  };

  it("✅ should be defined", () => {
    sut = getSut();

    expect(sut).toBeDefined();
  });

  it("✅ should return the correctly parsed game", () => {
    sut = getSut(`${defaultRawGameString}\n${otherRawGameString}`);

    expect(sut.getParsedGames()).toEqual([
      { id: 1, rolls: defaultRolls },
      { id: 2, rolls: otherRolls },
    ]);
  });
});

describe("Solution", () => {
  it("should be defined", () => {
    expect(getSumOfValidGamesIds).toBeDefined();
  });

  it("should return the the solution", async () => {
    const { data } = await axios.get(
      "https://adventofcode.com/2023/day/2/input",
      {
        headers: {
          Cookie: `session=${process.env.SESSION}`,
        },
      }
    );
    const parsedGames = new MatchParser(data).getParsedGames();

    expect(getSumOfValidGamesIds(parsedGames)).toBe(2265);
  });
});
