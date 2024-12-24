import { getCollection, getCollectionFields, listCollections } from "./rest";
import { titlecase } from "./titlecase";
import { generateDefinitions } from "./generateDefinitions";
import * as fs from "node:fs";

const typePrefix = "Cp";

export async function generate(outputFile: string, singletonCollectionName: string) {
  // Fetch all collections and their fields
  const collectionNames: string[] = await listCollections();
  const collections = await Promise.all(
    collectionNames.map(async (name) => ({
      name,
      fields: await getCollectionFields(name),
    })),
  );

  let functionDeclaration = "";
  let typeDefinition = "";

  // Generate definitions for each collection
  for (const { name, fields } of collections) {
    const { functionDeclaration: funcDecl, typeDefinition: typeDef } = generateDefinitions(
      name,
      `${typePrefix}${titlecase(name)}`,
      fields,
      functionDeclaration,
      typeDefinition,
    );
    functionDeclaration = funcDecl;
    typeDefinition = typeDef;
  }

  // Handle singleton collections
  const singleton = collections.find((x) => x.name === singletonCollectionName);
  if (singleton) {
    const singletons = await getCollection(singletonCollectionName);
    for (const { _id, id, typeDefinition: singletonTypeDef } of singletons) {
      const typename = `${typePrefix}${titlecase(id).replace(/!/g, "_")}`;
      typeDefinition += `export type ${typename} = CpSingleton<${singletonTypeDef ?? "{}"}>;\n`;
      functionDeclaration += `
export function fetch${typename}(): Promise<${typename}> {
  return _fetchOneCollection("${singletonCollectionName}", { _id: "${_id}" }).then(x => x.data);
}

export function save${typename}(data: CpSaveData<${typename}>): Promise<${typename}> {
  return saveInternalDataCollection("${singletonCollectionName}", { _id: "${_id}", data });
}
`;
    }
  }

  // Write the output to the specified file
  const fileContent = `
import { CpCollection, CpLayout, CpCollectionLink, CpAsset, CpFile, CpImage, CpFilter, CpSort, CpEntries, CpOneEntry, CpSaveData, CpSingleton } from "cockpit-client/dist/standard";
import { getCollection as _fetchCollection, getOneCollection as _fetchOneCollection, saveCollection, saveInternalDataCollection, deleteCollection } from "cockpit-client/dist/rest";

${typeDefinition}

${functionDeclaration}
`;

  console.log(`Generating ${typeDefinition.split("\n").length}, ${functionDeclaration.split("\n").length} lints`);

  fs.writeFileSync(outputFile, fileContent.trim(), "utf8");
}
