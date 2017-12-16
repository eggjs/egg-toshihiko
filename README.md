# egg-toshihiko

Yet another ORM called [Toshihiko](https://github.com/XadillaX/Toshihiko) plugin for egg.

> **NOTE:** This plugin just for integrate Toshihiko into Egg.js, more documentation please visit http://github.com/XadillaX/Toshihiko.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-toshihiko.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-toshihiko
[travis-image]: https://img.shields.io/travis/eggjs/egg-toshihiko.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-toshihiko
[codecov-image]: https://codecov.io/gh/eggjs/egg-toshihiko/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/eggjs/egg-toshihiko
[david-image]: https://img.shields.io/david/eggjs/egg-toshihiko.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-toshihiko
[snyk-image]: https://snyk.io/test/npm/egg-toshihiko/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-toshihiko
[download-image]: https://img.shields.io/npm/dm/egg-toshihiko.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-toshihiko

## Installation

```sh
$ npm install --save egg-toshihiko
$ npm install --save mysql2
```

## Usage & Configuration

### config/config.default.js

```js
exports.toshihiko = {
  database: '',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',

  connections: {
    default: {
      database: 'egg-toshihiko',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
    },
    noBase: {
      database: 'mysql',
    },
  },
};
```

+ `exports.toshihiko` may contain the default configuration of Toshihiko.
  (refs: http://docs.toshihikojs.com/en/latest/docs/getting-started/#setting-up-a-connection)
+ `exports.toshihiko.connections` is an object that contains one or several
  connection configurations. The configuration will combine with default
  configuration.

### config/plugin.js

```js
exports.toshihiko = {
  enable: true,
  package: 'egg-toshihiko'
};
```

### Model Files

Please put models under **app/model** directory.

| Model File | Class Name |
|------------|------------|
| user.js    | app.model.User |
| person.js  | app.model.Person |
| user_group.js | app.model.UserGroup |

### Defining a Model

When define a model, you should get a toshihiko connection first.

`app.toshi` or `app.toshihiko` equals to `require('toshihiko').Toshihiko`.

And an extra function `app.toshi.get(CONN_NAME)` returns a toshihiko connection
with name `CONN_NAME`.

You may use a connection to define a model. e.g.

```js
const conn = app.toshi.get('conn');
const User = conn.define('users', [
  ...
]);
```

And you can also define a model via default connection by calling
`app.toshi.define()`. e.g.

```js
const User = app.toshi.define('users', [
  ...
]);
```

### Types

In package Toshihiko, the types that be used in defining are in
`require('toshihiko').Type`. Here in egg-toshihiko, you may access types
directly in `app.toshi`. e.g.

```js
app.toshi.String;
app.toshi.Json;
app.toshi.Integer;
...
```

## Example

Define a model first:

```js
// app/model/user.js

module.exports = app => {
  const User = app.toshi.define('users', [
    { name: 'id', type: app.toshi.Integer, primaryKey: true },
    { name: 'username', type: app.toshi.String },
  ]);

  User.test = function() {
    return 'hello';
  };

  return User;
};
```

Now you can use it in your controller:

```js
// app/controller/users.js

module.exports = app => {
  return class UsersController extends app.Controller {
    async show() {
      const user = await this.ctx.model.User.findById(this.ctx.params.id);
      this.ctx.body = user;
    }

    async create() {
      this.ctx.body = await app.model.User.build({
        username: this.ctx.request.body.username,
      }).save();
    }
  };
};
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
