import * as fs from 'fs-extra';
import * as path from 'path';

export function getAllFileNames(folderPath: string) {
    const files = fs.readdirSync(path.join(process.cwd(), folderPath));
    return files;
}

export function getFilePath(str: string) {
    return path.join(process.cwd(), str)
}