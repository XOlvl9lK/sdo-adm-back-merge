import { SetMetadata } from '@nestjs/common';

export const Page = (page: string) => SetMetadata('page', page);
