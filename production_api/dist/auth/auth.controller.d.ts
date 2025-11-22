import { AuthService } from './auth.service';
import { ApiKeyCacheResponseDto } from './dto/apikey.cahe.response.dto';
import { ApiKeyNewDto } from './dto/apikey.new.dto';
import { ApiKeyDeleteDto } from './dto/apikey.delete.dto';
import { ApiKeyChangeStatusDto } from './dto/apikey.change.status.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    private readonly logger;
    get_all_api_keys(): Promise<ApiKeyCacheResponseDto>;
    add_key(apiKeyNewDto: ApiKeyNewDto): Promise<void>;
    remove_key(apiKeyDeleteDto: ApiKeyDeleteDto): Promise<void>;
    change_status(apiChangeStatusDto: ApiKeyChangeStatusDto): Promise<void>;
    set_live(): Promise<void>;
}
