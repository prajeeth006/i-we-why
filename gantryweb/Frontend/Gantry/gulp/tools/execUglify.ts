import { execSync } from './execSync';

export function execUglify(input: string, output: string) {
    const uglify = './node_modules/.bin/uglifyjs';

    execSync(`"${uglify}" -c --screw-ie8 --comments -o ${output} ${input}`);
}
