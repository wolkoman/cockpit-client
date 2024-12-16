export interface CpCollection {
  __collectionName: string;
  _id: string;
  _created: number;
  _modified: number;
}
export type CpSingleton<T> = T;

export interface CpFile {}

export interface CpAsset {}

export interface CpImage {
  path: string;
}

export interface CpCollectionLink {
  _id: string;
  display?: string;
}

export type CpLayout = {
  component: "text";
  settings: { text: string };
}[];

export type CpFilter<T> =
  | Partial<Record<keyof T, string | number | boolean>>
  | undefined;
export type CpSort<T> = Partial<Record<keyof T, number>> | undefined;
export type CpEntries<T> = Promise<T[]>;
export type CpOneEntry<T> = Promise<T>;
export type CpSaveData<T> = DeepPartial<T>;

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
