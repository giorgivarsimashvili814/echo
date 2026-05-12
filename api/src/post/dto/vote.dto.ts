import { IsEnum } from 'class-validator';
import { VoteType } from 'generated/prisma/enums';

export class VoteDto {
  @IsEnum(VoteType)
  type: VoteType;
}
