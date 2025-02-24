import { Request, Response } from 'express';
import { Connection } from 'jsforce';
const crypto = require('crypto');

class SalesforceController {
    private clientId: string;
    private clientSecret: string;
    private redirectUrl: string;
    private loginUrl: string = 'https://login.salesforce.com';

    constructor() {
        this.clientId = process.env.SFROCE_CLIENT_ID!;
        this.clientSecret = process.env.SFROCE_CLIENT_SECRET!;
        this.redirectUrl = process.env.SFROCE_REDIRECT_URI!;
    }

    private generateCodeVerifier(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private generateCodeChallenge(codeVerifier: string): string {
        return crypto.createHash('sha256').update(codeVerifier)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    public install = async (req: any, res: any) => {
        const conn = new Connection({
            oauth2: {
                loginUrl: this.loginUrl,
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                redirectUri: this.redirectUrl
            }
        });

        const codeVerifier = this.generateCodeVerifier();
        // Store codeVerifier in session for later use
        req.session.codeVerifier = codeVerifier;
        const codeChallenge = this.generateCodeChallenge(codeVerifier);

        const authUrl = conn.oauth2.getAuthorizationUrl({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUrl,
            scope: 'api',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        res.redirect(authUrl);
    }

    public callback = async (req: Request, res: Response) => {
        if (!req.query.code) {
            res.status(500).send('Failed to get authorization code from server callback.');
            return;
        }

        const authcode = req.query.code;
        res.redirect(`http://localhost:3000?salesforce=${encodeURIComponent(JSON.stringify(authcode))}`);

    }
}

export default new SalesforceController();