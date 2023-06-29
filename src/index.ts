#!/usr/bin/env node

import { MainOptions, TransformFilesOptions } from './@types';
import inquirer from 'inquirer';
import { extensionWithDot } from './tools';
import { copyStandardsTemplates } from './controllers/standards';
import { changeExtensions } from "./changeExtensions";

async function extensionsReplace(){
  const {targetExtension, newExtension, folderPath} = await inquirer.prompt<TransformFilesOptions>([
    {
      name: 'folderPath',
      type: 'input',
      message: 'Ruta de la carpeta padre (./src)',
      default: './src',
    },
    {
      name: 'targetExtension',
      type: 'input',
      message: 'Transformar de (.js)',
      default: '.js',
    }, 
    {
      name: 'newExtension',
      type: 'input',
      message: 'hacia (.jsx)',
      default: '.jsx',
    }])

    const parseTargetExtension = extensionWithDot(targetExtension);
    const parseNewExtension = extensionWithDot(newExtension);

    return await changeExtensions(folderPath,parseTargetExtension,parseNewExtension);
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

async function getUserChoice() {
  return await inquirer.prompt<MainOptions>({
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
}

const start = async ()=>{
  const { moduleChoice } = await getUserChoice();
  if (moduleChoice === "extensionsReplace")
    extensionsReplace();
  else if (moduleChoice === "standardsAdd")
    standardsAdd();
  else
    throw new Error('Upps, hubo un error');
}

start();
