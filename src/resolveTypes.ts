import {titlecase} from "./titlecase";
import {generateDefinitions} from "./generateDefinitions";

export function resolveTypes(
  options: any,
  fieldName: string,
  typename: string,
  name: string,
) {
  let typeDefinition = "";
  let additionalDefinitions = "";
  if (options.type == "text") {
    typeDefinition += `\t${fieldName}: string\n`;
  } else if (options.type == "date") {
    typeDefinition += `\t${fieldName}: string\n`;
  } else if (options.type == "textarea") {
    typeDefinition += `\t${fieldName}: string\n`;
  } else if (options.type == "number") {
    typeDefinition += `\t${fieldName}: number\n`;
  } else if (options.type == "layout") {
    typeDefinition += `\t${fieldName}: CpLayout\n`;
  } else if (options.type == "object") {
    typeDefinition += `\t${fieldName}: any\n`;
  } else if (options.type == "boolean") {
    typeDefinition += `\t${fieldName}: boolean\n`;
  } else if (options.type == "file") {
    typeDefinition += `\t${fieldName}: CpFile\n`;
  } else if (options.type == "image") {
    typeDefinition += `\t${fieldName}: CpImage\n`;
  } else if (options.type == "asset") {
    typeDefinition += `\t${fieldName}: CpAsset\n`;
  } else if (options.type == "collectionlink") {
    typeDefinition += `\t${fieldName}: CpCollectionLink\n`;
  } else if (options.type == "repeater") {
    const subTypename = typename + titlecase(fieldName);
    const firstField = Object.entries(options.options.options).filter(
      ([_, value]) => value,
    )[0];
    const sub = generateDefinitions(subTypename, subTypename, {value: firstField[1]});
    typeDefinition += `\t${fieldName}: ${subTypename}[]\n`;
    additionalDefinitions += sub.typeDefinition;
  } else if (options.type == "multipleselect") {
    const enumName = `${typename}${titlecase(fieldName)}`;
    typeDefinition += `\t${fieldName}: ${enumName}[]\n`;
    additionalDefinitions += `export enum ${enumName}{\n`;
    additionalDefinitions += options.options.options
      .map(({value}: any) => `\t${titlecase(value)} = "${value}",`)
      .join("\n");
    additionalDefinitions += `\n}\n`;
  } else if (options.type == "select") {
    const enumName = `${typename}${titlecase(fieldName)}`;
    typeDefinition += `\t${fieldName}: ${enumName}\n`;
    additionalDefinitions += `export enum ${enumName}{\n`;
    additionalDefinitions += Object.entries(options.options.options)
      .map(([value]) => `\t${titlecase(value)} = "${value}",`)
      .join("\n");
    additionalDefinitions += `\n}\n`;
  } else {
    console.log(`Unrecognized field: ${options.type} for ${name}.${fieldName}`);
    process.exit(1);
  }
  return {typeDefinition, additionalDefinitions};
}
