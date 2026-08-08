#pragma once

#include <IrohSpikeSpecJSI.h>

#include <memory>

#include "iroh-spike.h"

namespace facebook::react {

class IrohSpikeImpl
  : public NativeIrohSpikeCxxSpec<IrohSpikeImpl> {
public:
  IrohSpikeImpl(std::shared_ptr<CallInvoker> jsInvoker);

  bool installRustCrate(jsi::Runtime& rt);
  bool cleanupRustCrate(jsi::Runtime& rt);
};

}
