#import <Foundation/Foundation.h>
#import "IrohFfiImpl.h"
#import <ReactCommon/CxxTurboModuleUtils.h>

@interface IrohFfiOnLoad : NSObject
@end

@implementation IrohFfiOnLoad

using namespace facebook::react;

+ (void)load
{
  registerCxxModuleToGlobalModuleMap(
    std::string(IrohFfiImpl::kModuleName),
    [](std::shared_ptr<CallInvoker> jsInvoker) {
      return std::make_shared<IrohFfiImpl>(jsInvoker);
    }
  );
}

@end
