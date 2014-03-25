__keenIoProjectId = "532083b4d97b850480000010";
__keenIoWriteKey = "d93306d716790262faca8ab79368e3a83b4c0d7fcda82a36d802e2565aacb1dc9dfa72803461ec1dbee3f7b2cb1a2bf1bc8e69ed019096e3bc2f38675bcbfdd055575e708f846d9bea619e462e9b38b959ea2d35caf204436a933cf6da9b25df5df5b3f0771ebcc882b83d9ef7450dec";
var keenLogger = require("keen.io");
var keenLogger = keenLogger.configure({
    projectId: __keenIoProjectId,
    writeKey: __keenIoWriteKey,
});

module.exports = keenLogger;