#import <Foundation/Foundation.h>
#import "IrohSpikeImpl.h"
#import <ReactCommon/CxxTurboModuleUtils.h>

@interface IrohSpikeOnLoad : NSObject
@end

@implementation IrohSpikeOnLoad

using namespace facebook::react;

+ (void)load
{
  registerCxxModuleToGlobalModuleMap(
    std::string(IrohSpikeImpl::kModuleName),
    [](std::shared_ptr<CallInvoker> jsInvoker) {
      return std::make_shared<IrohSpikeImpl>(jsInvoker);
    }
  );
}

@end
