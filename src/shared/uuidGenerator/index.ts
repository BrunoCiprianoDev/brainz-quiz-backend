import { v4 as uuidv4 } from 'uuid';
import { IuuidGenerator } from '../../domain/util/adapters/uuidGenerator';

export class UuidGenerator implements IuuidGenerator {
  public async generate(): Promise<string> {
    return uuidv4();
  }
}
