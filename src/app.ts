import { ComponentConstructor } from "../lib/@types/ComponentConstructor.type";
import Component from "../lib/template/Component.template";
import Counter from "./components/Counter";

class App extends Component<HTMLDivElement> {
  $$counter: Component;
  constructor({ $target }: ComponentConstructor<{}>) {
    super({ $target });
    this.$$counter = new Counter({
      $target: this.$target,
    });

    this.$children = [this.$$counter];
  }
}

export default App;
