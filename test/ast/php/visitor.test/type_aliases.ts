export type Baz = 'ONE' | 'TWO' | 'THREE'

export type Quux = foo.bar.Baz1 | foo.bar.Baz2

export namespace foo.bar {
  export interface Baz1 {
    childType: foo.bar.Baz2
    content?: string
  }
  export interface Baz2 {
    parentType: foo.bar.Baz1
    body?: string
  }
}
