#include "IrohSpikeImpl.h"

namespace facebook::react {

IrohSpikeImpl::IrohSpikeImpl(
  std::shared_ptr<CallInvoker> jsInvoker
)
  : NativeIrohSpikeCxxSpec(std::move(jsInvoker)) {}

bool IrohSpikeImpl::installRustCrate(jsi::Runtime& rt) {
  return irohspike::installRustCrate(rt, jsInvoker_) != 0;
}

bool IrohSpikeImpl::cleanupRustCrate(jsi::Runtime& rt) {
  return irohspike::cleanupRustCrate(rt) != 0;
}

}
