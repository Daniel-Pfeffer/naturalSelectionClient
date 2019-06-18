import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {CustomBlob} from '../../model/custom-blob';
import {DataService} from '../../services/data.service';
import {RestService} from '../../services/rest.service';
import {Food} from '../../model/food';

@Component({
    selector: 'app-display-simulation',
    templateUrl: './display-simulation.component.html',
    styleUrls: ['./display-simulation.component.css']
})
export class DisplaySimulationComponent implements OnInit, AfterViewInit {
    private isDragging: boolean;

    constructor(private data: DataService, private rest: RestService) {
    }

    @ViewChild('canvas', {static: false}) canvas: ElementRef;
    private width = window.innerWidth;
    private height = window.innerHeight;
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    private blobs: Array<CustomBlob>;
    private food: Array<Food>;
    private mapSize: number;
    private mouse = new THREE.Vector2();
    private scaling;
    private speed = false;

    /*
     * TODO: add DragControl
     *  add animationMovement
     */
    ngOnInit() {
        this.data.currentMessage.subscribe(genNo => {
            this.rest.getGeneration(genNo).subscribe(res => {
                if (!res.message) {
                    this.food = res.food;
                    this.blobs = res.blobs;
                    this.mapSize = res.mapLength;
                    let scaling;
                    /*
                     * scaling how big is a blob at current mapSize
                     * important that the blobs wont overlap that much
                     * and are positioned in a grid like order
                     */
                    // tslint:disable-next-line:max-line-length
                    scaling = this.mapSize <= 10 ? 5 : scaling = this.mapSize <= 20 && this.mapSize > 10 ? 2.5 : scaling = this.mapSize <= 30 && this.mapSize > 20 ? 1.25 : scaling = this.mapSize <= 40 && this.mapSize > 30 ? 1.1 : scaling = this.mapSize <= 50 && this.mapSize > 40 ? 1.1 : scaling = this.mapSize <= 60 && this.mapSize > 50 ? 0.8 : scaling = this.mapSize <= 70 && this.mapSize > 60 ? 0.7 : scaling = this.mapSize <= 80 && this.mapSize > 70 ? 0.6 : scaling = this.mapSize <= 90 && this.mapSize > 80 ? 0.5 : 0.4;
                    this.scaling = scaling;
                    // reset scaling
                    this.scene = new THREE.Scene();
                    // display 'helper' grid
                    this.displayGrid();
                    // generate blob
                    this.generateBlobs();
                }
            });
        });
        this.data.speedSettings.subscribe(speed => {
            this.speed = speed;
        });
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(100, 200, 0);
        this.camera.lookAt(this.scene.position);
    }

    @HostListener('document:mousedown', ['$event'])
    onmousedown(evt: MouseEvent) {
        this.isDragging = true;
        this.mouse.x = evt.x;
        this.mouse.y = evt.y;
    }

    @HostListener('document:mouseup')
    onmouseup() {
        this.isDragging = false;
    }

    @HostListener('document:mousemove', ['$event'])
    onmousemove(evt: MouseEvent) {
        if (this.isDragging) {
            const offsetX = this.mouse.x - evt.x;
            this.mouse.x = evt.x;
            const offsetY = evt.y - this.mouse.y;
            this.mouse.y = evt.y;
        }
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: MouseEvent) {
        // @ts-ignore
        const delta = event.deltaY;
        if (delta > 0) {

            this.camera.position.y += 10;
        } else {

            this.camera.position.y -= 10;
        }
    }

    @HostListener('window:keydown', ['$event'])
    onkeydown(evt: KeyboardEvent) {
        switch (evt.code) {
            case 'ArrowDown':
                this.camera.position.z -= 1;
                break;
            case 'ArrowUp':
                this.camera.position.z += 1;
                break;
            case 'ArrowRight':
                this.camera.position.x += 1;
                break;
            case 'ArrowLeft':
                this.camera.position.x -= 1;
                break;
        }
    }

    ngAfterViewInit(): void {
        this.canvas.nativeElement.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(new THREE.Color('darkgreen'));
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }

