'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = {
  STATE_START: 1,
  STATE_REMOTE: 2,
  STATE_CODES: 3
};

var LircdConf = function () {
  function LircdConf(config) {
    _classCallCheck(this, LircdConf);

    this.config = config;
    this.state = constants.STATE_START;
  }

  _createClass(LircdConf, [{
    key: 'convertTabs',
    value: function convertTabs(string) {
      return string.replace(/\t/g, ' ');
    }
  }, {
    key: 'removeComments',
    value: function removeComments(string) {
      return string.replace(/#.+/g, '');
    }
  }, {
    key: 'isBeginRemote',
    value: function isBeginRemote(line) {
      return line.match(/begin \s*remote/i) !== null;
    }
  }, {
    key: 'isEndRemote',
    value: function isEndRemote(line) {
      return line.match(/end \s*remote/i) !== null;
    }
  }, {
    key: 'isBeginCodes',
    value: function isBeginCodes(line) {
      return line.match(/begin \s*codes/i) !== null;
    }
  }, {
    key: 'isEndCodes',
    value: function isEndCodes(line) {
      return line.match(/end \s*codes/i) !== null;
    }
  }, {
    key: 'isBeginRawCodes',
    value: function isBeginCodes(line) {
      return line.match(/begin \s*raw_codes/i) !== null;
    }
  }, {
    key: 'isEndRawCodes',
    value: function isEndCodes(line) {
      return line.match(/end \s*raw_codes/i) !== null;
    }
  }, {
    key: 'trim',
    value: function trim(string) {
      return string.replace(/^\s+|\s+$/g, '');
    }
  }, {
    key: 'removeExtraWhitespace',
    value: function removeExtraWhitespace(string) {
      return string.replace(/\s+/g, ' ');
    }
  }, {
    key: 'parseAttribute',
    value: function parseAttribute(line) {
      var re = line.match(/^\s*(\S+)\s*(.*)$/);

      if (re) {
        return { key: this.trim(re[1]), value: this.removeExtraWhitespace(this.trim(re[2])) };
      }
      return null;
    }
  }, {
    key: 'parse',
    value: function parse() {
      var _this = this;

      var config = this.convertTabs(this.config);
      config = this.removeComments(config);

      var result = {
        remotes: []
      };

      var currentRemote = {};
      var currentButtonName='';
      config.split("\n").forEach(function (line) {
        switch (_this.state) {
          case constants.STATE_REMOTE:
            if (_this.isEndRemote(line)) {
              result.remotes.push(currentRemote);
              _this.state = constants.STATE_START;
            } else if (_this.isBeginCodes(line)) {
              currentRemote.codes = {};
              _this.state = constants.STATE_CODES;
            } else if (_this.isBeginRawCodes(line)) {
              currentRemote.raw_codes = {};
              _this.state = constants.STATE_RAW_CODES;
            } else {
              var attribute = _this.parseAttribute(line);
              if (attribute !== null) {
                currentRemote[attribute.key] = attribute.value;
              }
            }
            break;
          case constants.STATE_CODES:
            if (_this.isEndCodes(line)) {
              _this.state = constants.STATE_REMOTE;
            } else {
              var code = _this.parseAttribute(line);
              if (code !== null) {
                currentRemote.codes[code.key] = code.value;
              }
            }
            break;
          case constants.STATE_RAW_CODES:
            if (_this.isEndRawCodes(line)) {
              _this.state = constants.STATE_REMOTE;
            } else {
              var code = _this.parseAttribute(line);
              if (code !== null) {
                if(code.key == 'name'){
                  currentButtonName = code.value;
                  currentRemote.raw_codes[currentButtonName] = ''
                }
                else 
                  currentRemote.raw_codes[currentButtonName] += 
                    (((currentRemote.raw_codes[currentButtonName])?' ':'')+code.key+((code.value)?' ':'')+code.value);
              }
            }
            break;
          default:
            if (_this.isBeginRemote(line)) {
              var _currentRemote = {};
              _this.state = constants.STATE_REMOTE;
            }
            break;
        }
      });

      if (this.state === constants.STATE_CODES) {
        throw new Error("Missing end codes");
      }

      if (this.state !== constants.STATE_START) {
        throw new Error("Missing end remote");
      }

      this.processParsed(result);

      return result;
    }
  }, {
      key: 'processParsed',
      value: function processParsed(parsedData) {
        parsedData.remotes.forEach(function (remote){
          if(remote.flags.indexOf('SPACE_ENC') != -1) {
        //  remote['MS']=[['M','S'],['M','S']];
            remote['MS']=[[0,1],[0,1]];
          }
          else if(remote.flags.indexOf('SHIFT_ENC') != -1) {
          //  remote['MS']=[['S','M'],['S','M']];
            remote['MS']=[[1,0],[1,0]];
          }
          else if(remote.flags.indexOf('RC5') != -1) {
          //  remote['MS']=[['M','S'],['S','M']];
            remote['MS']=[[0,1],[1,0]];
          }
          else if(remote.flags.indexOf('RC6') != -1) { // lirc conf file have inverted bits for RC6
          //  remote['MS']=[['M','S'],['S','M']];
            remote['MS']=[[0,1],[1,0]];
          }
          remote.totalBits = 0;
          remote.totalBits += remote.bits = (remote.bits)?parseInt(remote.bits):0;
          remote.totalBits += remote.pre_data_bits = (remote.pre_data_bits)?parseInt(remote.pre_data_bits):0;
          remote.totalBits += remote.post_data_bits = (remote.post_data_bits)?parseInt(remote.post_data_bits):0;
          
          if(!remote.toggle_bit && remote.repeat_bit) remote.toggle_bit = remote.repeat_bit;
          if(!remote.toggle_bit_mask && remote.toggle_bit) {
            remote.toggle_bit_mask = '0x'+(1<<(remote.totalBits-parseInt(remote.toggle_bit))).toString(16)
          }
          if(remote.toggle_bit_mask) {
            var tbm = parseInt(remote.toggle_bit_mask);
            if(remote.post_data_bits && tbm << remote.post_data_bits)
              remote.post_data_toggle_bit_mask = tbm;
            else if (remote.bits && tbm << (remote.bits + remote.post_data_bits))
              remote.data_toggle_bit_mask = tbm << remote.post_data_bits;
            else if (remote.pre_data_bits && tbm << (remote.pre_data_bits + remote.bits + remote.post_data_bits))
              remote.pre_data_toggle_bit_mask = tbm << (remote.bits + remote.post_data_bits);
          }
        });
      }
  }], [{
    key: 'getRaw',
    value: function getRaw(remote, keyName) {
      if(remote.raw_codes && remote.raw_codes[keyName]) return remote.raw_codes[keyName];
      if(remote.codes && !remote.codes[keyName]) return [];
      var zeroOne = [remote.zero.split(" ").map(Number),remote.one.split(" ").map(Number)]
      ,   MS = remote.MS
      ,   rawArr = [], pendingMark=0, pendingSpace=0;
      var insertMarkIntoRawArr = function(mark) {
            pendingSpace && rawArr.push(pendingSpace) && (pendingSpace=0);
            pendingMark = mark;
      }
      var insertSpaceIntoRawArr = function(space) {
            pendingMark && rawArr.push(pendingMark) && (pendingMark=0);
            pendingSpace = space;
      }
      var insertMarkSpaceIntoRawArr = function(mark,space){
          insertMarkIntoRawArr(mark); insertSpaceIntoRawArr(space);
      }
      var insertSpaceMarkIntoRawArr = function(space,mark){
          insertSpaceIntoRawArr(space); insertMarkIntoRawArr(mark); 
      }

      var insertDataIntoRawArr = function (data, noBits) {
        var invData=0
        for(var i=0; i<noBits; i++){
          invData<<=1;invData|=( data &1);data>>=1;
        }
        for(var i=0; i<noBits; i++){
          var bitVal = invData & 1; invData >>= 1;
          var ms = MS[bitVal], zo = zeroOne[bitVal];
          if(ms[0] == 0) //MARK SPACE case
            insertMarkSpaceIntoRawArr(+zo[ms[0]],+zo[ms[1]]);
          else   //SPACE MARK case
            insertSpaceMarkIntoRawArr(+zo[ms[0]], +zo[ms[1]]);
        }
      }
      if(remote.header) {
        var ms = remote.header.split(" ").map(Number);
        insertMarkSpaceIntoRawArr(+ms[0],+ms[1]);
      }
      if(remote.plead) 
        insertMarkIntoRawArr(+remote.plead);

      if(remote.pre_data_bits) 
        insertDataIntoRawArr(parseInt(remote.pre_data), remote.pre_data_bits);
      
      if(remote.pre) {
        var ms = remote.pre.split(" ").map(Number);
        insertMarkSpaceIntoRawArr(+ms[0],+ms[1]);
      }
      insertDataIntoRawArr(parseInt(remote.codes[keyName]), remote.bits);
      
      if(remote.post) {
        var ms = remote.post.split(" ").map(Number);
        insertMarkSpaceIntoRawArr(+ms[0],+ms[1]);
      }
      if(remote.post_data_bits) 
        insertDataIntoRawArr(parseInt(remote.post_data), remote.post_data_bits);
      
      if(remote.ptrail) 
        insertMarkIntoRawArr(+remote.ptrail);

      if(remote.foot) {
        var ms = remote.foot.split(" ").map(Number);
        insertMarkSpaceIntoRawArr(+ms[0],+ms[1]);
      }
      pendingMark && rawArr.push(pendingMark) && (pendingMark=0);
      pendingSpace && rawArr.push(pendingSpace) && (pendingSpace=0);
      return rawArr;

    }
  }, {
    key: 'parse',
    value: function parse(config) {
      return new LircdConf(config).parse();
    }
  }]);

  return LircdConf;
}();

exports.default = LircdConf;