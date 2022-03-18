import { Observable } from "core/Misc/observable";

type Key = "control" | "shift" |"alt" | "space";

export class KeyboardManager {
    private _hostElement: HTMLElement | HTMLDocument;
    private _kdListener: EventListener;
    private _kuListener: EventListener;
    private _keys = new Set<Key>();
    public onKeyPressedObservable: Observable<Key>;
    constructor(hostElement: HTMLElement | HTMLDocument) {
        this._hostElement = hostElement;
        this._kdListener = evt => this._updateKeys(evt as KeyboardEvent, true);
        this._kuListener = evt => this._updateKeys(evt as KeyboardEvent, false);
        hostElement.addEventListener("keydown", this._kdListener);
        hostElement.addEventListener("keypress", this._kdListener);
        hostElement.addEventListener("keyup", this._kuListener);
        this.onKeyPressedObservable = new Observable<Key>();
    }

    private _updateKeys(event: KeyboardEvent, isDown: boolean) {
        this._setKeyDown("control", event.ctrlKey);
        this._setKeyDown("alt", event.altKey);
        this._setKeyDown("shift", event.shiftKey);
        switch (event.key) {
            case " ":
                this._setKeyDown("space", isDown);
                break;
        }
    }

    private _setKeyDown(key: Key, down: boolean) {
        const isDown = this._keys.has(key);
        if (isDown !== down) {
            if (!down) {
                this._keys.delete(key);
            } else {
                this._keys.add(key);
            }
            this.onKeyPressedObservable.notifyObservers(key);
        }
    }


    public isKeyDown(key: Key) {
        return this._keys.has(key);
    }

    public dispose() {
        this._hostElement.removeEventListener("keydown", this._kdListener);
        this._hostElement.removeEventListener("keypress", this._kdListener);
        this._hostElement.removeEventListener("keyup", this._kuListener);
    }

}