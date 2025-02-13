import { main } from '@design-system/ds-deprecation-feature';
import process from 'node:process';

main()
    .then(() => {
        console.log('Success!');
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
