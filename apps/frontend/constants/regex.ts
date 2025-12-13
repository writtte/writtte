// biome-ignore format: REGEX array should not be formatted

const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_.,;:()[\]{}<>+=])[A-Za-z\d@$!%*?&\-_.,;:()[\]{}<>+=]{8,}$/,
};

export { REGEX };
