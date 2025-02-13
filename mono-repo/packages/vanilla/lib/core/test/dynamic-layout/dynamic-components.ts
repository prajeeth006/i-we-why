import { Component, Input, ModuleWithProviders, NgModule } from '@angular/core';

@Component({
    selector: 'vn-test-cmp',
    template: '<span>hello {{name}}</span>',
})
export class TestComponent {
    @Input() name: string;
}

@Component({
    selector: 'vn-test-cmp2',
    template: '<span>hi</span>',
})
export class Test2Component {}

@NgModule({
    declarations: [TestComponent, Test2Component],
    exports: [TestComponent, Test2Component],
})
export class TestDynamicModule {
    static forRoot(): ModuleWithProviders<TestDynamicModule> {
        return {
            ngModule: TestDynamicModule,
        };
    }
}
