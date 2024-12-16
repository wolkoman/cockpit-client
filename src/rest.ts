import dotenv from "dotenv";

dotenv.config();

const host = process.env.COCKPIT_HOST!;
const token = process.env.COCKPIT_TOKEN!;

export async function listCollections(): Promise<string[]> {
  return fetch(`${host}/api/collections/listCollections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cockpit-Token": token,
    },
  }).then((x) => x.json());
}
export async function authenticateCockpitUser(
  user: string,
  password: string,
): Promise<
  | { error: string }
  | {
      user: string;
      email: string;
      group: string;
      name: string;
      _id: string;
      active: boolean;
    }
> {
  return fetch(`${host}/api/cockpit/authUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cockpit-Token": token,
    },
    body: JSON.stringify({ user, password }),
  }).then((x) => x.json());
}

export async function getCollectionFields(
  collectionName: string,
): Promise<any[]> {
  const url = `${host}/api/collections/get/${collectionName}?filter[_id]=unknown}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cockpit-Token": token,
    },
  })
    .then((x) => x.json())
    .then((x) => x.fields);
}

export async function getCollection(
  collectionName: string,
  filterObject: Record<string, string | number | boolean> = {},
  sortObject: Record<string, string | number | boolean> = {},
): Promise<any[]> {
  const query = [
    ...Object.entries(filterObject).map(
      ([key, value]) =>
        `filter[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`,
    ),
    ...Object.entries(sortObject).map(
      ([key, value]) =>
        `sort[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`,
    ),
  ].join("&");
  const url = `${host}/api/collections/get/${collectionName}?${query}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cockpit-Token": token,
    },
  })
    .then((x) => x.json())
    .then((x) => x.entries ?? []);
}

export async function getOneCollection(
  collectionName: string,
  filterObject: Record<string, string | number | boolean> = {},
): Promise<any> {
  const filterString = Object.entries(filterObject)
    .map(
      ([key, value]) =>
        `filter[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`,
    )
    .join("&");
  const url = `${host}/api/collections/get/${collectionName}?${filterString}`;
  return await getCollection(collectionName, filterObject).then((x) =>
    x.length === 1 ? x[0] : null,
  );
}

export async function saveInternalDataCollection(
  collectionName: string,
  data: any,
): Promise<any> {
  const url = `${host}/api/collections/save/${collectionName}`;
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cockpit-Token": token,
    },
    body: JSON.stringify({
      data: {
        date: new Date().toISOString(),
        data: data,
      },
    }),
  }).then((x) => x.json());
}
export async function saveCollection(
  collectionName: string,
  data: any,
): Promise<any> {
  const url = `${host}/api/collections/save/${collectionName}`;
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cockpit-Token": token,
    },
    body: JSON.stringify({ data }),
  })
    .then((x) => x.json())
    .then((x) => ({ ...x, ...data }));
}

export async function deleteCollection(
  collectionName: string,
  id: string,
): Promise<void> {
  const url = `${host}/api/collections/remove/${collectionName}`;
  return await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Cockpit-Token": token,
    },
    body: JSON.stringify({
      filter: { _id: id },
    }),
  }).then((x) => x.json());
}

export function getCockpitResourceUrl(url: string) {
  if (url.startsWith("https")) return url;
  if (url.startsWith("/storage")) return `${host}${url}`;
  if (url.startsWith("storage")) return `${host}/${url}`;
  return `${host}/storage/uploads/${url}`;
}
