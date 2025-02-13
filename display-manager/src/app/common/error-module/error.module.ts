import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    }
  ],
})
export class ErrorModule {}
