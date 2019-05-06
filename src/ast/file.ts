export class DestinationFile {
  readonly path: string;

  readonly content: string;

  constructor(path: string, content: string) {
    this.path = path;
    this.content = content;
  }

  static empty() {
    return new DestinationFile('', '');
  }

  isEmpty(): boolean {
    return this.path === '' && this.content === '';
  }
}

export default undefined;
