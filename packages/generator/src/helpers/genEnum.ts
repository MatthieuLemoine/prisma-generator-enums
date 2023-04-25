import { DMMF } from '@prisma/generator-helper'

export const genEnum = ({ name, values }: DMMF.DatamodelEnum) => {
  const enumValues = values.map(({ name }) => `${name}: "${name}"`).join(',\n')
  return `import type { ${name} as ${name}Type } from '@prisma/client';\n\nexport const ${name}: { [K in ${name}Type]: K } = { \n${enumValues}\n };\n\nexport type ${name} = ${name}Type;`
}
