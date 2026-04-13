//Mon Apr 13 2026 04:27:22 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const $ = new Env("一汽大众"),
  CryptoJS = require("crypto-js"),
  axios = require("axios"),
  {
    sendNotify
  } = require("./sendNotify"),
  cache = require("./cache"),
  SyncRequest = require("sync-request");
let notifyStr = "";
const Did = process.env.yqdz_Did,
  apiHost = "https://one-app-h5.faw-vw.com/prod-api/mobile/one-app",
  appHost = "https://oneapp-api.faw-vw.com";
(async () => {
  checkVersion("yqdz.js", "69b096d5d012547512b31c18613bfa8e");
  const _0x1f0e98 = process.env.yqdz_accounts;
  if (!Did || !_0x1f0e98) {
    logAndNotify("yqdz_Did或yqdz_accounts不存在");
    return;
  }
  cache.initializeCache();
  let _0x4dff59 = _0x1f0e98.split("\n");
  for (let _0x1f1346 = 0; _0x1f1346 < _0x4dff59.length; _0x1f1346++) {
    const _0x431265 = _0x4dff59[_0x1f1346].split("#")[0];
    logAndNotify("🧐" + _0x431265 + "🧐");
    const _0x2b25b9 = _0x4dff59[_0x1f1346].split("#")[1];
    let _0x37a0b7 = cache.readCache(_0x431265);
    if (!_0x37a0b7) {
      const _0x346367 = await sendPostRequest(apiHost, "/user/public/v1/login", undefined, {
        account: "" + _0x431265,
        password: "" + _0x2b25b9,
        scope: "openid profile mbb"
      });
      if (_0x346367.data.returnStatus !== "SUCCEED") {
        logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】登录失败☹");
        continue;
      }
      logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】登录成功");
      _0x37a0b7 = _0x346367.data.data.tokenInfo;
      cache.addCache(_0x431265, _0x37a0b7);
    } else {
      logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】从缓存中读取用户信息");
    }
    const _0x5913c4 = await sendPostRequest(apiHost, "/general/public/v1/member/get_miniapp_score", _0x37a0b7.accessToken, {
      systemKey: "8F7EC8DCAEE74A2FA1",
      tenantId: "VW",
      businessId: 1,
      businessTypeId: 1,
      scoreTypeId: 2
    });
    if (_0x5913c4.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】缓存失效 重新登录");
      const _0x9cc9bc = await sendPostRequest(apiHost, "/user/public/v1/login", undefined, {
        account: "" + _0x431265,
        password: "" + _0x2b25b9,
        scope: "openid profile mbb"
      });
      if (_0x9cc9bc.data.returnStatus !== "SUCCEED") {
        logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】登录失败☹");
        continue;
      }
      logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】登录成功");
      _0x37a0b7 = _0x9cc9bc.data.data.tokenInfo;
      cache.addCache(_0x431265, _0x37a0b7);
    }
    const _0x2b4360 = await sendGetRequest(apiHost, "/general/public/v1/mall/integral/get_days_sign", _0x37a0b7.accessToken);
    if (_0x2b4360.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】签到失败");
      continue;
    }
    logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】签到成功 累计签到【" + _0x2b4360.data.data.totaldays + "】天 总积分【" + _0x2b4360.data.data.availablescore + "】");
    const _0x2526e9 = await sendGetRequest(appHost, "/profile/member/getDayIncrease/v1", _0x37a0b7.accessToken);
    logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】今日获取积分【" + _0x2526e9.data.data + "】");
    const _0x436414 = await sendGetRequest(appHost, "/profile/lottery/able/v1", _0x37a0b7.accessToken);
    _0x436414.data.returnStatus !== "SUCCEED" ? logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】查询盲盒状态出错") : !_0x436414.data.data.able ? logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】还不到开盲盒的时候") : logAndNotify("账号【" + (_0x1f1346 + 1) + "】 【" + _0x431265 + "】可以开盲盒了 手动去app开");
  }
})().catch(_0x4c8c4e => {
  logAndNotify(_0x4c8c4e);
}).finally(() => {
  sendNotify("一汽大众", notifyStr);
  $.done();
});
function oaSignFunc(_0x574ce7) {
  var _0x1b747a = _0x574ce7.url,
    _0x1accd0 = _0x574ce7.data,
    _0x56e84c = "",
    _0x56540f = {};
  _0x1b747a.split("?")[1] && _0x1b747a.split("?")[1].split("&").forEach(function (_0x559642) {
    var _0x3ed50f = _0x559642.split("=");
    _0x56540f[_0x3ed50f[0]] = decodeURIComponent(_0x3ed50f[1]);
  });
  var _0x4b49be = _0x56540f.signTimestamp,
    _0x282fb8 = _0x56540f.nonce,
    _0x410980 = btoa(unescape(encodeURIComponent(JSON.stringify(_0x1accd0)))) + _0x282fb8 + _0x4b49be,
    _0x2699d7 = CryptoJS.HmacSHA256(_0x410980, atob("NjNmYThjZDA2ZGRhMzQ3ODQ3MTNjMWZkY2NmN2U2YmQ=")).words,
    _0x451ee5 = new ArrayBuffer(32),
    _0x337859 = new DataView(_0x451ee5);
  _0x2699d7.forEach(function (_0x3d4ccc, _0x28a95b) {
    _0x337859.setInt32(4 * _0x28a95b, _0x3d4ccc, !1);
  });
  for (var _0xaf477e = 0; _0xaf477e < 32;) {
    _0x56e84c += (255 & _0x337859.getInt8(_0xaf477e) | 256).toString(16).substring(1, 3);
    _0xaf477e++;
  }
  return _0x56e84c;
}
function signUrl(_0x43221e) {
  var _0x1834e2 = _0x43221e.path,
    _0x2271f2 = _0x43221e.params,
    _0xf6d9d3 = _0x2271f2,
    _0x2b8d2a = "9144085367";
  _0xf6d9d3.appkey = _0x2b8d2a;
  _0xf6d9d3.signTimestamp = Date.now();
  _0xf6d9d3.timestamp = _0xf6d9d3.signTimestamp;
  _0xf6d9d3.nonce = Array.from({
    length: 8
  }).map(function () {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
  }).join("");
  var _0xb6e997 = Object.keys(_0xf6d9d3).map(_0x888682 => _0x888682 + "=" + _0xf6d9d3[_0x888682]);
  _0xf6d9d3.digitalSign = function (_0x2490fb, _0x28e484) {
    var _0x349435,
      _0x42ef80 = _0x2490fb.replace("one-app/", "").replace("test/", "").replace(/^\//, "");
    if (Array.isArray(_0x28e484)) {
      _0x28e484.sort();
      var _0x1e32de = "".concat(_0x42ef80, "_").concat(_0x28e484.join("_"), "_").concat("63fa8cd06dda34784713c1fdccf7e6bd"),
        _0x4fd1af = encodeURIComponent(_0x1e32de);
      _0x349435 = CryptoJS.MD5(_0x4fd1af).toString(CryptoJS.enc.Hex);
    } else {
      console.error("signAlgorithm - queryArray 必须为数组！");
    }
    return _0x349435;
  }(_0x1834e2, _0xb6e997);
  return Object.keys(_0xf6d9d3).map(_0x4aa6b8 => _0x4aa6b8 + "=" + _0xf6d9d3[_0x4aa6b8]).join("&");
  console.error("signAlgorithm - appkey 不存在！");
  return _0xf6d9d3;
}
function sendPostRequest(_0xdc5759, _0x43cd45, _0x4df5ee, _0x15a01c) {
  const _0x2a68ad = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html",
    entry: "vwapp"
  };
  if (_0x43cd45.indexOf("?") > -1) {
    _0x43cd45 += "&" + signUrl({
      path: _0x43cd45,
      params: {}
    });
  } else {
    _0x43cd45 += "?" + signUrl({
      path: _0x43cd45,
      params: {}
    });
  }
  const _0x5b7a5e = _0xdc5759 + _0x43cd45;
  let _0x425f53 = {};
  _0x4df5ee ? _0x425f53 = {
    ..._0x2a68ad,
    ...{
      Authorization: "Bearer " + _0x4df5ee
    },
    ...{
      bodySign: oaSignFunc({
        url: _0x43cd45,
        data: _0x15a01c
      })
    }
  } : _0x425f53 = {
    ..._0x2a68ad
  };
  const _0x46a7e3 = axios.create({
    headers: _0x425f53
  });
  return _0x46a7e3.post(_0x5b7a5e, _0x15a01c);
}
function sendGetRequest(_0x2c70f2, _0xda6bef, _0x1d07c9) {
  const _0x2b8df0 = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html",
    entry: "vwapp"
  };
  _0xda6bef.indexOf("?") > -1 ? _0xda6bef += "&" + signUrl({
    path: _0xda6bef,
    params: {}
  }) : _0xda6bef += "?" + signUrl({
    path: _0xda6bef,
    params: {}
  });
  const _0x1e434f = _0x2c70f2 + _0xda6bef;
  let _0xde7652 = {};
  if (_0x1d07c9) {
    _0xde7652 = {
      ..._0x2b8df0,
      ...{
        Authorization: "Bearer " + _0x1d07c9
      },
      ...{
        bodySign: oaSignFunc({
          url: _0xda6bef,
          data: {}
        })
      }
    };
  } else {
    _0xde7652 = {
      ..._0x2b8df0
    };
  }
  const _0x4fc530 = axios.create({
    headers: _0xde7652
  });
  return _0x4fc530.get(_0x1e434f);
}
function logAndNotify(_0x234683) {
  1;
  $.log(_0x234683);
  notifyStr += _0x234683;
  notifyStr += "\n";
}
function Env(_0xb4612e, _0x4846ea) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0x46a5b5 {
    constructor(_0x4bd56d) {
      this.env = _0x4bd56d;
    }
    send(_0x57f426, _0x4d74d9 = "GET") {
      _0x57f426 = "string" == typeof _0x57f426 ? {
        url: _0x57f426
      } : _0x57f426;
      let _0x53e099 = this.get;
      "POST" === _0x4d74d9 && (_0x53e099 = this.post);
      return new Promise((_0x16c242, _0x2d9129) => {
        _0x53e099.call(this, _0x57f426, (_0x31b0da, _0x238d43, _0x406efc) => {
          _0x31b0da ? _0x2d9129(_0x31b0da) : _0x16c242(_0x238d43);
        });
      });
    }
    get(_0x8ab8da) {
      return this.send.call(this.env, _0x8ab8da);
    }
    post(_0x14dcea) {
      return this.send.call(this.env, _0x14dcea, "POST");
    }
  }
  return new class {
    constructor(_0x4819f7, _0x3b1158) {
      this.name = _0x4819f7;
      this.http = new _0x46a5b5(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0x3b1158);
      this.log("", "🔔" + this.name + ", 开始!");
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(_0x59bbcf, _0x4c3b41 = null) {
      try {
        return JSON.parse(_0x59bbcf);
      } catch {
        return _0x4c3b41;
      }
    }
    toStr(_0x48844a, _0xb6b12 = null) {
      try {
        return JSON.stringify(_0x48844a);
      } catch {
        return _0xb6b12;
      }
    }
    getjson(_0x3f73d2, _0x574b26) {
      let _0x2e29c4 = _0x574b26;
      const _0x2e31ff = this.getdata(_0x3f73d2);
      if (_0x2e31ff) {
        try {
          _0x2e29c4 = JSON.parse(this.getdata(_0x3f73d2));
        } catch {}
      }
      return _0x2e29c4;
    }
    setjson(_0x568853, _0x3e7cf6) {
      try {
        return this.setdata(JSON.stringify(_0x568853), _0x3e7cf6);
      } catch {
        return !1;
      }
    }
    getScript(_0x302b58) {
      return new Promise(_0x3b7fa8 => {
        this.get({
          url: _0x302b58
        }, (_0xa94cc9, _0x159161, _0x22502f) => _0x3b7fa8(_0x22502f));
      });
    }
    runScript(_0x1764c8, _0x593796) {
      return new Promise(_0x253015 => {
        let _0x592a66 = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0x592a66 = _0x592a66 ? _0x592a66.replace(/\n/g, "").trim() : _0x592a66;
        let _0x29e6a1 = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x29e6a1 = _0x29e6a1 ? 1 * _0x29e6a1 : 20;
        _0x29e6a1 = _0x593796 && _0x593796.timeout ? _0x593796.timeout : _0x29e6a1;
        const [_0x17a9bb, _0x11f18f] = _0x592a66.split("@"),
          _0xa97e53 = {
            url: "http://" + _0x11f18f + "/v1/scripting/evaluate",
            body: {
              script_text: _0x1764c8,
              mock_type: "cron",
              timeout: _0x29e6a1
            },
            headers: {
              "X-Key": _0x17a9bb,
              Accept: "*/*"
            }
          };
        this.post(_0xa97e53, (_0x279efe, _0x111513, _0x25a46e) => _0x253015(_0x25a46e));
      }).catch(_0x5f5e07 => this.logErr(_0x5f5e07));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x3b288d = this.path.resolve(this.dataFile),
          _0x154d74 = this.path.resolve(process.cwd(), this.dataFile),
          _0x3248a3 = this.fs.existsSync(_0x3b288d),
          _0x80d3f0 = !_0x3248a3 && this.fs.existsSync(_0x154d74);
        if (!_0x3248a3 && !_0x80d3f0) {
          return {};
        }
        {
          const _0x5a6690 = _0x3248a3 ? _0x3b288d : _0x154d74;
          try {
            return JSON.parse(this.fs.readFileSync(_0x5a6690));
          } catch (_0x48fe2b) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x140643 = this.path.resolve(this.dataFile),
          _0x52763a = this.path.resolve(process.cwd(), this.dataFile),
          _0x1bf749 = this.fs.existsSync(_0x140643),
          _0x19a4a1 = !_0x1bf749 && this.fs.existsSync(_0x52763a),
          _0x3ea3ba = JSON.stringify(this.data);
        _0x1bf749 ? this.fs.writeFileSync(_0x140643, _0x3ea3ba) : _0x19a4a1 ? this.fs.writeFileSync(_0x52763a, _0x3ea3ba) : this.fs.writeFileSync(_0x140643, _0x3ea3ba);
      }
    }
    lodash_get(_0x518533, _0x3a8318, _0x1d7ce7) {
      const _0x743b23 = _0x3a8318.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0x405123 = _0x518533;
      for (const _0x5887d5 of _0x743b23) if (_0x405123 = Object(_0x405123)[_0x5887d5], void 0 === _0x405123) {
        return _0x1d7ce7;
      }
      return _0x405123;
    }
    lodash_set(_0x49b6f3, _0x20e23e, _0x1aa5a6) {
      return Object(_0x49b6f3) !== _0x49b6f3 ? _0x49b6f3 : (Array.isArray(_0x20e23e) || (_0x20e23e = _0x20e23e.toString().match(/[^.[\]]+/g) || []), _0x20e23e.slice(0, -1).reduce((_0x460460, _0x569584, _0xd7adbf) => Object(_0x460460[_0x569584]) === _0x460460[_0x569584] ? _0x460460[_0x569584] : _0x460460[_0x569584] = Math.abs(_0x20e23e[_0xd7adbf + 1]) >> 0 == +_0x20e23e[_0xd7adbf + 1] ? [] : {}, _0x49b6f3)[_0x20e23e[_0x20e23e.length - 1]] = _0x1aa5a6, _0x49b6f3);
    }
    getdata(_0x4640f9) {
      let _0x24af24 = this.getval(_0x4640f9);
      if (/^@/.test(_0x4640f9)) {
        const [, _0x10fc4b, _0xbf88f1] = /^@(.*?)\.(.*?)$/.exec(_0x4640f9),
          _0x2f8a39 = _0x10fc4b ? this.getval(_0x10fc4b) : "";
        if (_0x2f8a39) {
          try {
            const _0x577059 = JSON.parse(_0x2f8a39);
            _0x24af24 = _0x577059 ? this.lodash_get(_0x577059, _0xbf88f1, "") : _0x24af24;
          } catch (_0x480754) {
            _0x24af24 = "";
          }
        }
      }
      return _0x24af24;
    }
    setdata(_0x45385a, _0x31863b) {
      let _0x3dd7ad = !1;
      if (/^@/.test(_0x31863b)) {
        const [, _0x17069b, _0x293163] = /^@(.*?)\.(.*?)$/.exec(_0x31863b),
          _0x2b1805 = this.getval(_0x17069b),
          _0x5a4ce9 = _0x17069b ? "null" === _0x2b1805 ? null : _0x2b1805 || "{}" : "{}";
        try {
          const _0xc63f61 = JSON.parse(_0x5a4ce9);
          this.lodash_set(_0xc63f61, _0x293163, _0x45385a);
          _0x3dd7ad = this.setval(JSON.stringify(_0xc63f61), _0x17069b);
        } catch (_0x28c35a) {
          const _0x1b346d = {};
          this.lodash_set(_0x1b346d, _0x293163, _0x45385a);
          _0x3dd7ad = this.setval(JSON.stringify(_0x1b346d), _0x17069b);
        }
      } else {
        _0x3dd7ad = this.setval(_0x45385a, _0x31863b);
      }
      return _0x3dd7ad;
    }
    getval(_0x578cd8) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x578cd8) : this.isQuanX() ? $prefs.valueForKey(_0x578cd8) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x578cd8]) : this.data && this.data[_0x578cd8] || null;
    }
    setval(_0x15b3fd, _0x56d17d) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0x15b3fd, _0x56d17d) : this.isQuanX() ? $prefs.setValueForKey(_0x15b3fd, _0x56d17d) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x56d17d] = _0x15b3fd, this.writedata(), !0) : this.data && this.data[_0x56d17d] || null;
    }
    initGotEnv(_0x8f76ef) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x8f76ef && (_0x8f76ef.headers = _0x8f76ef.headers ? _0x8f76ef.headers : {}, void 0 === _0x8f76ef.headers.Cookie && void 0 === _0x8f76ef.cookieJar && (_0x8f76ef.cookieJar = this.ckjar));
    }
    get(_0x4f01b4, _0x1339bf = () => {}) {
      _0x4f01b4.headers && (delete _0x4f01b4.headers["Content-Type"], delete _0x4f01b4.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x4f01b4.headers = _0x4f01b4.headers || {}, Object.assign(_0x4f01b4.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x4f01b4, (_0x27c8fe, _0x1d0e38, _0x428588) => {
        !_0x27c8fe && _0x1d0e38 && (_0x1d0e38.body = _0x428588, _0x1d0e38.statusCode = _0x1d0e38.status);
        _0x1339bf(_0x27c8fe, _0x1d0e38, _0x428588);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x4f01b4.opts = _0x4f01b4.opts || {}, Object.assign(_0x4f01b4.opts, {
        hints: !1
      })), $task.fetch(_0x4f01b4).then(_0x64b6f6 => {
        const {
          statusCode: _0x58fa0d,
          statusCode: _0x3fbb1d,
          headers: _0x3ef05c,
          body: _0x5cbb96
        } = _0x64b6f6;
        _0x1339bf(null, {
          status: _0x58fa0d,
          statusCode: _0x3fbb1d,
          headers: _0x3ef05c,
          body: _0x5cbb96
        }, _0x5cbb96);
      }, _0x162a50 => _0x1339bf(_0x162a50))) : this.isNode() && (this.initGotEnv(_0x4f01b4), this.got(_0x4f01b4).on("redirect", (_0x67ff54, _0x313de3) => {
        try {
          if (_0x67ff54.headers["set-cookie"]) {
            const _0x52072c = _0x67ff54.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x52072c && this.ckjar.setCookieSync(_0x52072c, null);
            _0x313de3.cookieJar = this.ckjar;
          }
        } catch (_0x137dc1) {
          this.logErr(_0x137dc1);
        }
      }).then(_0x407754 => {
        const {
          statusCode: _0x493899,
          statusCode: _0x7f973b,
          headers: _0x48f216,
          body: _0x119388
        } = _0x407754;
        _0x1339bf(null, {
          status: _0x493899,
          statusCode: _0x7f973b,
          headers: _0x48f216,
          body: _0x119388
        }, _0x119388);
      }, _0x2b8253 => {
        const {
          message: _0x571f77,
          response: _0x827013
        } = _0x2b8253;
        _0x1339bf(_0x571f77, _0x827013, _0x827013 && _0x827013.body);
      }));
    }
    post(_0x1140f9, _0x250815 = () => {}) {
      if (_0x1140f9.body && _0x1140f9.headers && !_0x1140f9.headers["Content-Type"] && (_0x1140f9.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x1140f9.headers && delete _0x1140f9.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x1140f9.headers = _0x1140f9.headers || {}, Object.assign(_0x1140f9.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x1140f9, (_0xe52320, _0x1f6e85, _0x5309f5) => {
          !_0xe52320 && _0x1f6e85 && (_0x1f6e85.body = _0x5309f5, _0x1f6e85.statusCode = _0x1f6e85.status);
          _0x250815(_0xe52320, _0x1f6e85, _0x5309f5);
        });
      } else {
        if (this.isQuanX()) {
          _0x1140f9.method = "POST";
          this.isNeedRewrite && (_0x1140f9.opts = _0x1140f9.opts || {}, Object.assign(_0x1140f9.opts, {
            hints: !1
          }));
          $task.fetch(_0x1140f9).then(_0x531e80 => {
            const {
              statusCode: _0x47d0d1,
              statusCode: _0x4f2a1a,
              headers: _0x1ae7a3,
              body: _0xc1a59e
            } = _0x531e80;
            _0x250815(null, {
              status: _0x47d0d1,
              statusCode: _0x4f2a1a,
              headers: _0x1ae7a3,
              body: _0xc1a59e
            }, _0xc1a59e);
          }, _0x261bb0 => _0x250815(_0x261bb0));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x1140f9);
            const {
              url: _0x188c74,
              ..._0x373b2c
            } = _0x1140f9;
            this.got.post(_0x188c74, _0x373b2c).then(_0x488c98 => {
              const {
                statusCode: _0x1bb44b,
                statusCode: _0x1dcca0,
                headers: _0x5b8c2d,
                body: _0x224c03
              } = _0x488c98;
              _0x250815(null, {
                status: _0x1bb44b,
                statusCode: _0x1dcca0,
                headers: _0x5b8c2d,
                body: _0x224c03
              }, _0x224c03);
            }, _0x649e9e => {
              const {
                message: _0x5c6dc3,
                response: _0xf8f761
              } = _0x649e9e;
              _0x250815(_0x5c6dc3, _0xf8f761, _0xf8f761 && _0xf8f761.body);
            });
          }
        }
      }
    }
    time(_0x30824a, _0x3919c4 = null) {
      const _0x47e0a0 = _0x3919c4 ? new Date(_0x3919c4) : new Date();
      let _0x1c6409 = {
        "M+": _0x47e0a0.getMonth() + 1,
        "d+": _0x47e0a0.getDate(),
        "H+": _0x47e0a0.getHours(),
        "m+": _0x47e0a0.getMinutes(),
        "s+": _0x47e0a0.getSeconds(),
        "q+": Math.floor((_0x47e0a0.getMonth() + 3) / 3),
        S: _0x47e0a0.getMilliseconds()
      };
      /(y+)/.test(_0x30824a) && (_0x30824a = _0x30824a.replace(RegExp.$1, (_0x47e0a0.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x549e54 in _0x1c6409) new RegExp("(" + _0x549e54 + ")").test(_0x30824a) && (_0x30824a = _0x30824a.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x1c6409[_0x549e54] : ("00" + _0x1c6409[_0x549e54]).substr(("" + _0x1c6409[_0x549e54]).length)));
      return _0x30824a;
    }
    msg(_0x36a01e = _0xb4612e, _0x531010 = "", _0x39c7c4 = "", _0x493010) {
      const _0x2b29cb = _0x3ace0f => {
        if (!_0x3ace0f) {
          return _0x3ace0f;
        }
        if ("string" == typeof _0x3ace0f) {
          return this.isLoon() ? _0x3ace0f : this.isQuanX() ? {
            "open-url": _0x3ace0f
          } : this.isSurge() ? {
            url: _0x3ace0f
          } : void 0;
        }
        if ("object" == typeof _0x3ace0f) {
          if (this.isLoon()) {
            let _0x2ec6bd = _0x3ace0f.openUrl || _0x3ace0f.url || _0x3ace0f["open-url"],
              _0x1e6bb5 = _0x3ace0f.mediaUrl || _0x3ace0f["media-url"];
            return {
              openUrl: _0x2ec6bd,
              mediaUrl: _0x1e6bb5
            };
          }
          if (this.isQuanX()) {
            let _0x4d551d = _0x3ace0f["open-url"] || _0x3ace0f.url || _0x3ace0f.openUrl,
              _0x27792d = _0x3ace0f["media-url"] || _0x3ace0f.mediaUrl;
            return {
              "open-url": _0x4d551d,
              "media-url": _0x27792d
            };
          }
          if (this.isSurge()) {
            let _0x5f3b5f = _0x3ace0f.url || _0x3ace0f.openUrl || _0x3ace0f["open-url"];
            return {
              url: _0x5f3b5f
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x36a01e, _0x531010, _0x39c7c4, _0x2b29cb(_0x493010)) : this.isQuanX() && $notify(_0x36a01e, _0x531010, _0x39c7c4, _0x2b29cb(_0x493010))), !this.isMuteLog) {
        let _0x40c762 = ["", "==============📣系统通知📣=============="];
        _0x40c762.push(_0x36a01e);
        _0x531010 && _0x40c762.push(_0x531010);
        _0x39c7c4 && _0x40c762.push(_0x39c7c4);
        console.log(_0x40c762.join("\n"));
        this.logs = this.logs.concat(_0x40c762);
      }
    }
    log(..._0x3908e0) {
      _0x3908e0.length > 0 && (this.logs = [...this.logs, ..._0x3908e0]);
      console.log(_0x3908e0.join(this.logSeparator));
    }
    logErr(_0x53a3fe, _0x2d2b02) {
      const _0xe097be = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0xe097be ? this.log("", "❗️" + this.name + ", 错误!", _0x53a3fe.stack) : this.log("", "❗️" + this.name + ", 错误!", _0x53a3fe);
    }
    wait(_0xab57f3) {
      return new Promise(_0x9049dc => setTimeout(_0x9049dc, _0xab57f3));
    }
    done(_0x24fc01 = {}) {
      const _0x2c20d5 = new Date().getTime(),
        _0x32068d = (_0x2c20d5 - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0x32068d + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x24fc01);
    }
  }(_0xb4612e, _0x4846ea);
}
function checkVersion(_0x5adf55, _0x219dd4) {
  try {
    logAndNotify("文件md5：" + _0x219dd4);
    const _0x29d595 = SyncRequest("GET", "https://bus.yxrong.cn/api/update/check?fileName=" + _0x5adf55 + "&fileMd5=" + _0x219dd4),
      _0x343034 = JSON.parse(_0x29d595.getBody("utf8"));
    if (_0x343034.code === 301) {
      process.exit(0);
    } else {
      logAndNotify(_0x343034.data);
    }
  } catch (_0x2fdf78) {
    logAndNotify("版本检查失败:", _0x2fdf78);
  }
}