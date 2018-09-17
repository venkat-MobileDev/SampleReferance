import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform, Events } from 'ionic-angular';

import { Dialogs } from '@ionic-native/dialogs';

import { Content } from 'ionic-angular';

import { DomSanitizer } from '@angular/platform-browser';

import { CmbscannerProvider, Settings } from '../../providers/cmbscanner/cmbscanner';
import { ViewCodePage } from '../view-code/view-code';
declare var cmbScanner: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {


	list_data: any[] = [];
	@ViewChild(Content) content: Content;
	scannerActive: string = "barcode";
	triggerMode: string = "analytics";
	public connected: boolean;
	public removeBtn: boolean;




	private settings: Settings;

	constructor(private platform: Platform, public navCtrl: NavController, public cmbScannerProvider: CmbscannerProvider, private zone: NgZone, public _DomSanitizer: DomSanitizer, public events: Events, private dialogs: Dialogs) {

		cmbScanner.registerSDK("UZpnQPYHF+QV+i8fHjpmwZrdv3VYQj+oYm0w7HuDTAY=");
		//subscribe to events so we can update our model whenever the connectionState changes
		events.subscribe('connection:changed', (connectionState) => {

			if (connectionState == 2) {
				this.zone.run(() => {
					this.connected = true;
				});
			}
			else {
				this.zone.run(() => {
					this.connected = false;
				});
			}
		});


		platform.ready().then(() => {


			this.removeBtn = (this.list_data.length > 0) ? false : true;


			this.cmbScannerProvider.config().then(data => {

				this.settings = this.cmbScannerProvider.getSettings();


				if (this.settings.triggerType == 5)
					this.triggerMode = "analytics";
				else
					this.triggerMode = "crop";

				this.list_data = data.list;

				cmbScanner.setActiveStartScanningCallback(scannerState => {
					if (scannerState) {
						this.zone.run(() => {
							this.scannerActive = "power";

						});
					}
					else {
						this.zone.run(() => {
							this.scannerActive = "barcode";

						});
					}
				});

				cmbScanner.setResultCallback(result => {
					this.zone.run(() => {
						if (result.readString) {
							this.cmbScannerProvider.setResultItem(result);
							this.list_data = this.cmbScannerProvider.data;
							this.content.scrollToBottom();
						}

					});
				});





			});

		});

	}
	viewData(item) {
		this.navCtrl.push(ViewCodePage, {
			item: item
		});
	}
	removeItem(id) {
		this.list_data = this.cmbScannerProvider.removeItem(id);
	}

	removeItems() {

		this.dialogs.confirm('Really delete all')
			.then((btnIndex) => {
				if (btnIndex == 1) {
					this.list_data = this.cmbScannerProvider.removeItems();
				}

			})
			.catch(e => console.log('Error displaying dialog', e));

	}

	changeTriggerMode() {

		if (this.settings.triggerType == 5) {

			this.cmbScannerProvider.cmbScanner.setTriggerType(2).then(result => {
				//need to update buttons based on the trigger type

				if (result.status) {
					this.cmbScannerProvider.setSettingsItem('triggerType', result.trigger);

				}
			});

		}

		else {
			this.cmbScannerProvider.cmbScanner.setTriggerType(5).then(result => {
				//need to update buttons based on the trigger type
				console.log(JSON.stringify(result));
				if (result.status) {
					this.cmbScannerProvider.setSettingsItem('triggerType', result.trigger);


					// let toast = this.toastCtrl.create({
					// 	message: 'Trigger mode changed to Continuous',
					// 	duration: 2000,
					// 	position: 'top'
					// });

					// toast.onDidDismiss(() => {
					// 	console.log('Dismissed toast');
					// });

					// toast.present(); 						
				}
			});
		}


	}

	startStopScanner(event) {

		if (this.scannerActive == 'barcode') {
			let x: number = 25;
			let y: number = 31;
			let w: number = 55;
			let h: number = 44;

			console.log("preview size", x, y, w, h);

			this.cmbScannerProvider.cmbScanner.setPreviewContainerPositionAndSize(x, y, w, h);
			this.cmbScannerProvider.setSettingsItem('previewContainer', [x, y, w, h]);
			this.cmbScannerProvider.cmbScanner.loadScanner(this.settings.deviceType, (result) => {
				this.cmbScannerProvider.cmbScanner.connect().then(result => {
					this.cmbScannerProvider.start();
				});
			});
		}
		else
			this.cmbScannerProvider.stop();
	}

	triggerName(label: boolean) {
		if (label) {
			if (this.settings && this.settings.triggerType == 5)
				return 'manual trigger';
			else
				return 'manual trigger';
		}
		// else {
		// 	if (this.settings && this.settings.triggerType == 5)
		// 		return 'analytics';
		// 	else
		// 		return 'crop';

		// }
	}
	startBtnClass(cnd) {
		return cnd ? 'secondary' : 'danger';
	}
	connectedLabel(cnd) {
		return cnd ? 'connected' : 'disconnected';
	}

	triggerColor() {
		if (this.settings && this.settings.triggerType == 5) {
			return 'primary';
		}
		else {
			return 'dark'
		}
	}

	showThumb(baseImage) {


		if (baseImage)
			return 'data:image/png;base64,' + baseImage;
		else
			return 'assets/imgs/no-image-2.png';

	}
	ionViewDidEnter() {

		this.platform.ready().then(() => {

			this.settings = this.cmbScannerProvider.getSettings();

		});
	}


}
