'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = prepareData;

var _classic = require('react-relay/classic');

var _classic2 = _interopRequireDefault(_classic);

var _toGraphQL = require('react-relay/lib/toGraphQL');

var _toGraphQL2 = _interopRequireDefault(_toGraphQL);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prepareData(_ref, networkLayer) {
  var Container = _ref.Container,
      queryConfig = _ref.queryConfig;
  var preloadedRequests = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return new _promise2.default(function (resolve, reject) {
    var environment = new _classic2.default.Environment();
    var data = [];

    var storeData = environment.getStoreData();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(preloadedRequests), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ref4 = _step.value;
        var query = _ref4.query,
            response = _ref4.response;

        storeData.handleQueryPayload(query, response);
        data.push({ query: _toGraphQL2.default.Query(query), response: response });
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    environment.injectNetworkLayer({
      sendMutation: networkLayer.sendMutation.bind(networkLayer),
      supports: networkLayer.supports.bind(networkLayer),

      sendQueries: function sendQueries(requests) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          var _loop = function _loop() {
            var request = _step2.value;

            request.then(function (_ref3) {
              var response = _ref3.response;

              data.push({ query: _toGraphQL2.default.Query(request.getQuery()), response: response });
            });
          };

          for (var _iterator2 = (0, _getIterator3.default)(requests), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return networkLayer.sendQueries(requests);
      }
    });

    var querySet = _classic2.default.getQueries(Container, queryConfig);
    environment.primeCache(querySet, onReadyStateChange);

    function onReadyStateChange(readyState) {
      if (readyState.error) {
        reject(readyState.error);
      } else if (readyState.aborted) {
        reject(new Error('Aborted'));
      } else if (readyState.done) {
        var props = {
          Container: Container,
          environment: environment,
          queryConfig: queryConfig,
          initialReadyState: readyState
        };
        resolve({ data: data, props: props });
      }
    }
  });
}