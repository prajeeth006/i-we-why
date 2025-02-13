// import { ProductMetadata, ProductService } from '@frontend/vanilla/core';
// import { MockService } from 'ng-mocks';
// import { Subject } from 'rxjs';
//
//
// // // this is copy-pasted from packages/vanilla/lib/core/test/products
// // export interface ProductMetadataMock {
// //     name?: string;
// //     apiBaseUrl?: string;
// //     isEnabled?: boolean;
// //     isRegistered?: boolean;
// //     componentFactoryResolver?: ComponentFactoryResolver;
// //     injector?: Injector;
// //     isHost?: boolean;
// // }
//
// export const ProductServiceMock = MockService(ProductService, {
//     productChanged: new Subject<ProductMetadata>(),
//     get current(): ProductMetadata {
//         return {
//             name: 'host',
//             apiBaseUrl: '',
//             isEnabled: true,
//             isRegistered: false,
//             isHost: true,
//         } as ProductMetadata;
//     },
//     setActive: jest.fn(),
//     getMetadata: jest.fn(),
//     register: jest.fn(),
// });
