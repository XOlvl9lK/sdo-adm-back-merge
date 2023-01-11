export class CreatePerformanceDto {
  userId: string;
  attemptsLeft: number;
  educationElementId: string;
  courseId: string;
  testId: string;
  educationProgramId: string;
  assignmentId?: string;
}