    animateMovementForBlob(blob: CustomBlob, mesh: THREE.Mesh) {
        const command = blob.moveSet.split(' ')[blob.currentMoveSetPosition];
        this.move(command, mesh, blob);
        blob.currentMoveSetPosition++;
        requestAnimationFrame(() => this.animateMovementForBlob(blob, mesh));
    }

    public displayGeneration() {
        this.food.forEach(food => {
            const geom = this.createMeshForFood(food);
            const {y, x} = food.position;
            // tslint:disable-next-line:max-line-length
            geom.position.set(Math.floor(x - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y - this.mapSize / 2) * this.scaling * 2 - this.scaling);
            this.scene.add(geom);
        });
        this.blobs.forEach(blob => {
            const geom = this.createMesh(blob);
            console.log(blob);
            if (this.speed) {
                this.trackBack(blob);
            }
            const {y, x} = blob.position;
            // tslint:disable-next-line:max-line-length
            geom.position.set(Math.floor(x - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y - this.mapSize / 2) * this.scaling * 2 - this.scaling);
            this.scene.add(geom);
            if (this.speed) {
                this.animateMovementForBlob(blob, geom);
            }
        });
        this.render();
    }

    private createMesh(blob: CustomBlob): THREE.Mesh {
        return new THREE.Mesh(
            new THREE.SphereGeometry(this.scaling, 32, 32),
            this.createMaterial(blob)
        );
    }

    private createMeshForFood(food: Food) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(this.scaling, 8, 8),
            new THREE.MeshBasicMaterial({color: 'red'})
        );
    }

    private createMaterial(blob: CustomBlob): THREE.MeshBasicMaterial {
        const p = blob.properties;
        return new THREE.MeshBasicMaterial({color: new THREE.Color(10 * p.str, 10 * p.agt, 10 * p.sight)});
    }

    private generateBlobs() {
        this.displayGeneration();
    }

    private displayGrid() {
        const size = 100;
        const grid = new THREE.GridHelper(size, this.mapSize, new THREE.Color('darkgrey'));
        grid.position.set(0, 0, 0);
        this.scene.add(grid);
    }

    private move(command: string, mesh: THREE.Mesh, blob: CustomBlob) {
        switch (command) {
            case 'R':
                blob.position.x++;
                const {x: x1, y: y1} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x1 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y1 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
            case 'L':
                blob.position.x--;
                const {x: x2, y: y2} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x2 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y2 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
            case 'T':
                blob.position.y++;
                const {x: x3, y: y3} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x3 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y3 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
            case 'B':
                blob.position.y--;
                const {x: x4, y: y4} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x4 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y4 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
            case 'LT':
                blob.position.x--;
                blob.position.y++;
                const {x: x5, y: y5} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x5 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y5 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
            case 'RT':
                blob.position.x++;
                blob.position.y++;
                const {x: x6, y: y6} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x6 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y6 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
            case 'LB':
                blob.position.x--;
                blob.position.y--;
                const {x: x7, y: y7} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x7 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y7 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
            case 'RB':
                blob.position.x++;
                blob.position.y--;
                const {x: x8, y: y8} = blob.position;
                // tslint:disable-next-line:max-line-length
                mesh.position.set(Math.floor(x8 - this.mapSize / 2) * this.scaling * 2 - this.scaling, 1, Math.floor(y8 - this.mapSize / 2) * this.scaling * 2 - this.scaling);
                break;
        }
    }

    private trackBack(blob: CustomBlob) {
        const moveSet: Array<String> = blob.moveSet.split(' ');
        moveSet.reverse().forEach(move => {
            switch (move) {
                case 'R':
                    blob.position.x--;
                    break;
                case 'L':
                    blob.position.x++;
                    break;
                case 'T':
                    blob.position.y--;
                    break;
                case 'B':
                    blob.position.y++;
                    break;
                case 'LT':
                    blob.position.x++;
                    blob.position.y--;
                    break;
                case 'RT':
                    blob.position.x--;
                    blob.position.y--;
                    break;
                case 'LB':
                    blob.position.x++;
                    blob.position.y++;
                    break;
                case 'RB':
                    blob.position.x--;
                    blob.position.y++;
                    break;
            }
        });
    }
}
