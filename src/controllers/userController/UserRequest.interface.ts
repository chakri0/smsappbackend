export interface LoginReq {
	email: string;
	password: string;
}

export interface InviteUserReq {
	firstName: string;
	email: string;
	role: string;
	branchId: string;
}

export interface UpdateUserProfileRequest {
	firstName: string;
	lastName?: string;
	oldPassword?: string;
	newPassword?: string;
	phoneNumber?: number;
	avatar?: string;
}

export interface UpdateUserRequest {
	userId: string;
	firstName: string;
	role: 'superAdmin' | 'admin' | 'manager';
	branch: string;
}
