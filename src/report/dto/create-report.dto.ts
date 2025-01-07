import { IsString, IsUUID, ValidateNested, IsArray, IsLatitude, IsLongitude, IsInt, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsLatitude()
  @Type(() => Number)
  latitude: number;

  @IsLongitude()
  @Type(() => Number)
  longitude: number;
}

class InvolvedPersonDto {
  @IsString()
  name: string;

  @IsInt()
  @Type(() => Number)
  brandId: number;

  @IsInt()
  @Type(() => Number)
  colorId: number;

  @IsString()
  plates: string;
}

export class CreateReportDto {
  @IsUUID()
  serialNumber: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvolvedPersonDto)
  involvedPeople: InvolvedPersonDto[];
}
