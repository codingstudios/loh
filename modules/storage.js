import fs from "fs";
import path from "path";
const join = path.join;

export default class Storage {
  constructor() {
    this.storage = {};
    this.storagePath = join(getHomePath(), ".lohjs");
    this.load();
  }

  load() {
    if (!fs.existsSync(this.storagePath)) {
      fs.writeFileSync(this.storagePath, JSON.stringify({}));
    }
    this.storage = JSON.parse(fs.readFileSync(this.storagePath));
  }

  async save() {
    await fs.writeFileSync(this.storagePath, JSON.stringify(this.storage));
  }

  get() {
    return this.storage;
  }

  async set(storage) {
    this.storage = storage;
    await this.save();
  }
}

function getHomePath() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}
