import {Component, OnInit, ElementRef} from "@angular/core";
import {VgFullscreenAPI} from "videogular2/core";


interface HotSpot {
    id: string;
    point: string
    goto: string;
}
interface Video {
    id: string;
    url: string,
    hotspots: Array<HotSpot>
}

@Component({
    selector: 'vr-player',
    templateUrl: 'src/vr-player.html'
})
export class VRPlayer implements OnInit {
    elem:any;
    aframe:any;
    currentVideo:Video;
    spinning:boolean;
    videos:Array<Video> = [
        {
            id: 'v1',
            url: 'https://ucarecdn.com/bcece0a8-86ce-460e-856b-40dac4875f15/', 
            hotspots:[
                {id: "h1", point: '-1 2 -5', goto: 'v2'},
                {id: "h2", point: '-2 3 -5', goto: 'v2'}
            ]
        },
        {
            id: 'v2',
            url: 'http://static.videogular.com/assets/videos/vr-demo.mp4', 
            hotspots:[
                {id: "h1", point: '-1 2 -5', goto: 'v1'},
                {id: "h2", point: '-2 3 -5', goto: 'v1'}
            ]
        }
    ];
    myPos:string = '-1 2 -5';

    constructor(ref:ElementRef) {
        this.elem = ref.nativeElement;
        this.currentVideo = this.videos[0];
        this.spinning = false;
    }

    ngOnInit() {
        this.aframe = this.elem.querySelector('a-scene');
        VgFullscreenAPI.onChangeFullscreen.subscribe(this.onChangeFullscreen.bind(this));
    }

    onChangeFullscreen(fsState) {
        if (fsState) {
            this.aframe.setStereoRenderer();
            this.aframe.addState('vr-mode');
        }
    }

    onMouseEnter(hotSpot:HotSpot) {
        if(!this.spinning) {
            this.spinning = true;
            document.querySelector('#'+hotSpot.id)['emit']('startSpinning'+hotSpot.id);
            setTimeout( () => {
                this.currentVideo = this.videos.filter( v => v.id === hotSpot.goto )[0];
                this.spinning = false;
            }, 1250 );
        }
    }
}
