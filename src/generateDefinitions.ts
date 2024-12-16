import {resolveTypes} from "./resolveTypes";

export function generateDefinitions(
  name: string,
  typename: string,
  fields: Record<string, any>,
  functionDeclaration: string = "",
  typeDefinition: string = "",
) {
  typeDefinition += `export interface ${typename} extends CpCollection{\n`;
  typeDefinition += `\t__collectionName: '${name}'\n`;
  functionDeclaration += `export function fetch${typename}(filter?: CpFilter<${typename}>, sort?: CpSort<${typename}>): CpEntries<${typename}> {\n\treturn _fetchCollection("${name}", filter);\n}\n\n`;
  functionDeclaration += `export function fetchOne${typename}(filter?: CpFilter<${typename}>): CpOneEntry<${typename}> {\n\treturn _fetchOneCollection("${name}", filter);\n}\n\n`;
  functionDeclaration += `export function save${typename}(data: CpSaveData<${typename}>): CpOneEntry<${typename}> {\n\treturn saveCollection("${name}", data);\n}\n\n`;
  functionDeclaration += `export function delete${typename}(id: string): Promise<void> {\n\treturn deleteCollection("${name}", id);\n}\n\n`;
  let additionalDefinitions = "\n";
  Object.entries(fields).forEach(([fieldName, options]) => {
    const typeInformation = resolveTypes(options, fieldName, typename, name);
    typeDefinition += typeInformation.typeDefinition;
    additionalDefinitions += typeInformation.additionalDefinitions;
  });
  typeDefinition += `}\n${additionalDefinitions}`;
  return {functionDeclaration, typeDefinition};
}
