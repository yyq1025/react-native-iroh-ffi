#pragma once

#include <IrohSpikeSpecJSI.h>

#include <memory>

namespace facebook::react {

class IrohSpikeImpl
  : public NativeIrohSpikeCxxSpec<IrohSpikeImpl> {
public:
  IrohSpikeImpl(std::shared_ptr<CallInvoker> jsInvoker);

  double multiply(jsi::Runtime& rt, double a, double b);
};

}
