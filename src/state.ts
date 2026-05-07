import { makeObservable, observable, action, computed } from "mobx";

export class Game {
  id = Math.random();
  status: "active" | "inactive" = "inactive";
  title: string = "";

  constructor(title: string) {
    makeObservable(this, {
      title: observable,
      status: observable,
      toggleStatus: action,
      getCurrentTitle: computed,
    });

    this.title = title;
  }

  // setStatus(status: 'active' | 'inactive') {
  //     this.status = status;
  // }

  toggleStatus() {
    this.status = this.status === "active" ? "inactive" : "active";
  }

  get getCurrentTitle() {
    return this.status === "active"
      ? `${this.title} (active)`
      : `${this.title} (inactive)`;
  }
}
