const ExportType = {
  MD: 1,
  XML: 2,
};

type TExportType = (typeof ExportType)[keyof typeof ExportType];

export type { TExportType };

export { ExportType };
