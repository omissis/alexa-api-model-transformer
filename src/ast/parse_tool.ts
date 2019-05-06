import * as ts from 'typescript';
import * as tsh from './ts/helpers';
import * as php from './php/types';
import * as str from '../strings';

export default class ParseTool {
  private modelsFilePath: string;

  readonly baseNamespace: string;

  private program: ts.Program;

  readonly sourceFile: ts.SourceFile;

  private typeFactory: php.TypeFactory;

  constructor(modelsFilePath: string, namespace: string) {
    this.modelsFilePath = modelsFilePath;

    this.baseNamespace = namespace;

    this.program = ts.createProgram([modelsFilePath], {});

    this.sourceFile = this.program.getSourceFile(this.modelsFilePath);

    this.typeFactory = new php.TypeFactory(this.baseNamespace, this.sourceFile);
  }

  interfaceProperties(
    node: ts.InterfaceDeclaration
  ): Array<{ name: string; type: { code: string; doc: string } }> {
    return node.members.filter(tsh.isPropertySignature).map(
      (
        member: ts.TypeElement
      ): { name: string; type: { code: string; doc: string } } => ({
        name: php.typeElementPhpName(member),
        type: this.typeFactory.fromTypeElement(member),
      })
    );
  }

  typeAliasLiterals(node: ts.TypeAliasDeclaration): Array<string | number> {
    if (!ts.isUnionTypeNode(node.type)) {
      return [];
    }

    const self = this;

    return node.type.types
      .map(
        (type: ts.TypeNode): string | number => {
          if (ts.isLiteralTypeNode(type)) {
            const value = str.trim(
              type.literal.getFullText(self.sourceFile),
              ' \t\n'
            );

            if (ts.isNumericLiteral(type.literal)) {
              return parseFloat(value);
            }

            return value;
          }
        }
      )
      .filter(value => typeof value != 'undefined');
  }

  typeAliasTypes(node: ts.TypeAliasDeclaration): Array<string> {
    if (!ts.isUnionTypeNode(node.type)) {
      return [];
    }

    const self = this;

    return node.type.types
      .map(
        (type: ts.TypeNode): string => {
          if (ts.isTypeReferenceNode(type)) {
            return self.typeFactory.fromEntityName(type.typeName).code;
          }
        }
      )
      .filter(value => typeof value != 'undefined');
  }
}
