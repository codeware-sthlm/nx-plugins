# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [0.2.1](https://github.com/codeware-sthlm/nx-plugins/compare/workspace-0.2.0...workspace-0.2.1) (2024-02-05)


### 🐞 Bug Fixes

* **nx-payload:** skip docker test on windows ([5fe9de9](https://github.com/codeware-sthlm/nx-plugins/commit/5fe9de9cf179214b33d1d8e355fd8f5e8fca0b1e))
* **workspace:** no need to manually track master ([16d559c](https://github.com/codeware-sthlm/nx-plugins/commit/16d559cc193d383a93a5265b6f547adff884388e))


### ⚙️ Miscellaneous Chores

* **workspace:** always use unix line endings ([61bc16f](https://github.com/codeware-sthlm/nx-plugins/commit/61bc16f33b9184af0b4da66ab4b493bbb27ee635))
* **workspace:** fix codeql linting ([0a81450](https://github.com/codeware-sthlm/nx-plugins/commit/0a81450ad9575c3672b74c90285848527b1cd62a))
* **workspace:** ignore yarn cache ([c33211b](https://github.com/codeware-sthlm/nx-plugins/commit/c33211b9d32f7f87c74cadc0a60b15642c425420))


### 🧹 Code Refactoring

* **workspace:** move e2e related code to e2e package ([5cdd14a](https://github.com/codeware-sthlm/nx-plugins/commit/5cdd14a1bdbacf3232bce3a6635f2be8d5bbf8ad))
* **workspace:** simplify workflows ([7a7f40e](https://github.com/codeware-sthlm/nx-plugins/commit/7a7f40eab182e54d85c105f775f154af01b5c4e2))


### 🤖 Continuous Integration

* **workspace:** also test on node 20 windows latest ([4a483dc](https://github.com/codeware-sthlm/nx-plugins/commit/4a483dc7e190c160a1d3de7d40707a617599ccd4))
* **workspace:** create codeql workflow ([096b9a9](https://github.com/codeware-sthlm/nx-plugins/commit/096b9a9b8cc89739e0ea241bcfa2f4a7da1ba3a6))
* **workspace:** improved local registry setup ([2265c0a](https://github.com/codeware-sthlm/nx-plugins/commit/2265c0a3292bdbb3215bf4e1363735f1c036ca1d))
* **workspace:** setup nx cloud and e2e matrix ([4255e68](https://github.com/codeware-sthlm/nx-plugins/commit/4255e685e3fc70859cdc7bd8f61bbbc0aedec3a2))


### 🛠️ Build System

* 📦 bump dependency @swc/cli to v0.3.6 ([0c216a6](https://github.com/codeware-sthlm/nx-plugins/commit/0c216a6fb5b4fb89679138a2fdf586a7bee0b940))
* 📦 bump dependency @swc/cli to v0.3.9 ([2c26bde](https://github.com/codeware-sthlm/nx-plugins/commit/2c26bde2b526103c8c5f33de2b2b0fb755f9b500))
* 📦 bump dependency @types/jest to v29.5.12 ([2c95c97](https://github.com/codeware-sthlm/nx-plugins/commit/2c95c9706cf64d74bb41e18f324e6e4b514fa2cb))
* 📦 bump dependency husky to v9.0.10 ([9a1eeb5](https://github.com/codeware-sthlm/nx-plugins/commit/9a1eeb57952d9d60490658a7f4a35eb5c52f8b8e))
* 📦 bump dependency husky to v9.0.9 ([5af2f56](https://github.com/codeware-sthlm/nx-plugins/commit/5af2f5617449af07adc0f4407e56654a993be64d))
* 📦 bump dependency prettier to v3.2.5 ([95e7022](https://github.com/codeware-sthlm/nx-plugins/commit/95e70228755b9f77ad3006be6e7d2d3070ecb18f))
* 📦 bump mxschmitt/action-tmate action to v3.17 ([4dc79b5](https://github.com/codeware-sthlm/nx-plugins/commit/4dc79b5638a422e33030153b7b8511bab3d69be9))
* 📦 bump yarn to v4.1.0 ([c44428b](https://github.com/codeware-sthlm/nx-plugins/commit/c44428bb60239bb590f65df7503a7c8f8bd91f15))

## [0.2.0](https://github.com/codeware-sthlm/nx-plugins/compare/workspace-0.1.4...workspace-0.2.0) (2024-01-31)


### ✨ Features

* **nx-payload:** run application in development mode ([9e8d709](https://github.com/codeware-sthlm/nx-plugins/commit/9e8d709a3908ef2c9360708a256b78ffe36390a6))


### 🛠️ Build System

* 📦 bump dependency husky to v9.0.7 ([4dd7eea](https://github.com/codeware-sthlm/nx-plugins/commit/4dd7eeae5f8192fe2e50e95de590e9447fc52bc9))
* 📦 lock file maintenance ([f135b6a](https://github.com/codeware-sthlm/nx-plugins/commit/f135b6a72d141195ffea717a6e094a7e731ec887))

## [0.1.4](https://github.com/codeware-sthlm/nx-plugins/compare/workspace-0.1.3...workspace-0.1.4) (2024-01-28)


### 🐞 Bug Fixes

* **workspace:** add required option to ngx-deploy-npm ([90bdc94](https://github.com/codeware-sthlm/nx-plugins/commit/90bdc94eed32b198fb429195f7e9205e234eb890))
* **workspace:** must set npm package version to current version ([5b2c044](https://github.com/codeware-sthlm/nx-plugins/commit/5b2c0440ec538b9701d727afb5a6b174dabf50c9))


### 📄 Documentation

* improve readme content to be relevant and accurate ([8245656](https://github.com/codeware-sthlm/nx-plugins/commit/82456567ea91963ea1f0a3a9c4aa557498621cec))
* readme add badges and minor fixes ([a2db264](https://github.com/codeware-sthlm/nx-plugins/commit/a2db264b0e8c268a4a1644b565a54fa2fe492909))
* **workspace:** add codecov badge to readme ([78efac7](https://github.com/codeware-sthlm/nx-plugins/commit/78efac758e1a63a2c40b311e8b6a370b14581747))


### ⚙️ Miscellaneous Chores

* bump commitlint monorepo to v18.5.0 ([7028622](https://github.com/codeware-sthlm/nx-plugins/commit/7028622b83cc24021e84476305706b47a0c4ebe5))
* bump dependency @swc/cli to v0.2.2 ([69ff875](https://github.com/codeware-sthlm/nx-plugins/commit/69ff875818e25438cfca6e92404e0ce9a2ae2a29))
* bump dependency @swc/cli to v0.3.0 ([ac237bb](https://github.com/codeware-sthlm/nx-plugins/commit/ac237bba943cefb4da44ca781d0420bc0c946376))
* bump dependency @swc/core to v1.3.106 ([45fe93f](https://github.com/codeware-sthlm/nx-plugins/commit/45fe93fe97223f8b93eff2b8f4c64af8d818b70c))
* bump dependency @types/express to v4.17.21 ([8309db9](https://github.com/codeware-sthlm/nx-plugins/commit/8309db906e3dae36525fb8c95d43d5398fda46af))
* bump dependency @types/node to v18.19.9 ([14488a1](https://github.com/codeware-sthlm/nx-plugins/commit/14488a11e7ab7e1c40758f276476f885b79f163c))
* bump dependency @types/node to v20 ([5a72121](https://github.com/codeware-sthlm/nx-plugins/commit/5a721219af0f52f418ad3efd5106ed57624d907c))
* bump dependency eslint to v8.56.0 ([d4ef8e9](https://github.com/codeware-sthlm/nx-plugins/commit/d4ef8e93bea1b78d75cddf1a2a752622e55cf24d))
* bump dependency husky to v9 ([38a7ecf](https://github.com/codeware-sthlm/nx-plugins/commit/38a7ecfecacc3f1ce13c11e39bbf82d3f3ad81d1))
* bump dependency husky to v9.0.5 ([0a47b98](https://github.com/codeware-sthlm/nx-plugins/commit/0a47b98c67fb94fb8ec12910b7b5172d10c6aa26))
* bump dependency ngx-deploy-npm to v8 ([13e09ab](https://github.com/codeware-sthlm/nx-plugins/commit/13e09abdfef2c37749a5239e99ac2124219acb38))
* bump dependency prettier to v3.2.4 ([2f46653](https://github.com/codeware-sthlm/nx-plugins/commit/2f46653a5d0c3fe318b70ffe92eb884f42b40e62))
* bump dependency supertest to v6.3.4 ([94003a0](https://github.com/codeware-sthlm/nx-plugins/commit/94003a02d8bdba8efc7ccaf42f874af7f88695db))
* bump dependency ts-jest to v29.1.2 ([c3410c5](https://github.com/codeware-sthlm/nx-plugins/commit/c3410c5eef5ac6aae79bbc3cad9701dfd598d1fc))
* bump dependency ts-node to v10.9.2 ([7ea8429](https://github.com/codeware-sthlm/nx-plugins/commit/7ea8429f7e89cdcf79cff115aa2e13be99e4b341))
* bump dependency typescript to v5.3.3 ([a9bd72d](https://github.com/codeware-sthlm/nx-plugins/commit/a9bd72d21bcd5e992d7aef971fe9845c1cbbd17b))
* bump styfle/cancel-workflow-action action to v0.12.0 ([42145aa](https://github.com/codeware-sthlm/nx-plugins/commit/42145aad78d8e1c40fafef73a4b81092ce01dfea))
* bump styfle/cancel-workflow-action action to v0.12.1 ([edc28b1](https://github.com/codeware-sthlm/nx-plugins/commit/edc28b17c798c1619998ba03d52f1f4bcb3f2b5d))
* bump swc monorepo ([7f842cf](https://github.com/codeware-sthlm/nx-plugins/commit/7f842cfc47bdb82d35d22b4ba1cac02b4576c956))
* bump typescript-eslint monorepo to v6.19.1 ([fc32591](https://github.com/codeware-sthlm/nx-plugins/commit/fc32591da77897ee6f943cbf7271aecfd4293c03))
* **workspace:** create license file ([a9a71ed](https://github.com/codeware-sthlm/nx-plugins/commit/a9a71ed181f2d4757468e8fd63eddfbb2abcbcdb))
* **workspace:** do not track dependencies and add more types to readme ([f6aded8](https://github.com/codeware-sthlm/nx-plugins/commit/f6aded83cd76cb35239fb39f9b6c3591511885ce))
* **workspace:** set renovate on hold until better configured ([f112d79](https://github.com/codeware-sthlm/nx-plugins/commit/f112d79b5b66a5d3fc223284b3bd6ac4d02aec91))
* **workspace:** update to node 20 ([2251317](https://github.com/codeware-sthlm/nx-plugins/commit/22513170791fce69fbd142bd5cb98f87ddb172de))
* **workspace:** update to yarn 4 ([d9990c4](https://github.com/codeware-sthlm/nx-plugins/commit/d9990c4823779c43d9b6687e7417f5283d5c9713))
* **workspace:** use local yarn cache with mixed compression ([ff941d0](https://github.com/codeware-sthlm/nx-plugins/commit/ff941d093b4217cb20a11322d716befbfb13d759))
* **workspace:** use yarnPath to make ci work without corepack ([8867e6d](https://github.com/codeware-sthlm/nx-plugins/commit/8867e6dc9d64beb03223038c2217188c2ecd22f2))


### 🧹 Code Refactoring

* **nx-payload:** use custom admin build path ([cf6a6db](https://github.com/codeware-sthlm/nx-plugins/commit/cf6a6db14be164d30855346731c00d4893bf4925))


### 🤖 Continuous Integration

* add more choices to release workflow ([d02ab20](https://github.com/codeware-sthlm/nx-plugins/commit/d02ab208fd38ce47a825ec017739650e7894bbd0))
* **workspace:** activate codecov ([0661def](https://github.com/codeware-sthlm/nx-plugins/commit/0661def92883d46150093d24f9c4f1486a6bdf7f))
* **workspace:** add renovate configuration ([4f4d65b](https://github.com/codeware-sthlm/nx-plugins/commit/4f4d65bdad79ba2fd5a63db1543256b1bde451e9))
* **workspace:** allow empty release and remove default release type ([7b863ae](https://github.com/codeware-sthlm/nx-plugins/commit/7b863aee62f209e7a4bbcaf409ae8e804ebc9468))
* **workspace:** allow renovate to trigger test workflow ([c46b18b](https://github.com/codeware-sthlm/nx-plugins/commit/c46b18bd3d5afe481d76d29f5f9330dedead81f5))
* **workspace:** always use master as base for affected projects ([640a64c](https://github.com/codeware-sthlm/nx-plugins/commit/640a64c177e7913d9db15a08baf6382162297a24))
* **workspace:** enable github merge queue ([1121dce](https://github.com/codeware-sthlm/nx-plugins/commit/1121dce2c47d74c97abe863cca47d5e9c5666774))
* **workspace:** fix release logic typos ([95d029a](https://github.com/codeware-sthlm/nx-plugins/commit/95d029a6e95176380e9b103d53660e71ab68897c))
* **workspace:** renovate should have build type ([12f82a9](https://github.com/codeware-sthlm/nx-plugins/commit/12f82a9b726a81de4793f82b72b7453d8de94ae7))


### 🛠️ Build System

* 📦 bump commitlint monorepo to v18.6.0 ([385209d](https://github.com/codeware-sthlm/nx-plugins/commit/385209d202b0dccd82911e1a13cfafa8a386fb02))
* 📦 bump dependency @swc/cli to v0.3.2 ([9e118f3](https://github.com/codeware-sthlm/nx-plugins/commit/9e118f3f1c5065c18164a173d67dfea56ae4ce9f))
* 📦 bump dependency @types/node to v20.11.7 ([3926524](https://github.com/codeware-sthlm/nx-plugins/commit/3926524e44299757d7489c75aed2ac5c81c15e65))
* 📦 bump dependency husky to v9.0.6 ([f1fdd81](https://github.com/codeware-sthlm/nx-plugins/commit/f1fdd815e605d1b301eeb06893c491ebf62483cb))

## [0.1.3](https://github.com/codeware-sthlm/nx-plugins/compare/workspace-0.1.2...workspace-0.1.3) (2024-01-15)


### Bug Fixes

* **create-nx-payload:** use command name as initial workspace name ([d3fb8c1](https://github.com/codeware-sthlm/nx-plugins/commit/d3fb8c1d162e554c9324660a697d91cfe1fd2c97))



## [0.1.2](https://github.com/codeware-sthlm/nx-plugins/compare/workspace-0.1.1...workspace-0.1.2) (2024-01-14)


### Bug Fixes

* set name and directory properly when using preset ([adef13c](https://github.com/codeware-sthlm/nx-plugins/commit/adef13c3e81a32f0ce71ec26950e86b5b6a79abe))



## [0.1.1](https://github.com/codeware-sthlm/nx-plugins/compare/workspace-0.1.0...workspace-0.1.1) (2024-01-10)


### Bug Fixes

* **nx-payload:** setup network in docker compose and persist mongo db ([dcb92f1](https://github.com/codeware-sthlm/nx-plugins/commit/dcb92f1d496310c8c60f966cc4209b14567f2a81))



# 0.1.0 (2024-01-09)


### Bug Fixes

* **nx-payload:** use correct commands in dockerfile ([33085e0](https://github.com/codeware-sthlm/nx-plugins/commit/33085e020530837cdc94304b7e1f461592c718ef))
* **workspace:** push release commit only when npm publish works ([7b2454b](https://github.com/codeware-sthlm/nx-plugins/commit/7b2454b1f5ed7458a060182a47f5d8593d195ed0))


### Features

* **workspace:** implement semver and improve workflows ([2bee60b](https://github.com/codeware-sthlm/nx-plugins/commit/2bee60bfd1e1e03ca83725a76e32a80be13ef7f0))



# 0.1.0 (2024-01-05)


### Features

* **core:** implement semantic-release on packages level ([9765821](https://github.com/codeware-sthlm/nx-plugins/commit/9765821bfb40e3c17295bf85bd87c043bd16f175))
