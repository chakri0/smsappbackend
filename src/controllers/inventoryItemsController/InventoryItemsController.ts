import express from 'express';
import { UserContext } from '../../database/instanses/authentication/UserContext';
import { NotFoundException } from '../../common/exception/NotFoundException';
import { InventoryItemsRepository } from '../../repositories/InventoryItemsRepository';

export interface InventroyItemsReq {
	itemId: string;
	quantity: number;
	availableQuantity: number;
	expireDate: Date;
}

class InventoryItemsController {
	private inventoryItemsRepository: InventoryItemsRepository;
	constructor() {
		this.inventoryItemsRepository = new InventoryItemsRepository();
	}

	public addInventoryItems: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const data = req.body as InventroyItemsReq;
			await this.inventoryItemsRepository.addInventoryItems(
				data,
				activeUser.id,
			);
			res.status(201).json({
				message: 'InventroyItem added successfully',
			});
		} catch (error) {
			next(error);
		}
	};

	public inventoryItemsList: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const inventoryItemList =
				await this.inventoryItemsRepository.inventoryItemsList(
					activeUser.id,
				);
			res.status(200).json({ inventoryItemList });
		} catch (error) {
			next(error);
		}
	};

	public updateInventoryItems: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const { inventoryItemId } = req.params;
			const data = req.body as InventroyItemsReq;
			await this.inventoryItemsRepository.updateInventoryItems(
				data,
				inventoryItemId,
				activeUser.id,
			);

			res.status(200).json({
				message: 'InventroyItem updated successfully',
			});
		} catch (error) {
			next(error);
		}
	};

	public deleteInventoryItem: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const { inventoryItemId } = req.params;
			await this.inventoryItemsRepository.deleteInventoryItem(
				inventoryItemId,
				activeUser.id,
			);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};
}
export default InventoryItemsController;
