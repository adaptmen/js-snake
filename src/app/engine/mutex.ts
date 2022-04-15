

export class Mutex {

  private _locked = false;

  lock() {
    this._locked = true;
  }

  unlock() {
    this._locked = false;
  }

  get locked() {
    return this._locked;
  }

}