import { Injectable } from '@nestjs/common';

import { commonRepository } from 'src/common/domain/repository/common.repository';

@Injectable()
export class CommonService implements commonRepository {}
