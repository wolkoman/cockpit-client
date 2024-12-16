import {getCollection, getCollectionFields, listCollections} from "./rest";
import {titlecase} from "./titlecase";

import {generateDefinitions} from "./generateDefinitions";
import * as fs from "node:fs";

const typePrefix = "Cp";
const singletonCollectionName = "internal-data";

export function generate(outputFile: string) {
  (async () => {
    const collectionNames: string[] = await listCollections();

    const collections = await Promise.all(
      collectionNames.map(async (name) => ({
        name,
        fields: await getCollectionFields(name),
      })),
    );

    let functionDeclaration = "";
    let typeDefinition = "";
    collections.forEach(({name, fields}) => {
      const result = generateDefinitions(
        name,
        `${typePrefix}${titlecase(name)}`,
        fields,
        functionDeclaration,
        typeDefinition,
      );
      functionDeclaration = result.functionDeclaration;
      typeDefinition = result.typeDefinition;
    });

    if (collections.find((x) => x.name === singletonCollectionName)) {
      const singeltons: { _id: string; id: string; typeDefinition: string }[] =
        await getCollection(singletonCollectionName);

      singeltons.forEach((singleton) => {
        const typename = `${typePrefix}${titlecase(singleton.id).replace(/!/g, "_")}`;
        typeDefinition += `export type ${typename} = CpSingleton<${singleton.typeDefinition ?? "{}"}>;\n`;
        functionDeclaration += `export function fetch${typename}(): Promise<${typename}> {\n\treturn _fetchOneCollection("${singletonCollectionName}", { _id: "${singleton._id}"}).then(x => x.data);\n}\n\n`;
        functionDeclaration += `export function save${typename}(data: CpSaveData<${typename}>): Promise<${typename}> {\n\treturn saveInternalDataCollection("${singletonCollectionName}", {_id: "${singleton._id}", ...data});\n}\n\n`;
      });
    }

    fs.writeFileSync(
      outputFile,
      `import { CpCollection, CpLayout, CpCollectionLink, CpAsset, CpFile, CpImage, CpFilter, CpSort, CpEntries, CpOneEntry, CpSaveData, CpSingleton } from "cockpit-client/dist/standard";\n` +
      `import { getCollection as _fetchCollection, getOneCollection as _fetchOneCollection, saveCollection, saveInternalDataCollection, deleteCollection } from "cockpit-client/dist/rest";\n` +
      `\n${typeDefinition}` +
      `\n\n${functionDeclaration}`,
      "utf8",
    );
  })()
}
