import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { genEnum } from './helpers/genEnum'
import { writeFileSafely } from './utils/writeFileSafely'

const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    const enums = await Promise.all(
      options.dmmf.datamodel.enums.map(async (enumInfo) => {
        const constEnum = genEnum(enumInfo)
        const writeLocation = path.join(
          options.generator.output?.value!,
          `${enumInfo.name}.ts`,
        )
        await writeFileSafely(writeLocation, constEnum)
        return enumInfo.name
      }),
    )
    await writeFileSafely(
      path.join(options.generator.output?.value!, `index.ts`),
      enums.map((enumName) => `export * from './${enumName}';`).join('\n'),
    )
  },
})
