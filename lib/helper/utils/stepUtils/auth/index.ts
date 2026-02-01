import { getConfig } from "../../config";
import LoginPage from "./loginPage";

const config = getConfig();
const loginPage = new LoginPage();

export async function generateAuthCache() {
    const { users } = config
    const uids = Object.keys(users).filter(uid => uid !== 'default').map(uid => uid)
    // eslint-disable-next-line no-restricted-syntax
    for (const uid of uids) {
        // eslint-disable-next-line no-await-in-loop
        await loginPage.clearLoginStorage()
        // eslint-disable-next-line no-await-in-loop
        await loginPage.login(uid)
        // eslint-disable-next-line no-await-in-loop
        await loginPage.saveLoginStorage(uid)
    }
}

export async function login(uid: string, saveStorage?: boolean) {
    await loginPage.login(uid)
    if (saveStorage) {
        await loginPage.saveLoginStorage(uid);
    }
}

export async function switchUser(uid: string) {
    await loginPage.switchUser(uid)
}

export async function clearLoginStorage() {
    await loginPage.clearLoginStorage()
}