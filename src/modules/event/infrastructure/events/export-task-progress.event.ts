export class ExportTaskProgressEvent {
  constructor(
    public exportTaskId: string,
    public progress: number,
    public fileName?: string,
    public href?: string
  ) {}
}