function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import Product from "../model/product/model.js";
import asyncHandler from "../middlewares/async_handler.js";
import AppError from "../utils/app_error.js";
import User from "../model/user/model.js";
import fs from "fs";
import cloudinary from "./../middlewares/cloudinary_uploader.js";
var CLOUD_OPTS = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  folder: "Loose/products"
};
var ProductController = /*#__PURE__*/_createClass(function ProductController() {
  _classCallCheck(this, ProductController);
  // Method to create a new product
  _defineProperty(this, "createProduct", asyncHandler( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res, next) {
      var _req$files;
      var photos, _i, _arr, file, _res, product;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            photos = [];
            if (!((_req$files = req.files) !== null && _req$files !== void 0 && _req$files.length)) {
              _context.next = 14;
              break;
            }
            _i = 0, _arr = req.files;
          case 3:
            if (!(_i < _arr.length)) {
              _context.next = 13;
              break;
            }
            file = _arr[_i];
            _context.next = 7;
            return cloudinary.uploader.upload(file.path, CLOUD_OPTS);
          case 7:
            _res = _context.sent;
            photos.push({
              url: _res.secure_url,
              public_id: _res.public_id
            });
            if (_res !== null && _res !== void 0 && _res.public_id) {
              fs.unlinkSync(file.path);
            }
          case 10:
            _i++;
            _context.next = 3;
            break;
          case 13:
            req.body.photos = photos;
          case 14:
            console.log(req.body);
            _context.next = 17;
            return Product.create(req.body);
          case 17:
            product = _context.sent;
            res.status(201).json({
              success: true,
              data: {
                product: product
              }
            });
          case 19:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }()));
  // Method to get all products
  _defineProperty(this, "saleStatistics", asyncHandler( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
      var products;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Product.find().sort({
              numOfSales: -1
            }).limit(10);
          case 2:
            products = _context2.sent;
            res.status(200).json({
              success: true,
              data: {
                products: products
              }
            });
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }()));
  // Method to get all products
  _defineProperty(this, "getAllProducts", asyncHandler( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res, next) {
      var products;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Product.find();
          case 2:
            products = _context3.sent;
            res.status(200).json({
              success: true,
              data: {
                products: products
              }
            });
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function (_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  }()));
  // Method to get a product by ID
  _defineProperty(this, "getProductById", asyncHandler( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res, next) {
      var _user;
      var product;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Product.findById(req.params.id);
          case 2:
            product = _context4.sent;
            if (product) {
              _context4.next = 5;
              break;
            }
            return _context4.abrupt("return", next(new AppError("Product not found", 404)));
          case 5:
            if (!((req === null || req === void 0 || (_user = req.user) === null || _user === void 0 ? void 0 : _user.role.toLowerCase()) !== "admin")) {
              _context4.next = 8;
              break;
            }
            _context4.next = 8;
            return product.increaseViews();
          case 8:
            res.status(200).json({
              success: true,
              data: {
                product: product
              }
            });
          case 9:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function (_x10, _x11, _x12) {
      return _ref4.apply(this, arguments);
    };
  }()));
  // Method to update a product by ID
  // @req.body {restPhotos, photos}
  _defineProperty(this, "updateProducts", asyncHandler( /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res, next) {
      var _req$body, _req$files2;
      var product, _iterator, _step, photo, _req$body2, newPhotos, _i2, _arr2, file, _yield$cloudinary$upl, secure_url, public_id, updatedProduct;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Product.findById(req.params.id);
          case 2:
            product = _context5.sent;
            if (product) {
              _context5.next = 5;
              break;
            }
            return _context5.abrupt("return", next(new AppError("Product not found", 404)));
          case 5:
            if (!((_req$body = req.body) !== null && _req$body !== void 0 && _req$body.deletedPhotos)) {
              _context5.next = 28;
              break;
            }
            req.body.deletedPhotos = req.body.deletedPhotos.split(" ");
            console.log(req.body.deletedPhotos);
            _iterator = _createForOfIteratorHelper(req.body.deletedPhotos);
            _context5.prev = 9;
            _iterator.s();
          case 11:
            if ((_step = _iterator.n()).done) {
              _context5.next = 17;
              break;
            }
            photo = _step.value;
            _context5.next = 15;
            return cloudinary.uploader.destroy(photo);
          case 15:
            _context5.next = 11;
            break;
          case 17:
            _context5.next = 22;
            break;
          case 19:
            _context5.prev = 19;
            _context5.t0 = _context5["catch"](9);
            _iterator.e(_context5.t0);
          case 22:
            _context5.prev = 22;
            _iterator.f();
            return _context5.finish(22);
          case 25:
            delete req.body.deletedPhotos;
            req.body.photos = req.body.restPhotos;
            delete req.body.restPhotos;
          case 28:
            if (!((_req$files2 = req.files) !== null && _req$files2 !== void 0 && _req$files2.length)) {
              _context5.next = 45;
              break;
            }
            newPhotos = [];
            _i2 = 0, _arr2 = req.files;
          case 31:
            if (!(_i2 < _arr2.length)) {
              _context5.next = 43;
              break;
            }
            file = _arr2[_i2];
            _context5.next = 35;
            return cloudinary.uploader.upload(file.path, CLOUD_OPTS);
          case 35:
            _yield$cloudinary$upl = _context5.sent;
            secure_url = _yield$cloudinary$upl.secure_url;
            public_id = _yield$cloudinary$upl.public_id;
            newPhotos.push({
              url: secure_url,
              public_id: public_id
            });
            if (public_id) {
              fs.unlinkSync(file.path);
            }
          case 40:
            _i2++;
            _context5.next = 31;
            break;
          case 43:
            // add the new photos to the existing photos array
            if ((_req$body2 = req.body) !== null && _req$body2 !== void 0 && _req$body2.restPhotos) {
              newPhotos = [].concat(_toConsumableArray(newPhotos), _toConsumableArray(req.body.restPhotos));
              delete req.body.restPhotos;
            }
            req.body.photos = [].concat(_toConsumableArray(newPhotos), _toConsumableArray(req.body.photos));
          case 45:
            _context5.next = 47;
            return Product.findByIdAndUpdate(req.params.id, req.body, {
              "new": true
            });
          case 47:
            updatedProduct = _context5.sent;
            res.status(200).json({
              success: true,
              data: {
                product: updatedProduct
              }
            });
          case 49:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[9, 19, 22, 25]]);
    }));
    return function (_x13, _x14, _x15) {
      return _ref5.apply(this, arguments);
    };
  }()));
  // Method to delete a product by ID
  _defineProperty(this, "deleteProduct", asyncHandler( /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res, next) {
      var product, photos, _i3, _arr3, photo;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return Product.findByIdAndDelete(req.params.id);
          case 2:
            product = _context6.sent;
            if (product) {
              _context6.next = 5;
              break;
            }
            return _context6.abrupt("return", next(new AppError("Product not found", 404)));
          case 5:
            console.log(product);
            photos = product.photos; // Delete photos from cloudinary
            _i3 = 0, _arr3 = photos;
          case 8:
            if (!(_i3 < _arr3.length)) {
              _context6.next = 15;
              break;
            }
            photo = _arr3[_i3];
            _context6.next = 12;
            return cloudinary.uploader.destroy(photo.public_id);
          case 12:
            _i3++;
            _context6.next = 8;
            break;
          case 15:
            res.status(200).json({
              success: true,
              message: "Product deleted successfully"
            });
          case 16:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function (_x16, _x17, _x18) {
      return _ref6.apply(this, arguments);
    };
  }()));
  // Method to draft a product by ID
  _defineProperty(this, "draftProduct", asyncHandler( /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res, next) {
      var product;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return Product.findByIdAndUpdate(req.params.id, {
              status: "draft"
            }, {
              "new": true,
              runValidators: true
            });
          case 2:
            product = _context7.sent;
            if (product) {
              _context7.next = 5;
              break;
            }
            return _context7.abrupt("return", next(new AppError("Product not found", 404)));
          case 5:
            res.status(200).json({
              success: true,
              message: "Product drafted successfully"
            });
          case 6:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return function (_x19, _x20, _x21) {
      return _ref7.apply(this, arguments);
    };
  }()));
  // add a product to the cart
  _defineProperty(this, "addToCart", asyncHandler( /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res, next) {
      var productId, _req$body3, _req$body3$quantity, quantity, sizes, colors, product, user, cart, prodID, price, cartProduct;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            productId = req.params.id;
            _req$body3 = req.body, _req$body3$quantity = _req$body3.quantity, quantity = _req$body3$quantity === void 0 ? 1 : _req$body3$quantity, sizes = _req$body3.sizes, colors = _req$body3.colors; // Check if product exists
            _context8.next = 4;
            return Product.findById(productId);
          case 4:
            product = _context8.sent;
            if (product) {
              _context8.next = 7;
              break;
            }
            return _context8.abrupt("return", next(new AppError("Product not found", 404)));
          case 7:
            _context8.next = 9;
            return User.findById(req.user.id);
          case 9:
            user = _context8.sent;
            if (user) {
              _context8.next = 12;
              break;
            }
            return _context8.abrupt("return", next(new AppError("User not found", 404)));
          case 12:
            if (!(typeof quantity !== "number" || quantity <= 0)) {
              _context8.next = 14;
              break;
            }
            return _context8.abrupt("return", next(new AppError("Invalid quantity", 400)));
          case 14:
            // Add product to user's cart
            cart = user.cart;
            prodID = product.id, price = product.price;
            cartProduct = cart.items.find(function (item) {
              return item.product.toString() === prodID.toString();
            });
            if (cartProduct) {
              cartProduct.quantity += quantity;
              cartProduct.total += price * quantity;
              // cartProduct.colors = [...new Set([...colors, ...cartProduct.colors])];
              cartProduct.colors = [].concat(_toConsumableArray(colors), _toConsumableArray(cartProduct.colors));
              // cartProduct.sizes = [...new Set([...sizes, ...cartProduct.sizes])];
              cartProduct.sizes = [].concat(_toConsumableArray(sizes), _toConsumableArray(cartProduct.sizes));
            } else {
              cart.items.push({
                product: prodID,
                quantity: quantity,
                total: price * quantity,
                colors: colors,
                sizes: sizes
              });
            }
            user.cart.totalQuantity += quantity;
            user.cart.totalPrice += price * quantity;
            _context8.next = 22;
            return user.save();
          case 22:
            res.status(200).json({
              success: true,
              message: "Product added to cart successfully"
            });
          case 23:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function (_x22, _x23, _x24) {
      return _ref8.apply(this, arguments);
    };
  }()));
  // remove a product to the cart
  _defineProperty(this, "removeFromCart", asyncHandler( /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res, next) {
      var productId, _req$body4, _req$body4$quantity, quantity, _req$body4$colors, colors, _req$body4$sizes, sizes, product, user, cart, prodID, price, cartProduct, _iterator2, _step2, _loop, _iterator3, _step3, _loop2;
      return _regeneratorRuntime().wrap(function _callee9$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            productId = req.params.id;
            _req$body4 = req.body, _req$body4$quantity = _req$body4.quantity, quantity = _req$body4$quantity === void 0 ? 1 : _req$body4$quantity, _req$body4$colors = _req$body4.colors, colors = _req$body4$colors === void 0 ? [] : _req$body4$colors, _req$body4$sizes = _req$body4.sizes, sizes = _req$body4$sizes === void 0 ? [] : _req$body4$sizes; // Check if product exists
            _context11.next = 4;
            return Product.findById(productId);
          case 4:
            product = _context11.sent;
            if (product) {
              _context11.next = 7;
              break;
            }
            return _context11.abrupt("return", next(new AppError("Product not found", 404)));
          case 7:
            _context11.next = 9;
            return User.findById(req.user.id);
          case 9:
            user = _context11.sent;
            if (user) {
              _context11.next = 12;
              break;
            }
            return _context11.abrupt("return", next(new AppError("User not found", 404)));
          case 12:
            if (!(typeof quantity !== "number" || quantity <= 0)) {
              _context11.next = 14;
              break;
            }
            return _context11.abrupt("return", next(new AppError("Invalid quantity", 400)));
          case 14:
            // remove product to user's cart
            cart = user.cart;
            prodID = product.id, price = product.price;
            cartProduct = cart.items.find(function (item) {
              return item.product.toString() === prodID.toString();
            });
            if (!cartProduct) {
              _context11.next = 62;
              break;
            }
            if (!(quantity > cartProduct.quantity)) {
              _context11.next = 20;
              break;
            }
            return _context11.abrupt("return", next(new AppError("Invalid quantity", 400)));
          case 20:
            if (!(quantity === cartProduct.quantity)) {
              _context11.next = 24;
              break;
            }
            cart.items = cart.items.filter(function (item) {
              return item.product.toString() !== prodID.toString();
            });
            _context11.next = 60;
            break;
          case 24:
            cartProduct.quantity -= quantity;
            cartProduct.total -= price * quantity;
            if (!((colors === null || colors === void 0 ? void 0 : colors.length) > 0)) {
              _context11.next = 43;
              break;
            }
            _iterator2 = _createForOfIteratorHelper(colors);
            _context11.prev = 28;
            _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
              var color, ind;
              return _regeneratorRuntime().wrap(function _loop$(_context9) {
                while (1) switch (_context9.prev = _context9.next) {
                  case 0:
                    color = _step2.value;
                    ind = cartProduct.colors.findIndex(function (c) {
                      return color.toLowerCase() == c.toLowerCase();
                    });
                    if (ind >= 0) {
                      cartProduct.colors.splice(ind, 1);
                    }
                  case 3:
                  case "end":
                    return _context9.stop();
                }
              }, _loop);
            });
            _iterator2.s();
          case 31:
            if ((_step2 = _iterator2.n()).done) {
              _context11.next = 35;
              break;
            }
            return _context11.delegateYield(_loop(), "t0", 33);
          case 33:
            _context11.next = 31;
            break;
          case 35:
            _context11.next = 40;
            break;
          case 37:
            _context11.prev = 37;
            _context11.t1 = _context11["catch"](28);
            _iterator2.e(_context11.t1);
          case 40:
            _context11.prev = 40;
            _iterator2.f();
            return _context11.finish(40);
          case 43:
            if (!((sizes === null || sizes === void 0 ? void 0 : sizes.length) > 0)) {
              _context11.next = 60;
              break;
            }
            _iterator3 = _createForOfIteratorHelper(sizes);
            _context11.prev = 45;
            _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2() {
              var size, ind;
              return _regeneratorRuntime().wrap(function _loop2$(_context10) {
                while (1) switch (_context10.prev = _context10.next) {
                  case 0:
                    size = _step3.value;
                    ind = cartProduct.sizes.findIndex(function (sz) {
                      return size.toUpperCase() == sz.toUpperCase();
                    });
                    if (ind >= 0) {
                      cartProduct.sizes.splice(ind, 1);
                    }
                  case 3:
                  case "end":
                    return _context10.stop();
                }
              }, _loop2);
            });
            _iterator3.s();
          case 48:
            if ((_step3 = _iterator3.n()).done) {
              _context11.next = 52;
              break;
            }
            return _context11.delegateYield(_loop2(), "t2", 50);
          case 50:
            _context11.next = 48;
            break;
          case 52:
            _context11.next = 57;
            break;
          case 54:
            _context11.prev = 54;
            _context11.t3 = _context11["catch"](45);
            _iterator3.e(_context11.t3);
          case 57:
            _context11.prev = 57;
            _iterator3.f();
            return _context11.finish(57);
          case 60:
            _context11.next = 63;
            break;
          case 62:
            return _context11.abrupt("return", new AppError("Product not found in cart", 404));
          case 63:
            user.cart.totalQuantity -= quantity;
            user.cart.totalPrice -= price * quantity;
            _context11.next = 67;
            return user.save();
          case 67:
            res.status(200).json({
              success: true,
              message: "Product removed from cart successfully"
            });
          case 68:
          case "end":
            return _context11.stop();
        }
      }, _callee9, null, [[28, 37, 40, 43], [45, 54, 57, 60]]);
    }));
    return function (_x25, _x26, _x27) {
      return _ref9.apply(this, arguments);
    };
  }()));
});
export var searchProducts = asyncHandler( /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res, next) {
    var name, products;
    return _regeneratorRuntime().wrap(function _callee10$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          name = req.query.name;
          if (name) {
            _context12.next = 3;
            break;
          }
          return _context12.abrupt("return", res.status(400).json({
            success: false,
            message: "Name query parameter is required"
          }));
        case 3:
          _context12.next = 5;
          return Product.find({
            name: {
              $regex: ".*".concat(name, ".*"),
              $options: "i"
            }
          });
        case 5:
          products = _context12.sent;
          res.status(200).json({
            success: true,
            data: products
          });
        case 7:
        case "end":
          return _context12.stop();
      }
    }, _callee10);
  }));
  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());
export default new ProductController();