#include "IrohSpikeImpl.h"

namespace facebook::react {

IrohSpikeImpl::IrohSpikeImpl(
  std::shared_ptr<CallInvoker> jsInvoker
)
  : NativeIrohSpikeCxxSpec(std::move(jsInvoker)) {}

double IrohSpikeImpl::multiply(
  jsi::Runtime& rt,
  double a,
  double b
) {
  return a * b;
}

}
