/**
 * Generates a personalized welcome title based on the user's local time and account data.
 *
 * Purpose:
 *  - Creates a friendly greeting for the user using their account name.
 *  - Selects a greeting randomly from either a general or time-specific group.
 *
 * Flow:
 *  1. Retrieves account data using `getAccountOverview()`.
 *  2. Defines greeting groups:
 *      - General greetings (used anytime),
 *      - Morning, afternoon, evening, and night greetings.
 *  3. Detects the current hour from the user's local system time.
 *  4. Chooses the appropriate greeting group based on the time range:
 *      - Morning:    05 AM -> 11:59 AM
 *      - Afternoon:  12 PM -> 4:59 PM
 *      - Evening:    05 PM -> 9:59 PM
 *      - Night:      10 PM -> 4:59 AM
 *  5. Randomly selects either a time-specific greeting or a general greeting.
 *  6. Chooses a random greeting from the selected group.
 *  7. Appends the user's account name to the greeting and returns the final title.
 *
 * Example Output:
 *  - "Good morning, Alex"
 *  - "Welcome back, Jamie"
 */

import { langKeys } from '../../translations/keys';

const getGreetings = (): {
  general: string[];
  morning: string[];
  afternoon: string[];
  evening: string[];
  night: string[];
} => {
  const general: string[] = [
    langKeys().PageOverviewGreetingsHello01,
    langKeys().PageOverviewGreetingsHello02,
    langKeys().PageOverviewGreetingsHello03,
    langKeys().PageOverviewGreetingsHello04,
    langKeys().PageOverviewGreetingsHello05,
    langKeys().PageOverviewGreetingsHello06,
    langKeys().PageOverviewGreetingsHello07,
  ];

  const morning: string[] = [
    langKeys().PageOverviewGreetingsMorning01,
    langKeys().PageOverviewGreetingsMorning02,
    langKeys().PageOverviewGreetingsMorning03,
    langKeys().PageOverviewGreetingsMorning04,
    langKeys().PageOverviewGreetingsMorning05,
    langKeys().PageOverviewGreetingsMorning06,
    langKeys().PageOverviewGreetingsMorning07,
  ];

  const afternoon: string[] = [
    langKeys().PageOverviewGreetingsAfternoon01,
    langKeys().PageOverviewGreetingsAfternoon02,
    langKeys().PageOverviewGreetingsAfternoon03,
    langKeys().PageOverviewGreetingsAfternoon04,
    langKeys().PageOverviewGreetingsAfternoon05,
    langKeys().PageOverviewGreetingsAfternoon06,
    langKeys().PageOverviewGreetingsAfternoon07,
  ];

  const evening: string[] = [
    langKeys().PageOverviewGreetingsEvening01,
    langKeys().PageOverviewGreetingsEvening02,
    langKeys().PageOverviewGreetingsEvening03,
    langKeys().PageOverviewGreetingsEvening04,
    langKeys().PageOverviewGreetingsEvening05,
    langKeys().PageOverviewGreetingsEvening06,
    langKeys().PageOverviewGreetingsEvening07,
  ];

  const night: string[] = [
    langKeys().PageOverviewGreetingsNight01,
    langKeys().PageOverviewGreetingsNight02,
    langKeys().PageOverviewGreetingsNight03,
    langKeys().PageOverviewGreetingsNight04,
    langKeys().PageOverviewGreetingsNight05,
    langKeys().PageOverviewGreetingsNight06,
    langKeys().PageOverviewGreetingsNight07,
  ];

  return {
    general,
    morning,
    afternoon,
    evening,
    night,
  };
};

const generateOverviewTitleDynamically = (name: string): string => {
  const greetings = getGreetings();
  const currentHour = new Date().getHours();

  let greetingsToUse = greetings.general;
  if (currentHour >= 5 && currentHour < 12) {
    greetingsToUse =
      Math.random() > 0.5 ? greetings.morning : greetings.general;
  } else if (currentHour >= 12 && currentHour < 17) {
    greetingsToUse =
      Math.random() > 0.5 ? greetings.afternoon : greetings.general;
  } else if (currentHour >= 17 && currentHour < 22) {
    greetingsToUse =
      Math.random() > 0.5 ? greetings.evening : greetings.general;
  } else {
    greetingsToUse = Math.random() > 0.5 ? greetings.night : greetings.general;
  }

  const randomIndex = Math.floor(Math.random() * greetingsToUse.length);
  const base = greetingsToUse[randomIndex];

  return `${base} ${name}`;
};

export { generateOverviewTitleDynamically };
