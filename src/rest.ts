import dotenv from "dotenv";

dotenv.config();

const host = process.env.COCKPIT_HOST!;
const token = process.env.COCKPIT_TOKEN!;
const headers = {
  "Content-Type": "application/json",
  "Cockpit-Token": token,
};

const fetchJSON = (url: string, options: RequestInit = {}) =>
  fetch(url, options).then((res) => res.json());

// List all collections
export async function listCollections(): Promise<string[]> {
  return fetchJSON(`${host}/api/collections/listCollections`, { method: "GET", headers });
}

// Authenticate a Cockpit user
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
  return fetchJSON(`${host}/api/cockpit/authUser`, {
    method: "POST",
    headers,
    body: JSON.stringify({ user, password }),
  });
}

// Get fields of a specific collection
export async function getCollectionFields(collectionName: string): Promise<any[]> {
  return fetchJSON(`${host}/api/collections/get/${collectionName}`, { method: "GET", headers }).then(
    (res) => res.fields,
  );
}

// Get entries from a collection with optional filters and sorting
export async function getCollection(
  collectionName: string,
  filter: Record<string, any> = {},
  sort: Record<string, any> = {},
): Promise<any[]> {
  const query = new URLSearchParams([
    ...Object.entries(filter).map(([key, value]) => [`filter[${key}]`, value]),
    ...Object.entries(sort).map(([key, value]) => [`sort[${key}]`, value]),
  ] as [string, string][]);
  const url = `${host}/api/collections/get/${collectionName}?${query}`;
  return fetchJSON(url, { method: "GET", headers }).then((res) => res.entries ?? []);
}

// Get a single entry from a collection
export async function getOneCollection(
  collectionName: string,
  filter: Record<string, any> = {},
): Promise<any> {
  return getCollection(collectionName, filter).then((entries) => (entries.length === 1 ? entries[0] : null));
}

// Save data to an internal collection
export async function saveInternalDataCollection(collectionName: string, data: any): Promise<any> {
  const url = `${host}/api/collections/save/${collectionName}`;
  return fetchJSON(url, {
    method: "POST",
    headers,
    body: JSON.stringify({date: new Date().toISOString(), data }),
  });
}

// Save data to a collection
export async function saveCollection(collectionName: string, data: any): Promise<any> {
  const url = `${host}/api/collections/save/${collectionName}`;
  return fetchJSON(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  }).then((res) => ({ ...res, ...data }));
}

// Delete an entry from a collection
export async function deleteCollection(collectionName: string, id: string): Promise<void> {
  const url = `${host}/api/collections/remove/${collectionName}`;
  await fetchJSON(url, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ filter: { _id: id } }),
  });
}

// Get full Cockpit resource URL
export function getCockpitResourceUrl(url: string): string {
  if (url.startsWith("https")) return url;
  return url.startsWith("/storage") || url.startsWith("storage")
    ? `${host}/${url}`
    : `${host}/storage/uploads/${url}`;
}
