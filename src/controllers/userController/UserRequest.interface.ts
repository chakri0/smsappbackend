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

export interface UpdateUserReq {
	firstName: string;
	lastName?: string;
	oldPassword?: string;
	newPassword?: string;
	phoneNumber?: number;
	avatar?: string;
}
