export interface CreateCookieRequest {
    provider: string;
    cookies: any[];
}

export interface GetCookieRequest {
    provider: string;
}

export interface UpdateCookieRequest {
    provider: string;
    cookies: any[];
}

export interface DeleteCookieRequest {
    provider: string;
}
