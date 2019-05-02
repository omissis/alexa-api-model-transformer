# Alexa API Model Transformer

This repository contains a command-line tool for transforming Alexa's TypeScript API model into other languages, such as PHP.

## Installation

You can clone this repository in a directory of your choice and the install its dependencies:

```
git clone https://github.com/omissis/alexa-apis-transformer /<projects>/alexa-apis-transformer

cd /<projects>/alexa-apis-transformer

yarn
```

## Usage

This project's reason for existance is to create a model for other languages' SMAPI Sdks, starting from the official Typescript implementation from Amazon.

You can perform a conversion using the `yarn dump` command, and see the result being stored in the `./pkg` directory.

In case you need to update the underlying Typescript model to update the ones downstream, run `yarn update alexa-apis-for-nodejs`
