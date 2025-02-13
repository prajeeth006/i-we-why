const ts = require('typescript');
const fs = require('fs');
const path = require('path');

function extractStories(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, fileContents, ts.ScriptTarget.Latest);

    const stories = [];

    function extractStoryName(node) {
        if (ts.isExportAssignment(node) || ts.isExportDeclaration(node) || ts.isVariableDeclaration(node)) {
            let storyName = node.name?.escapedText;
            if (storyName && storyName !== 'meta') {
                stories.push(node.name?.escapedText);
            }
        }

        ts.forEachChild(node, extractStoryName);
    }

    ts.forEachChild(sourceFile, extractStoryName);
    return stories;
}

function generateMDX(filePath, stories) {
    const baseName = path.basename(filePath, '.ts');
    const mdxContent = [
        `import {Story, ArgTypes, Meta} from "@storybook/blocks";\n`,
        `import * as Stories from './${baseName}';\n`,
        `<Meta of={Stories} /> \n`,
        `<ArgTypes of={Stories} /> \n`,
        ...stories.map((story) => `## ${story}\n<Story name="${story}" />\n`),
    ].join('\n');

    const mdxFilePath = path.join(path.dirname(filePath), baseName.replace('.stories', '') + '.mdx');
    fs.writeFileSync(mdxFilePath, mdxContent);
}

const searchDirectory = (dir, collection) => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            searchDirectory(filePath, collection);
        } else {
            if (file.endsWith('.stories.ts')) {
                const mdxFile = file.replace('.stories.ts', '.mdx');
                const mdxFilePath = path.join(dir, mdxFile);

                if (!fs.existsSync(mdxFilePath)) {
                    collection.push(filePath);
                }
            }
        }
    });
};

const generateStorybookDocs = () => {
    const args = process.argv.slice(2);
    let directory = '../';
    const collection = [];
    if (args.length > 0) {
        args.forEach((fileName, index) => searchDirectory(directory + args[index], collection));
    } else {
        searchDirectory(directory, collection);
    }

    for (const filePath of collection) {
        const stories = extractStories(filePath);
        generateMDX(filePath, stories);

        console.log(`MDX documentation generated for ${stories.length} stories.`);
    }
};

generateStorybookDocs();
