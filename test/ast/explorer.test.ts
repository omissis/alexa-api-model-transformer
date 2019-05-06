import fs from 'fs';
import ts from 'typescript';
import Explorer from '../../src/ast/explorer';
import Visitor from '../../src/ast/visitor';
import { DestinationFile } from '../../src/ast/file';

describe('AST Explorer', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should exist', () => {
    expect(Explorer).not.toBe(undefined);
  });

  it('should return empty array if source file is empty', () => {
    const modelsFilePath = `${__dirname}/explorer.test/empty.ts`;
    const program = ts.createProgram([modelsFilePath], {});
    const sourceFile = program.getSourceFile(modelsFilePath);
    const visitor = (jest.mock('../../src/ast/visitor') as unknown) as Visitor;
    const explorer = new Explorer(visitor);

    expect(explorer.explore(sourceFile)).toEqual([]);
  });

  it('should return empty array if generated destination files are empty', () => {
    const modelsFilePath = `${__dirname}/explorer.test/interface_type_alias.ts`;
    const program = ts.createProgram([modelsFilePath], {});
    const sourceFile = program.getSourceFile(modelsFilePath);

    const VisitorMock = jest.fn<Visitor>().mockImplementation(() => {
      return {
        visitModule: jest
          .fn<Array<DestinationFile>>()
          .mockImplementation(() => []),
        visitInterface: jest
          .fn<DestinationFile>()
          .mockImplementation(() => DestinationFile.empty()),
        visitTypeAlias: jest
          .fn<DestinationFile>()
          .mockImplementation(() => DestinationFile.empty()),
      };
    });

    const visitor = new VisitorMock();
    const explorer = new Explorer(visitor);

    expect(explorer.explore(sourceFile)).toHaveLength(0);
    expect(visitor.visitModule).toHaveBeenCalledTimes(0);
    expect(visitor.visitInterface).toHaveBeenCalledTimes(1);
    expect(visitor.visitTypeAlias).toHaveBeenCalledTimes(1);
  });

  it('should return an array with an interface and a type alias', () => {
    const modelsFilePath = `${__dirname}/explorer.test/interface_type_alias.ts`;
    const program = ts.createProgram([modelsFilePath], {});
    const sourceFile = program.getSourceFile(modelsFilePath);

    const VisitorMock = jest.fn<Visitor>().mockImplementation(() => {
      return {
        visitModule: jest
          .fn<Array<DestinationFile>>()
          .mockImplementation(() => {
            return [];
          }),
        visitInterface: jest.fn<DestinationFile>().mockImplementation(() => {
          return new DestinationFile('/tmp/foo.php', '<?php // some code');
        }),
        visitTypeAlias: jest.fn<DestinationFile>().mockImplementation(() => {
          return new DestinationFile('/tmp/bar.php', '<?php // some code');
        }),
      };
    });

    const visitor = new VisitorMock();
    const explorer = new Explorer(visitor);

    expect(explorer.explore(sourceFile)).toHaveLength(2);
    expect(visitor.visitModule).toHaveBeenCalledTimes(0);
    expect(visitor.visitInterface).toHaveBeenCalledTimes(1);
    expect(visitor.visitTypeAlias).toHaveBeenCalledTimes(1);
  });

  it('should return an array with an interface and a type alias from the module', () => {
    const modelsFilePath = `${__dirname}/explorer.test/module.ts`;
    const program = ts.createProgram([modelsFilePath], {});
    const sourceFile = program.getSourceFile(modelsFilePath);

    const VisitorMock = jest.fn<Visitor>().mockImplementation(() => {
      return {
        visitModule: jest
          .fn<Array<DestinationFile>>()
          .mockImplementation(() => {
            return [
              new DestinationFile('/tmp/foo/bar/baz.php', '<?php // some code'),
              new DestinationFile(
                '/tmp/foo/bar/quux.php',
                '<?php // some code'
              ),
            ];
          }),
        visitInterface: jest.fn<DestinationFile>().mockImplementation(() => {
          DestinationFile.empty();
        }),
        visitTypeAlias: jest.fn<DestinationFile>().mockImplementation(() => {
          DestinationFile.empty();
        }),
      };
    });

    const visitor = new VisitorMock();
    const explorer = new Explorer(visitor);

    expect(explorer.explore(sourceFile)).toHaveLength(2);
    expect(visitor.visitModule).toHaveBeenCalledTimes(1);
    expect(visitor.visitInterface).toHaveBeenCalledTimes(0);
    expect(visitor.visitTypeAlias).toHaveBeenCalledTimes(0);
  });

  it('dumps files on the file system', () => {
    jest.mock('fs');

    jest.spyOn(fs, 'mkdirSync');
    jest.spyOn(fs, 'writeFileSync');

    const modelsFilePath = `${__dirname}/explorer.test/module.ts`;
    const program = ts.createProgram([modelsFilePath], {});
    const sourceFile = program.getSourceFile(modelsFilePath);

    const VisitorMock = jest.fn<Visitor>().mockImplementation(() => {
      return {
        visitModule: jest
          .fn<Array<DestinationFile>>()
          .mockImplementation(() => {
            return [
              new DestinationFile('/tmp/foo/bar/baz.php', '<?php // some code'),
              new DestinationFile(
                '/tmp/foo/bar/quux.php',
                '<?php // some more code'
              ),
            ];
          }),
        visitInterface: jest.fn<DestinationFile>().mockImplementation(() => {
          DestinationFile.empty();
        }),
        visitTypeAlias: jest.fn<DestinationFile>().mockImplementation(() => {
          DestinationFile.empty();
        }),
      };
    });

    const visitor = new VisitorMock();
    const explorer = new Explorer(visitor);

    explorer.dump(sourceFile);

    expect(fs.mkdirSync).toBeCalledWith('/tmp/foo/bar', { recursive: true });
    expect(fs.writeFileSync).toBeCalledWith(
      '/tmp/foo/bar/baz.php',
      '<?php // some code'
    );
    expect(fs.writeFileSync).toBeCalledWith(
      '/tmp/foo/bar/quux.php',
      '<?php // some more code'
    );
  });
});
