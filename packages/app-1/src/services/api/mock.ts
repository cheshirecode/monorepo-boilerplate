import { faker } from '@faker-js/faker';

export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: Date;
};
let i = 0;
const newPerson = (): Person => {
  return {
    id: ++i,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number(60),
    createdAt: faker.datatype.datetime({ max: new Date().getTime() })
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const len = lens[depth]!;
    return Array(len)
      .fill(0)
      .map(() => ({
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
      }));
  };

  return makeDataLevel();
}
