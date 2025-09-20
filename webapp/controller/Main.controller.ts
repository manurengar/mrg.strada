import Event from "sap/ui/base/Event";
import BaseController from "./BaseController";
import StandardListItem from "sap/m/StandardListItem";
import Context from "sap/ui/model/Context";
import Page from "sap/m/Page";
import List from "sap/m/List";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import UIComponent from "sap/ui/core/UIComponent";
import Router from "sap/m/routing/Router";
import ListItemBase from "sap/m/ListItemBase";

/**
 * @namespace mrg.strada.controller
 */
export default class Main extends BaseController {
	private bFirstSelected = true;
	private sInitialPath = "";

	onInit(): void | undefined {
		const oRouter = (this.getOwnerComponent() as UIComponent).getRouter() as Router;
		const oRoute = oRouter.getRoute("RouteMain");
		oRoute?.attachPatternMatched(this.onPatternMatched, this);
	}
	private onNavToDetail(oEvent: Event): void {
		// Let's retrieve the ID of the employee for use on unique Route navigation
		const oListItem = (oEvent?.getParameters() as any).listItem as StandardListItem;
		const oContext = oListItem.getBindingContext("Northwind") as Context;
		const sPath = oContext?.getPath();
		// Bind on the detail page the context of the selected item
		const oDetailPage = this.getView()?.byId('detailPage') as Page;
		oDetailPage.bindElement(`Northwind>${sPath}`);
		// We used query parameters on the manifest in case user reloads the webpage, the selection
		// is still the same
		const oRouter = (this.getOwnerComponent() as UIComponent).getRouter() as Router;
		oRouter.navTo("RouteMain", { query: { employeeId: encodeURIComponent(sPath) } });
	}

	private onDataReceived(oEvent: Event) {
		// Here we read first all the items on the Master List page
		const oList = this.getView()?.byId("employeeList") as List;
		const aItems: ListItemBase[] = oList.getItems();

		// Now when reloading page this logic will be always executed
		// But will only be executed once if the reload button is pressed
		if (aItems.length > 0 && this.bFirstSelected) {
			const oDetailPage = this.getView()?.byId("detailPage") as Page;
			const oModel = this.getView()?.getModel("Northwind") as ODataModel;
			let oFirstListItem = aItems[0] as StandardListItem;
			let sPath = oFirstListItem.getBindingContext("Northwind")?.getPath() as string;

			// If the URL path is not initial, that means employee selected one 
			// entry, thus a navigation took place. We need to restore selected item
			if (this.sInitialPath) {
				const aFilteredItems = aItems.filter((oItem) => { return oItem.getBindingContext("Northwind")?.getPath() === this.sInitialPath });
				if (aFilteredItems.length > 0) {
					oFirstListItem = aFilteredItems[0] as StandardListItem;
					sPath = oFirstListItem.getBindingContext("Northwind")?.getPath() as string;
				} else {
					// No element was found with the parameters of URL on the list, set 1st item as default
					oFirstListItem = aItems[0] as StandardListItem;
					sPath = oFirstListItem.getBindingContext("Northwind")?.getPath()
				}
			} else {
				// Again if path on URL is initial execute default implementation
				oFirstListItem = aItems[0] as StandardListItem;
				sPath = oFirstListItem.getBindingContext("Northwind")?.getPath()
			}

			oDetailPage.bindElement({ path: `Northwind>${sPath}`, parameters: { "$expand": 'Orders' } });
			console.log(`Northwind>${sPath}`);
			oList.setSelectedItem(oFirstListItem);
			this.bFirstSelected = false;
		}
	}

	private onRefreshList(oEvent: Event) {
		const oListItem = this.getView()?.byId("employeeList") as List;
		oListItem?.getBinding("items")?.refresh();
	}

	private onPatternMatched(oEvent: Event) {
		// Read the arguments passed to the query paremeters on the URL
		const oArguments = (oEvent as any).getParameters().arguments;
		if (oArguments["?query"] && oArguments["?query"].employeeId) {
			this.sInitialPath = decodeURIComponent(oArguments["?query"].employeeId);
		}
	}
}