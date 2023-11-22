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
