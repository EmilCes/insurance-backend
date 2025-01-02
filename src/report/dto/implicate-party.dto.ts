import { IsInt, IsString, Length } from 'class-validator';

export class ImplicatePartyDto {
  @IsInt()
  idImplicateParty: number;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsInt()
  idModel: number;
}
