import { Client, Account, Databases, Storage, Query, ID, type Models } from 'appwrite';

export const APPWRITE_ENDPOINT = 'https://varios-appwrite-techpadah.fjueze.easypanel.host/v1';
export const APPWRITE_PROJECT_ID = '6ab8ce90001e6bf86e8a';
export const APPWRITE_DATABASE_ID = 'polleras';
export const APPWRITE_BUCKET_ID = 'bycandashan';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { Query, ID };
export type { Models };

export type AppSession = Models.User<Models.Preferences> | null;

export const getSession = async (): Promise<AppSession> => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch {
    // No hay sesión activa: nada que cerrar
  }
};

/** Normaliza un documento de Appwrite al shape que usaba Supabase ({ ...doc, id }) */
export const toItem = <T>(doc: Models.Document): T =>
  ({ ...(doc as unknown as Record<string, unknown>), id: doc.$id }) as T;

/** Upsert genérico (Appwrite no tiene upsert nativo): actualiza, y si no existe crea con ese id */
export const upsertDocument = async (
  collection: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> => {
  try {
    await databases.updateDocument(APPWRITE_DATABASE_ID, collection, id, data);
  } catch {
    await databases.createDocument(APPWRITE_DATABASE_ID, collection, id, data);
  }
};

/** Los valores JSON (ej. app_settings.value) viajan como string en Appwrite */
export const parseSettingValue = <T>(raw: unknown): T | null => {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  return raw as T;
};

export const fileViewUrl = (fileId: string): string =>
  `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
