import bcrypt from 'bcrypt';
import {fileURLToPath} from 'url';
import { dirname, resolve } from 'path';

export const createHash = async (password) => {
    try {
        if (!password) throw new Error("Password no válido");

        const saltRounds = 10;
        const salts = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salts);
    } catch (error) {
        console.error("Error en createHash:", error);
        throw error;
    }
};

export const passwordValidation = async(user,password) => bcrypt.compare(password,user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const baseDir = resolve(__dirname, '../..');

export default __dirname;