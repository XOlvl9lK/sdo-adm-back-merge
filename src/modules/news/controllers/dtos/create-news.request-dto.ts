export class CreateNewsRequestDto {
  title: string;
  preview: string;
  content: string;
  createdAt: string;
  newsGroupId: string;
  isPublished: boolean;
}
