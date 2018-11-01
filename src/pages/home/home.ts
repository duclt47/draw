import { Component, ViewChild } from '@angular/core';
import { NavController, Content, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'IMAGE_LIST';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedColor = '#9e2956';
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde'];

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;

  storedImages = [];

  @ViewChild(Content) content: Content;
  @ViewChild ('fixedContainer') fixedContainer: any;

  
  @ViewChild('image') image: any;
  imageElement: any;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private plt: Platform,
  ) {
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != undefined) {
          this.storedImages = data;
        }
      });
    });
  }

  ionViewDidEnter() {
    let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    let scroll = this.content.getScrollElement();

    itemHeight = Number.parseFloat(scroll.style.marginTop.replace('px', '')) + itemHeight;
    scroll.style.marginTop = itemHeight + 'px';
  }

  ionViewDidLoad() {
    this.canvasElement = this.canvas.nativeElement;
    this.imageElement = this.image.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
    console.log('this.imageElement', this.imageElement);
    let ctx = this.canvasElement.getContext('2d');
    ctx.drawImage(this.imageElement, 0, 0, 375, 200);
  }

  onSelectColor(color) {
      this.selectedColor = color;
  }

  startDrawing(ev) {
    let canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    let canvasPosition = this.canvasElement.getBoundingClientRect();
    let currentX = ev.touches[0].pageX - canvasPosition.x;
    let currentY = ev.touches[0].pageY - canvasPosition.y;

    let ctx = this.canvasElement.getContext('2d');

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  saveCanvasImage() {
    var dataUrl = this.canvasElement.toDataURL();
    
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var data = dataUrl.split(',')[1];
    this.storedImages.push(data);

  }

  removeImageAtIndex(index) {
    this.storedImages.splice(index, 1);
  }
   
  getImagePath(base64) {
    return 'data:image/png;base64,' + base64 ;
  }

}
