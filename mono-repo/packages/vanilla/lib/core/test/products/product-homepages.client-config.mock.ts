import { Mock } from 'moxxi';

import { ProductHomepagesConfig } from '../../src/products/product-homepages.client-config';

@Mock({ of: ProductHomepagesConfig })
export class ProductHomepagesConfigMock {
    sports: string;
    casino: string;
    portal: string;
}
