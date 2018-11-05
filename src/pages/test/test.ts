import { Component, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild("visualization") visualization: ElementRef;
  @ViewChild('img') img: ElementRef;

  private context: CanvasRenderingContext2D;
  private element: HTMLImageElement;

  src: string;
  imgWidth: number;
  imgHeight: number;

  constructor() {
    this.imgWidth = 400;
    this.imgHeight = 400;
    this.src = '';
  }

  ngAfterViewInit() {
    this.context = this.visualization.nativeElement.getContext("2d");
    this.element = this.img.nativeElement;
  }

  ionViewDidLoad() {
    
  }


  afterLoading(){
    this.context.drawImage(this.element, 0, 0);
  }

}
