#include "IrohFfiImpl.h"

namespace facebook::react {

IrohFfiImpl::IrohFfiImpl(
  std::shared_ptr<CallInvoker> jsInvoker
)
  : NativeIrohFfiCxxSpec(std::move(jsInvoker)) {}

bool IrohFfiImpl::installRustCrate(jsi::Runtime& rt) {
  return irohffi::installRustCrate(rt, jsInvoker_) != 0;
}

bool IrohFfiImpl::cleanupRustCrate(jsi::Runtime& rt) {
  return irohffi::cleanupRustCrate(rt) != 0;
}

}
