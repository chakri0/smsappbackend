export interface AddBranchReq {
	storeName: string;
	storeAddress: string;
	phoneNumber?: number;
	image?: string;
}

export interface EditBranchReq {
	storeName?: string;
	storeAddress?: string;
	phoneNumber?: number;
	image?: string;
}
