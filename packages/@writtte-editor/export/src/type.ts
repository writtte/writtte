const ExportType = {
  MD: 1,
};

type TExportType = (typeof ExportType)[keyof typeof ExportType];

export type { TExportType };

export { ExportType };
