const { exec } = require('child_process');

exec(`git diff-tree -r --name-only --no-commit-id ${process.argv[2]} ${process.argv[3]}`, { maxBuffer: 1024 * 1000 }, (err, stdout) => {
    if (err) {
        console.error(err);
        return;
    }

    if (stdout.includes('yarn.lock')) {
        console.warn(
            [
                '⚠️ ----------------------------------------------------------------------------- ⚠️',
                '⚠️ yarn.lock changed, please run `yarn` to ensure your packages are up to date.  ⚠️',
                '⚠️ ----------------------------------------------------------------------------- ⚠️',
            ].join('\n'),
        );
    }
});
