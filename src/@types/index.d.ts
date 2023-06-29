export interface TransformFilesOptions {
  targetExtension: string;
  newExtension: string;
  folderPath: string;
}

export interface MainOptions {
  moduleChoice: 'extensionsReplace' | 'standardsAdd'
}

type FilePath = string | URL
