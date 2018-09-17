import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { QRScanner, QRScannerStatus  } from '@ionic-native/qr-scanner';
import { BrowserQRCodeReader, VideoInputDevice } from 'zxing-typescript/src/browser/BrowserQRCodeReader'

/**
 * Generated class for the SamplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sample',
  templateUrl: 'sample.html',
})


export class SamplePage {
  public data: String;  
  public base64Image:any;

  constructor(private qrScanner: QRScanner, private camera: Camera, public navCtrl: NavController, public navParams: NavParams) {

   this.data = "@↵ANSI 636002040002DL00410265ZM03060036DLDCAD↵DCBB↵DCDNONE↵DBA09242018↵DCSSAHA↵DACSOUMITRA↵DADNONE↵DBD10222013↵DBB09241976↵DBC1↵DAYUNK↵DAU068 IN↵DAG1 INDIA STREET↵DAIBOSTON↵DAJMA↵DAK021093307  ↵DAQS36617678↵DCF10-23-2013 Rev 07-15-2009↵DCGUSA↵DDEN↵DDFN↵DDGN↵DAHAPT 11I↵DCK13296S366176780601↵DDB07152009↵ZMZMAN↵ZMB↵ZMC↵ZMD10232013↵ZME↵ZMF↵";

   var split1 = this.data.split('DCS')[1];
   var firstname = split1.split('DAC')[0];
   var remainingData = split1.split('DAC')[1];
   var lastName = remainingData.split('DAD')[0];
   var remainingData1 = remainingData.split('DAD')[1];

   var remainingData2 =  remainingData1.split('DBB')[1];
   var dob =  remainingData2.split('DBC')[0];
   var remainingData3 =  remainingData2.split('DAG')[1];
   var street =  remainingData3.split('DAI')[0];
   var remainingData4 = remainingData3.split('DAI')[1];
   var city =  remainingData4.split('DAJ')[0];
   var remainingData5 =  remainingData4.split('DAJ')[1];
   var state = remainingData5.split('DAK')[0];
   var zipcode = remainingData5.split('DAK')[1];
   zipcode = zipcode.substring(0,5);


   console.log(firstname);
   console.log(lastName);
   console.log(dob);
   console.log(street);
   console.log(city);
   console.log(state);
   console.log(zipcode);
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SamplePage');
  }

//   takePhoto(){
//     const options: CameraOptions = {
//       quality: 50,
//       destinationType: this.camera.DestinationType.DATA_URL,
//       encodingType: this.camera.EncodingType.JPEG,
//       mediaType: this.camera.MediaType.PICTURE
//     }
    
//     this.camera.getPicture(options).then((imageData) => {
//      // imageData is either a base64 encoded string or a file URI
//      // If it's base64 (DATA_URL):
//      let base64Image = 'data:image/jpeg;base64,' + imageData;
//      console.log(imageData);
//      this.base64Image= base64Image;


//     }, (err) => {
//      // Handle error
//     });

//   }


//   upload() {
//     const codeReader = new ZXing.BrowserQRCodeReader()
// const img = document.getElementById('img')
// codeReader.decodeFromImage(img)
//     .then((result) => {
//         console.log(result.text)
//     }).catch((err) => {
//         console.error(err)
//     })
//   }
//   //   this.qrScanner.prepare()
//   // .then((status: QRScannerStatus) => {
//   //    if (status.authorized) {
//   //      // camera permission was granted


//   //      // start scanning
//   //      let scanSub = this.qrScanner.scan().subscribe((text: string) => {
//   //        console.log('Scanned something', text);

//   //        this.qrScanner.hide(); // hide camera preview
//   //        scanSub.unsubscribe(); // stop scanning
//   //      });

//   //    } else if (status.denied) {
//   //      // camera permission was permanently denied
//   //      // you must use QRScanner.openSettings() method to guide the user to the settings page
//   //      // then they can grant the permission from there
//   //      console.log('permission denied','denied');
//   //    } else {
//   //     console.log('permission denied1','denied1');
//   //      // permission was denied, but not permanently. You can ask for permission again at a later time.
//   //    }
//   // })
//   // .catch((e: any) => console.log('Error is', e));
//   // }

}
