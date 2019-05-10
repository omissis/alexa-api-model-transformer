export class DestinationFile {
  readonly path: string

  readonly content: string

  readonly sourceDeclaration: string

  constructor(path: string, content: string, sourceDeclaration: string) {
    this.path = path
    this.content = content
    this.sourceDeclaration = sourceDeclaration
  }

  static empty() {
    return new DestinationFile('', '', '')
  }

  isEmpty(): boolean {
    return this.path === '' && this.content === ''
  }
}

export default undefined
