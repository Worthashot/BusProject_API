import { AuthService } from './auth.service';
import { ApiKeyCacheResponseDto } from './dto/apikey.cahe.response.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    get_all_api_keys(): Promise<ApiKeyCacheResponseDto>;
}
