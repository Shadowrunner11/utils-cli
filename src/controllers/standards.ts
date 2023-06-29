import { cp } from 'node:fs/promises'
import { join,  } from 'node:path'
import { FilePath } from "../@types"
import { CopyOptions } from 'node:fs'
import { templateArtifactsBaseDir } from '../config'


async function cpWrapper(source: FilePath, dest: FilePath, opts?: CopyOptions){
  await cp(source, dest, opts)

  return `File /folder ${dest} was created`
}

export async function copyStandardsTemplates(root: string){
  return await Promise.allSettled([
    cpWrapper(
      join(root, "templates/PULL_REQUEST_TEMPLATE.md"), 
      join(templateArtifactsBaseDir, '.github/PULL_REQUEST_TEMPLATE.md')
    ),
    cpWrapper(
      join(root, "templates/CONTRIBUTING.md"),
      join(templateArtifactsBaseDir, 'CONTRIBUTING.md')
    ),
    cpWrapper(
      join(root, "templates/ISSUE_TEMPLATE"),
      join(templateArtifactsBaseDir, '.github/ISSUE_TEMPLATE'),
      {recursive: true}
    )
  ])
}
