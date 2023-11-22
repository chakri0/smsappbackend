import { FormattedUserResponse } from '../../common/helpers/ResponseHandle';
export interface ILogin {
	user: FormattedUserResponse;
	accessToken: string;
	refreshToken: string;
}
