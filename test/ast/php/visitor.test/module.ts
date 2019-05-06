export namespace foo.bar {
  export interface Baz1 {
    childType: foo.bar.Baz2
    content?: string
  }
  export interface Baz2 {
    title: string

    body?: string
  }
}
