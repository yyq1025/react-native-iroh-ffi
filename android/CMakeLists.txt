cmake_minimum_required(VERSION 3.4.1)
project(IrohFfi)

set (CMAKE_VERBOSE_MAKEFILE ON)

add_library(
    react-native-iroh-ffi    STATIC
    ../cpp/IrohFfiImpl.cpp
)

set_target_properties(
    react-native-iroh-ffi PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
)

target_include_directories(
    react-native-iroh-ffi    PUBLIC
    ../cpp
)

target_link_libraries(
    react-native-iroh-ffi    jsi
    reactnative
    react_codegen_IrohFfiSpec
)
