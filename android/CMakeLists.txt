cmake_minimum_required(VERSION 3.4.1)
project(IrohSpike)

set (CMAKE_VERBOSE_MAKEFILE ON)

add_library(
    react-native-iroh-spike    STATIC
    ../cpp/IrohSpikeImpl.cpp
)

set_target_properties(
    react-native-iroh-spike PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
)

target_include_directories(
    react-native-iroh-spike    PUBLIC
    ../cpp
)

target_link_libraries(
    react-native-iroh-spike    jsi
    reactnative
    react_codegen_IrohSpikeSpec
)
