import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {fileURLToPath} from "url";
import path ,{dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env")});


const JWT_SECRET = process.env.JWT_SECRET_KEY

export async function companyTokenGenerate(req, res, next) {
        const token = req.headers.token;
        const decoded = jwt.verify(token,JWT_SECRET)
        if(decoded){
            req.userId = decoded.id;
            next()
        }
        else{
            res.status(403).json({
                message:"You are not signed in"
            })
        }
    
}
