import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;
  @ViewChild('imageCanvas') image: any;
  imageElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.canvasElement = this.canvas.nativeElement;
    this.imageElement = this.image.nativeElement;

    let ctx = this.canvasElement.getContext('2d');

    ctx.drawImage(this.imageElement, 0, 0);
  }

}
