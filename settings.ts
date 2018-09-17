import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, Events } from 'ionic-angular';

import { CmbscannerProvider, Settings, DeviceType , TriggerType } from '../../providers/cmbscanner/cmbscanner';

import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



export class PositionValidator {

  static validPosition(fc: FormControl){
    if(fc.value<0 || fc.value>100){
      return {validPosition: false};
    } else {
      return null;
    }
  }
}




@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

	private settings : Settings;


	public deviceName : string;
	public triggerName : string;
	public enableImage : boolean;
	public enableImageGraphics : boolean;


	validation_messages: any = {
		'required' : 'Value is required.',
		'validPosition' : 'Position value can only be between 0 and 100.'

	};


	symbolsForm :  FormGroup;
	previewSizeForm : FormGroup;

	DeviceType : typeof DeviceType = DeviceType;
	TriggerType : typeof TriggerType = TriggerType;

  constructor(private platform: Platform, public navCtrl: NavController, public navParams: NavParams,private zone: NgZone, public cmbScannerProvider : CmbscannerProvider, public formBuilder :  FormBuilder,private toastCtrl: ToastController,public events : Events) {


	events.subscribe('connection:changed', (connectionState) => {

		this.settings= this.cmbScannerProvider.getSettings();

 		this.zone.run(() => {
			this.deviceName = "DEVICE_TYPE_MOBILE_DEVICE";	
			this.triggerName = "MANUAL_TRIGGER";

			this.enableImage = this.settings.enableImage;
			this.enableImageGraphics = this.settings.enableImageGraphics;

			console.log("deviceName",this.deviceName);
			console.log("deviceName1",this.triggerName);
			console.log("deviceName1",this.enableImage);
			console.log("deviceName3",this.enableImageGraphics);

	    });
	});  

	events.subscribe('settings:update',(item,value,status)=>{

			if(item == 'triggerType')
				this.triggerName = TriggerType[value];
			if(item == 'deviceType')
				this.deviceName = DeviceType[value];
		
	});

    platform.ready().then(() => {

		this.settings = this.cmbScannerProvider.getSettings();


		// this.triggerForm = formBuilder.group({
		//     trigger: [this.settings.triggerType, Validators.compose([Validators.required])]
		// });

		this.previewSizeForm = formBuilder.group({
		    x: [this.settings.previewContainer[0], Validators.compose([
		    	Validators.required,
		    	PositionValidator.validPosition
		    	])],
		    y: [this.settings.previewContainer[1], Validators.compose([Validators.required])],
		    w: [this.settings.previewContainer[2], Validators.compose([Validators.required])],
		    h: [this.settings.previewContainer[3], Validators.compose([Validators.required])]
		});



		// for (let type in TriggerType) {
		//     if (!Number(type)) {
		//     	this.arrTriggerTypes.push({name:this.triggerNames[type],value:TriggerType[type]});
		//     }
		// }


		// Object.keys(DeviceType).forEach(k => {
		// 	if(typeof DeviceType[k as any] === "number"){
		// 		this.arrDeviceTypes.push({name:this.deviceNames[k] as any,value:DeviceType[k as any]});
		// 	}
		// })


		this.symbolsForm = formBuilder.group({items : this.formBuilder.array([])});

		this.settings.symbols.forEach((v) => {
			let isSet = (this.settings.enabledSymbols.indexOf(v) > -1) ? true : false;
			this.symbolsForm.controls['items']['controls'].push(this.createItem(v,isSet));

		});

		this.deviceName = "DEVICE_TYPE_MOBILE_DEVICE";	
		this.triggerName = "MANUAL_TRIGGER";

		this.enableImage = this.settings.enableImage;
		this.enableImageGraphics = this.settings.enableImageGraphics;
	
	

    });	

  }

	createItem(symbol,value): FormGroup {
		return this.formBuilder.group({
		name: symbol,
		state: value
		});
	}  

  onChangeTrigger(){

  	let triggerType : number = TriggerType[this.triggerName];
  	if(triggerType != this.settings.triggerType){
		this.cmbScannerProvider.cmbScanner.setTriggerType(triggerType).then(result =>{

			if(result.status)
				this.cmbScannerProvider.setSettingsItem('triggerType',result.trigger);
		});
  	}
  }
  onEnableImage(){
	this.cmbScannerProvider.setSettingsItem('enableImage',this.enableImage);
	this.cmbScannerProvider.setSettingsItem('enableImageGraphics',this.enableImageGraphics);
	

  	this.cmbScannerProvider.cmbScanner.loadScanner(this.settings.deviceType,(result) => {
		this.cmbScannerProvider.cmbScanner.connect().then(result => {

			if(!result.status){
				let toast = this.toastCtrl.create({
					message: '' ,
					duration: 2000,
					position: 'top'
				});
				toast.onDidDismiss(() => {});
				toast.present();   				
			}
		});
  	});

	

  }

  savePreviewSizeForm(){

  	//even though type number is selected for these fields the form still sends them as strings, so i need to parse them
  	let x:number = 25;
  	let y:number = 31;
  	let w:number = 55;
	  let h:number = 44;
	  
	  console.log("preview size", x,y,w,h);

  	this.cmbScannerProvider.cmbScanner.setPreviewContainerPositionAndSize(x,y,w,h);
  	this.cmbScannerProvider.setSettingsItem('previewContainer',[x,y,w,h]);
  	this.cmbScannerProvider.cmbScanner.loadScanner(this.settings.deviceType,(result) => {
		this.cmbScannerProvider.cmbScanner.connect().then(result => {
			let toast = this.toastCtrl.create({
				message: 'Preview screen at: '+ this.previewSizeForm.controls.x.value +','+ this.previewSizeForm.controls.y.value +','+ this.previewSizeForm.controls.w.value +','+ this.previewSizeForm.controls.h.value,
				duration: 2000,
				position: 'top'
			});
			toast.onDidDismiss(() => {console.log('Dismissed toast'); });
			toast.present();   				
		});
  	});
  }

  changeDeviceBtn(){

  	let deviceType : number = DeviceType[this.deviceName];

  	if(deviceType != this.settings.deviceType){
		//only do this if there was a change
	    this.cmbScannerProvider.cmbScanner.loadScanner(deviceType,(result) =>{
			if(result.status){
				this.cmbScannerProvider.setSettingsItem('deviceType',result.type);
			}
			else{
				let toast = this.toastCtrl.create({
					message: 'Can\'t load Scanner!',
					duration: 2000,
					position: 'top'
				});

				toast.onDidDismiss(() => {console.log('Dismissed toast'); });

				toast.present(); 			
			}

	        this.cmbScannerProvider.cmbScanner.connect().then(connectResult => {

				let toast = this.toastCtrl.create({
					message: (connectResult.status) ? 'Reader Status:  Connected' : 'Reader Status: Disconnected',
					duration: 2000,
					position: 'top'
				});

				toast.onDidDismiss(() => {console.log('Dismissed toast'); });

				toast.present(); 			        	
	        });
	    });  	  	
  	}


  }
  onUpdateSymbols(i:number){

  	let symbol : string = this.symbolsForm.controls.items['controls'][i]['controls'].name.value;
  	let isSet : boolean = this.symbolsForm.controls.items['controls'][i]['controls'].state.value;

	 console.log("symbol", symbol,isSet);
	  
	if(this.settings.enabledSymbols.indexOf(symbol) < 0 && !isSet){

	}
	else{

	  	this.cmbScannerProvider.cmbScanner.setSymbologyEnabled(symbol,isSet).then(result =>{
	  		if(result.status){
	  			this.cmbScannerProvider.setSymbolItem(symbol,isSet); //set the new state into the storage 
	  		}
	  		else{
	  			//could not set it

				let toast = this.toastCtrl.create({
					message: 'Can\'t enable '+symbol+' for this READER DEVICE',
					duration: 2000,
					position: 'bottom'
				});

				toast.onDidDismiss(() => {
					console.log('Dismissed toast');
				});

				toast.present(); 

				this.symbolsForm.controls.items['controls'][i].controls.state.value = false;
	  		}

	  	})
	}


  }



  ionViewDidLoad() {
    
  }

  ionViewDidEnter(){

  	this.platform.ready().then(() => {

  		this.settings= this.cmbScannerProvider.getSettings();

  		// if(this.triggerForm.controls.trigger.value as number != this.settings.triggerType as number){
  		// 	//patch the value if they are different
  		// 	this.triggerForm.controls.trigger.patchValue(this.settings.triggerType,{emitEvent: false});
  		// }


  	});
  }

}
