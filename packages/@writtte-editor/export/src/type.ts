const ExportType = {
  MD: 1,
  XML: 2,
  WORDPRESS: 3,
  MEDIUM: 4,
  SUBSTACK: 5,
};

type TExportType = (typeof ExportType)[keyof typeof ExportType];

export type { TExportType };

export { ExportType };
