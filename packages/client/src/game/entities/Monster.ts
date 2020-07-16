import { SmokeConfig, SmokeTexture } from '../particles';
import { BaseEntity } from './';
import { Effects } from '../sprites';
import { Emitter } from 'pixi-particles';
import { Graphics } from 'pixi.js';
import { Models } from '@tosios/common';
import { MonstersTextures } from '../images/textures';

const HURT_COLOR = 0xff0000;

export type MonsterDirection = 'left' | 'right';

export class Monster extends BaseEntity {
    private _toX: number = 0;

    private _toY: number = 0;

    private _direction: MonsterDirection = 'right';

    private _smoke: Emitter;

    private _shadow: Graphics;

    // Init
    constructor(props: Models.MonsterJSON) {
        super({
            x: props.x,
            y: props.y,
            radius: props.radius,
            textures: MonstersTextures.Bat,
        });

        // Shadow
        this._shadow = new Graphics();
        this._shadow.zIndex = 10;
        this._shadow.pivot.set(0.5);
        this._shadow.beginFill(0x000000, 0.3);
        this._shadow.drawEllipse(props.radius, props.radius * 2, props.radius / 2, props.radius / 4);
        this._shadow.endFill();
        this.container.addChild(this._shadow);

        // Smoke emitter
        this._smoke = new Emitter(this.container, [SmokeTexture], {
            ...SmokeConfig,
            pos: {
                x: props.radius,
                y: props.radius,
            },
        });
        this._smoke.autoUpdate = true;
        this._smoke.emit = true;
    }

    // Methods
    hurt() {
        Effects.flash(this.sprite, HURT_COLOR, 0xffffff);
    }

    // Setters
    set x(x: number) {
        this.container.x = x;
        this.body.x = x;
    }

    set y(y: number) {
        this.container.y = y;
        this.body.y = y;
    }

    set toX(toX: number) {
        this._toX = toX;
    }

    set toY(toY: number) {
        this._toY = toY;
    }

    set rotation(rotation: number) {
        this._direction = getDirection(rotation);
        switch (this._direction) {
            case 'left':
                this.sprite.scale.x = -2;
                break;
            case 'right':
                this.sprite.scale.x = 2;
                break;
            default:
                break;
        }
    }

    // Getters
    get x(): number {
        return this.body.x;
    }

    get y(): number {
        return this.body.y;
    }

    get toX() {
        return this._toX;
    }

    get toY() {
        return this._toY;
    }
}

/**
 * Get a direction given a rotation.
 */
function getDirection(rotation: number): MonsterDirection {
    if (rotation >= -(Math.PI / 2) && rotation <= Math.PI / 2) {
        return 'right';
    }

    return 'left';
}