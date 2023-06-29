import { readdir, stat, rename } from 'node:fs/promises';
import { join, parse } from 'node:path';

export async function changeExtensions(
    folderPath:string, 
    currentExtension:string, 
    newExtension:string
    ) {

  const files = await readdir(folderPath)

  for(const file of files){
    const filePath = join(folderPath, file);

    const stats = await stat(filePath)

    if(stats.isDirectory())
      await changeExtensions(filePath, currentExtension, newExtension)
    else if(file.endsWith(currentExtension)){
      const newFileName = parse(file).name + newExtension;
      const newFilePath = join(folderPath, newFileName);

      await rename(filePath, newFilePath)
    }
  }
}
