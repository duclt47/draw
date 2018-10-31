import { File } from '@ionic-native/file';
import { Component, ViewChild } from '@angular/core';
import { NavController, Content, Platform, normalizeURL } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private plt: Platform,
    private file: File,
  ) {
    this.storage.ready().then((data: any) => {
      if (data !== null) {
        this.storedImages = data;
      }
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
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
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

    let name = new Date().getTime() + '.png';
    let path = this.file.dataDirectory;

    var data = dataUrl.split(',')[1];
    let blob = this.b64toBlob(data, 'image/png');

    this.file.writeFile(path, name, blob).then((res) => {
      this.saveImage(name);
    }, error => {
      console.log('error', error);
    });
  }

  saveImage(imageName) {
    let saveObj = { img: imageName };
    console.log(saveObj);
    this.storedImages.push(saveObj);
    this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
      this.content.scrollToBottom();
    });
  }

  removeImageAtIndex(index) {
    let removed = this.storedImages.splice(index, 1);
    this.file.removeFile(this.file.dataDirectory, removed[0].img).then(res => {
    }, err => {
      console.log('remove err; ' ,err);
    });
    this.storage.set(STORAGE_KEY, this.storedImages);
  }
   
  getImagePath(imageName) {
    let path = this.file.dataDirectory + imageName;
    // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
    path = normalizeURL(path);
    return path;
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
   
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
   
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
   
      var byteArray = new Uint8Array(byteNumbers);
   
      byteArrays.push(byteArray);
    }
   
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
