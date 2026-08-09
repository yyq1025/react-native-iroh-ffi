#pragma once

#include <IrohFfiSpecJSI.h>

#include <memory>

#include "iroh-ffi.h"

namespace facebook::react {

class IrohFfiImpl
  : public NativeIrohFfiCxxSpec<IrohFfiImpl> {
public:
  IrohFfiImpl(std::shared_ptr<CallInvoker> jsInvoker);

  bool installRustCrate(jsi::Runtime& rt);
  bool cleanupRustCrate(jsi::Runtime& rt);
};

}
