/**
 * @type {import('@react-native-community/cli-types').UserDependencyConfig}
 */
module.exports = {
  dependency: {
    platforms: {
      // No cxxModule registration: the uniffi-bindgen-react-native glue builds
      // its own libiroh-ffi.so via the library's build.gradle
      // (externalNativeBuild) and loads it from Kotlin with System.loadLibrary.
      // Registering android/CMakeLists.txt as a cxxModule would make the app
      // try to merge it into libappmodules.so and link a target that doesn't
      // exist. cmakeListsPath stays: it points autolinking at the codegen JNI
      // shipped with the package (includesGeneratedCode: true).
      android: {
        cmakeListsPath: 'generated/jni/CMakeLists.txt',
      },
    },
  },
};
