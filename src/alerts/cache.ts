import moment from "moment";

export interface OpenSeaCacheEntry {
  id: number;
  timestamp: string;
  price: number;
}

export class OpenSeaCache {
  entries: OpenSeaCacheEntry[] = [];

  add(object: OpenSeaCacheEntry) {
    this.entries.push(object);
  }

  some(object: OpenSeaCacheEntry) {
    return this.entries.some(
      (x) =>
        x.id == object.id &&
        x.timestamp == object.timestamp &&
        x.price == object.price
    );
  }

  len() {
    return this.entries.length;
  }

  clean(lastDate: number) {
    for (let i = this.entries.length - 1; i >= 0; i--) {
      if (moment(this.entries[i].timestamp).unix() < lastDate) {
        this.entries.splice(i, 1);
      } else {
        lastDate = moment(this.entries[i].timestamp).unix();
      }
    }
  }
}
