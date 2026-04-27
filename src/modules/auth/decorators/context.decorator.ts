import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetContext = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest() as Request;

  if (!request || !request['flo-context']) {
    throw new BadRequestException('Context not found in the request');
  }

  return request['flo-context'];
});
