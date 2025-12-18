// biome-ignore-all lint/suspicious/noConsole: Console logs are required

let hasLoggedOnce = false;

const dumpWrittteLog = (): void => {
  if (hasLoggedOnce === true) {
    return;
  }

  const line1 = '██╗    ██╗██████╗ ██╗████████╗████████╗████████╗███████╗';
  const line2 = '██║    ██║██╔══██╗██║╚══██╔══╝╚══██╔══╝╚══██╔══╝██╔════╝';
  const line3 = '██║ █╗ ██║██████╔╝██║   ██║      ██║      ██║   █████╗';
  const line4 = '██║███╗██║██╔══██╗██║   ██║      ██║      ██║   ██╔══╝';
  const line5 = '╚███╔███╔╝██║  ██║██║   ██║      ██║      ██║   ███████╗';
  const line6 = ' ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝      ╚═╝   ╚══════╝';
  const line7 = 'Welcome to Writtte Platform! Enjoy your stay!';
  const line8 =
    "Interested in joining us? Check our careers page to see if there's a role for you: https://writtte.com/careers/";

  console.log(
    `\n${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n\n${line7}\n\n${line8}`,
  );

  console.log(
    "%cThis browser console is intended for developers. The source code of Writtte is proprietary and protected by copyright law. Unauthorized copying, modification, reverse engineering, or redistribution is strictly prohibited and may violate applicable laws and terms of service. If you're a developer interested in learning more or collaborating, please contact us at hi@writtte.com",
    'font-size: 1em; line-height: normal; border: 1px solid #FE3B3E; border-radius: 4px; padding: 8px; background-color: #FFE2E2; color: #FE3B3E; font-weight: bold;',
  );

  hasLoggedOnce = true;
};

export { dumpWrittteLog };
