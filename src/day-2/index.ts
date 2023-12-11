export type Colors = "red" | "green" | "blue";
export type Roll = Record<Colors, number>;
export type ParsedGame = { id: number; rolls: Roll[] };
export type Input = ParsedGame[];

export interface IHand {
  ruleSet: Roll;
  roll: Roll;
  isValid: () => boolean;
}

export interface IGame {
  ruleSet: Roll;
  id: number;
  isValid: () => boolean;
  getId: () => number;
}

export class Hand implements IHand {
  ruleSet: Roll;
  roll: Roll;

  constructor(ruleSet: Roll, roll: Roll) {
    this.ruleSet = ruleSet;
    this.roll = roll;
  }

  isValid = () => isRollValid(this.ruleSet, this.roll);
}

export class Game implements IGame {
  ruleSet: Roll;
  id: number;
  hands: IHand[];

  constructor(ruleSet: Roll, id: number, rolls: Roll[]) {
    this.ruleSet = ruleSet;
    this.id = id;
    this.hands = this.generateHands(rolls);
  }

  isValid = () => this.hands.every((hand) => hand.isValid() === true);

  getId = () => this.id;

  private generateHands = (rolls: Roll[]): IHand[] =>
    rolls.map((roll: Roll) => new Hand(this.ruleSet, roll));
}

export const isRollValid = (ruleSet: Roll, roll: Roll) => {
  if (getRollTotal(roll) > getRollTotal(ruleSet)) return false;

  if (!areCubesValid(ruleSet, roll)) return false;

  return true;
};

// Returns the total number of colored cubes in a roll
export const getRollTotal = (roll: Roll): Number =>
  Object.values(roll).reduce((sum, v) => sum + v);

// Returns true of all keys of the roll are less than or equal to the rule set
export const areCubesValid = (ruleSet: Roll, roll: Roll): boolean => {
  const keys = Object.keys(ruleSet) as [keyof Roll];

  return keys.every((key) => ruleSet[key] >= roll[key]);
};

export interface IMatchParser {
  rawInput: string;
  parsedGames: ParsedGame[];
  getParsedGames: () => ParsedGame[];
}

export class MatchParser implements IMatchParser {
  rawInput: string;
  parsedGames: ParsedGame[];

  constructor(rawInput: string) {
    this.rawInput = rawInput;
    this.parsedGames = this.parseGames();
  }

  private parseGames = (): ParsedGame[] =>
    this.rawInput
      .split("\n")
      .map((rawGameString: string) =>
        new GameParser(rawGameString).getParsedGame()
      );

  getParsedGames = () => {
    return this.parsedGames;
  };
}

export interface IGameParser {
  parsedGame: ParsedGame;

  getParsedGame: () => ParsedGame;
}

export class GameParser implements IGameParser {
  parsedGame: ParsedGame;

  constructor(rawGameString: string) {
    this.parsedGame = this.parseGame(rawGameString);
  }

  private parseGame = (rawGameString: string): ParsedGame => {
    const [gameIdString, rawHandStrings] = rawGameString.split(":");
    const id: number = parseGameIdString(gameIdString);
    const rawHands: string[] = rawHandStrings?.split(";") ?? [];

    return {
      id,
      rolls: parseRawHands(rawHands),
    };
  };

  getParsedGame = () => {
    return this.parsedGame;
  };
}

export const parseGameIdString = (gameIdString: string): number => {
  const [_, idString] = gameIdString.split(" ");
  const parsedId = parseInt(idString);

  if (isNaN(parsedId)) {
    return 0;
  }

  return parsedId;
};

const rollKeyValMatcher = new RegExp(/(\d* red)|(\d* green)|(\d* blue)/, "g");

export const parseRawHands = (rawHands: string[]): Roll[] => {
  return rawHands.reduce<Roll[]>((rolls: Roll[], rawHand: string) => {
    const matches = rawHand.match(rollKeyValMatcher) ?? [];

    let newRoll: Roll = {
      red: 0,
      green: 0,
      blue: 0,
    };

    matches.forEach((match: string) => {
      const [value, key] = match.split(" ") as unknown as [string, keyof Roll];

      newRoll[key] = parseInt(value);
    });

    rolls.push(newRoll);
    return rolls;
  }, []);
};

export const getSumOfValidGamesIds = (parsedGames: ParsedGame[]): number => {
  const ruleSet: Roll = {
    red: 12,
    green: 13,
    blue: 14,
  };

  return parsedGames.reduce((sum: number, parsedGame: ParsedGame) => {
    const isValid = new Game(
      ruleSet,
      parsedGame.id,
      parsedGame.rolls
    ).isValid();

    if (isValid) {
      return sum + parsedGame.id;
    }

    return sum;
  }, 0);
};
