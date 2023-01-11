export interface SpvSmevFilter {
  unloadDpuAndKuspArrays: boolean;
  onlyDepartments: number[];
  onlyArraysOfDpuAndKusp: string[];
  unloadStatisticalReports: boolean;
  onlyStatisticalReports: string[];
  loadKuspPackages: boolean;
  loadStatisticalCards: boolean;
}

export const initialSpvSmevFilter: SpvSmevFilter = {
  unloadDpuAndKuspArrays: true,
  onlyDepartments: [],
  onlyArraysOfDpuAndKusp: [],
  unloadStatisticalReports: true,
  onlyStatisticalReports: [],
  loadKuspPackages: true,
  loadStatisticalCards: true,
};
