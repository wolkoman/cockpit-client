import { resolveTypes } from "./resolveTypes";

export function generateDefinitions(
  name: string,
  typename: string,
  fields: Record<string, any>,
  functionDeclaration = "",
  typeDefinition = "",
) {
  // Generate type definition
  typeDefinition += `export interface ${typename} extends CpCollection {\n`;
  typeDefinition += `  __collectionName: '${name}';\n`;

  // Generate function declarations
  const functions = [
    `fetch${typename}(filter?: CpFilter<${typename}>, sort?: CpSort<${typename}>): CpEntries<${typename}> {
      return _fetchCollection("${name}", filter, sort);
    }`,
    `fetchOne${typename}(filter?: CpFilter<${typename}>, sort?: CpSort<${typename}>): CpOneEntry<${typename}> {
      return _fetchOneCollection("${name}", filter, sort);
    }`,
    `save${typename}(data: CpSaveData<${typename}>): CpOneEntry<${typename}> {
      return saveCollection("${name}", data);
    }`,
    `delete${typename}(id: string): Promise<void> {
      return deleteCollection("${name}", id);
    }`
  ];
  functionDeclaration += functions.map(fn => `export function ${fn}\n`).join("\n");

  // Process fields
  const additionalDefinitions = Object.entries(fields).reduce((acc, [fieldName, options]) => {
    const { typeDefinition: fieldDef, additionalDefinitions: fieldAdditional } =
      resolveTypes(options, fieldName, typename, name);
    typeDefinition += fieldDef;
    return acc + fieldAdditional;
  }, "");

  typeDefinition += `}\n${additionalDefinitions}`;
  console.log(`Generating definition for '${name}'`);
  return { functionDeclaration, typeDefinition };
}
