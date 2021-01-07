# Demo for mini-css-extract-plugin

## mini-css-extract-plugin@0.9.0

```bash
$ cd mini-0.9.0
$ npm run dev:init
$ npm run build

Right:
    Expect chunkIds: 179 362
    Received chunkIds: 179 362

$ npm run build:disable-feature

Right:
    Expect chunkIds: 179 362
    Received chunkIds: 179 362
```

## mini-css-extract-plugin@0.12.0

```bash
$ cd mini-0.9.0
$ npm run dev:init
$ npm run build

Wrong:
    Expect chunkIds: 179 362
    Received chunkIds: 179 924

$ npm run build:disable-feature

Right:
    Expect chunkIds: 179 362
    Received chunkIds: 179 362
```

## mini-css-extract-plugin@1.0.0

```bash
$ cd mini-0.9.0
$ npm run dev:init
$ npm run build

Wrong:
    Expect chunkIds: 179 825
    Received chunkIds: 179 982

$ npm run build:disable-feature

Right:
    Expect chunkIds: 179 825
    Received chunkIds: 179 825
```

## mini-css-extract-plugin@0.9.0

```bash
$ cd mini-0.9.0
$ npm run dev:init
$ npm run build

Wrong:
    Expect chunkIds: 179 825
    Received chunkIds: 127 179

$ npm run build:disable-feature

Right:
    Expect chunkIds: 179 825
    Received chunkIds: 179 825
```
