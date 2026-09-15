export const FRUITS = [
  "apple",
  "orange",
  "banana",
  "grape",
  "strawberry",
  "watermelon",
  "honeydew",
  "dragonfruit",
  "pineapple",
  "lemon",
  "lime",
  "peach",
  "pear",
  "cherry",
  "blueberry",
  "plum",
  "starfruit",
  "coconut",
  "mango",
  "pomegranate",
  "fig",
  "kiwi",
  "raspberry",
  "blackberry",
  "cantaloupe",
  "papaya",
  "apricot",
  "passionfruit",
  "guava",
  "tangerine",
  "avocado",
  "lychee",
  "persimmon",
] as const;

export type Fruit = (typeof FRUITS)[number];

/**
 * Each party gets a stable fruit derived from their phone number, so the
 * same customer always shows up as the same fruit across the kiosk
 * confirmation and the dashboard. Deterministic and collision-tolerant
 * (two parties can share a fruit).
 */
export function fruitForPhone(phone: string): Fruit {
  let hash = 0;
  for (let i = 0; i < phone.length; i++) {
    hash = (hash * 31 + phone.charCodeAt(i)) >>> 0;
  }
  return FRUITS[hash % FRUITS.length];
}
