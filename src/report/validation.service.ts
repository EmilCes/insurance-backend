import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ImplicatePartyDto } from './dto/implicate-party.dto';

@Injectable()
export class ValidationService {
    /*validateReportData(createReportDto: CreateReportDto): void {
        const { latitude, longitude } = createReportDto;
        if (!this.isValidDecimal(latitude, 9, 6)) {
            throw new UnprocessableEntityException('The latitude field must be a Decimal(9,6).');
        }

        if (!this.isValidDecimal(longitude, 10, 6)) {
            throw new UnprocessableEntityException('The longitude field must be a Decimal(10,6).');
        }
    };*/

    private isValidDecimal(value: number, precision: number, scale: number): boolean {
        const regex = new RegExp(`^-?\\d{1,${precision - scale}}(\\.\\d{1,${scale}})?$`);
        return regex.test(value.toString());
    }

    
    parseImplicatePartyDto(body: any): ImplicatePartyDto[] {
        const implicatePartyList: ImplicatePartyDto[] = [];
        const validProperties = ['name', 'idModel', 'idReport', 'idColor'];
      
        Object.keys(body).forEach((key) => {
          const match = key.match(/implicatePartyDto\[(\d+)\]\.(\w+)/);
          if (match) {
            const index = parseInt(match[1], 10);
            const property = match[2];
      
            if (!validProperties.includes(property)) {
              throw new Error(`Propiedad no válida: ${property}`);
            }
      
            if (!implicatePartyList[index]) {
              implicatePartyList[index] = new ImplicatePartyDto();
            }
      
            const value = body[key];
            switch (property) {
              case 'idModel':
              case 'idReport':
              case 'idColor':
                implicatePartyList[index][property] = value ? parseInt(value, 10) : null;
                break;
              default:
                implicatePartyList[index][property] = value;
            }
          }
        });
      
        return implicatePartyList;
      }
      
}

