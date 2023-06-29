#!/usr/bin/env node

import { stat } from 'node:fs/promises'
import { MainOptions, TransformFilesOptions } from './@types';
import inquirer from 'inquirer';
import { extensionWithDot } from './tools';
import { copyStandardsTemplates } from './controllers/standards';


async function extensionsReplace(){
  const {targetExtension, newExtension, folderPath} = await inquirer.prompt<TransformFilesOptions>([
    {
      name: 'folderPath',
      type: 'input',
      message: 'Ruta de la carpeta padre (./src)',
      default: './src',
      async validate(input) {
        const {isDirectory} = await stat(input)

        return isDirectory
      },
    },
    {
      name: 'targetExtension',
      type: 'input',
      message: 'Transformar de (.js)',
      default: '.js',
      transformer(input) {
          return extensionWithDot(input)
      },
    }, 
    {
      name: 'sourceExtension',
      type: 'input',
      message: 'hacia (.jsx)',
      default: '.jsx',
      transformer(input){
        return extensionWithDot(input)
      }
    }])

  // colocar aca codigo para el replace
  console.log(targetExtension, newExtension, folderPath)
}



// TODO: refactor
async function standardsAdd(){
  const resolutions = await copyStandardsTemplates(__dirname)

  const failed = resolutions
    .filter(({status})=> status === 'rejected') as PromiseRejectedResult[]

  console.log(...failed.map(({ reason })=> reason.message ))

  const successful = resolutions
    .filter(({status})=> status === 'fulfilled') as PromiseFulfilledResult<string>[]

  console.log(successful.reduce((prev, {value})=> prev + ' \n' + value, ''))
}

const process = {
  extensionsReplace,
  standardsAdd
};

(async ()=>{
  const { moduleChoice } = await inquirer.prompt<MainOptions>({
    name: 'moduleChoice',
    type: 'list',
    choices: [
      {
        name: 'Reemplazar extensiones',
        checked: false,
        value: 'extensionsReplace'
      },
      {
        name: 'Agregar standards',
        value: 'standardsAdd'
      }
    ]
  })

  // TODO: refactor
  await (
    process[moduleChoice] ?? 
    (async ()=>{throw new Error('Upss, hubo un error')})
  )()
})()
