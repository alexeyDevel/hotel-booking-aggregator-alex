import * as bcrypt from 'bcryptjs';
import * as process from "process";

export function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);
    return passwordHash;
}
