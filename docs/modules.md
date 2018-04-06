---
id: modules
title: Modules
---

It is possible to extend _hhuOS_ with modules (written in C++) in a few simple steps. Each module is located in a folder that corresponds to its name. The base folder is located at `src/modules`. To implement and load a new module, which mounts a new virtual node and prints `Hello hhuOS` on reading it, the following steps can be followed.

## Preparations

Since all modules need to be placed inside a folder corresponding to its names, a new folder has to be created. The name of the module will be `greeter`, so we execute the following commands within `src/modules`.

```sh
mkdir greeter
cd greeter
```

Inisde our new folder, we create two new files.

```sh
touch Greeter.cc Greeter.h GreeterNode.cc GreeterNode.h
```

## Implementing the module

Because a new type of `VirtualNode` is needed, we first implement the `GreeterNode` class. First we define the header file (`GreeterNode.h`) as follows.

```c++
#ifndef __GreeterNode_include__
#define __GreeterNode_include__

#include "kernel/filesystem/RamFs/VirtualNode.h"
#include <cstdint>

class GreeterNode : public VirtualNode {

public:

    GreeterNode() : VirtualNode("greeter", FsNode::REGULAR_FILE) {};

    ~GreeterNode() {}

    uint64_t getLength();

    char *readData(char *buf, uint64_t pos, uint32_t numBytes);

    int32_t writeData(char *buf, uint64_t pos, uint32_t numBytes);
};

#endif
```

The actual implementation of the class is relatively simple. Besides checking the length, the buffer is simply copied over.

```c++
#include "GreeterNode.h"

uint64_t GreeterNode::getLength() {
    return 12;
}

uint64_t GreeterNode::readData(char *buf, uint64_t pos, uint64_t numBytes) {

    uint64_t length = getLength();

    if (pos + numBytes > length) {
        numBytes = (uint32_t) (length - pos);
    }

    char* greeting = "Hello hhuOS";

    memcpy(buf, greeting + pos, numBytes);

    return numBytes;
}

uint64_t GreeterNode::writeData(char *buf, uint64_t pos, uint64_t numBytes) {
    return 0;
}
```

In the next step, we implement the module itself. All modules must inherit from the base class `Module`, which specifies some functions that need to be overriden. Therefore we define a new class `Greeter`, which inherits from `Module`. 

```c++
#ifndef __Greeter_include__
#define __Greeter_include__

#include "kernel/Module.h"

class Greeter : public Module {

public:

    Random() = default;

    int32_t initialize() override;

    int32_t finalize() override;

    String getName() override;

    Util::Array<String> getDependencies() override;
};

#endif
```

The implementation is again relatively simple. As a first step, we implement `initialize`.

```c++
#include "Greeter.h"
#include "GreeterNode.h"
#include "kernel/Kernel.h"
#include "kernel/services/FileSystem.h"

int32_t Greeter::initialize() {

    FileSystem *fileSystem = Kernel::getService<FileSystem>();

    fileSystem->addVirtualNode("/dev", new GreeterNode());

    return 0;
}

...
```

Using `Kernel::getService` we query the `FileSystem` service and then mount our custom `GreeterNode` using the `FileSystem`'s `addVirtualNode` function. Finally, we return `0` to indicate that all operations have been performed successfully. Since removing `VirtualNode`s is not supported yet, `finalize` just returns `0`.

```c++
...

int32_t Greeter::finalize() {

    return 0;
}

...
```

The operating system identifies all modules using their unique names. Therefore each module must provide its name through `getName`.

```c++
...

String Greeter::geName() {

    return "greeter";
}

...
```

Additionally each module can specify its dependencies within `getDependencies`. Since hhuOS does not currently support linking modules against each other at runtime, this function can be used to implement such a feature. In our case we just return an empty list.

```c++
...

Util::Array<String> Greeter::getDependencies() {

    return Util::Array<String>(0);
}

...
```

The last step includes providing an instance of the module to the operating system. The macro `MODULE_PROVIDER` can be used for this task.

```c++
...

MODULE_PROVIDER {

    return new Greeter();
};
```

After all steps have been completed, we change to the main directory and execute the following command.

```sh
make modules
```

This task will compile all modules located under `src/modules` and put them inside `src/initrd/mod`. Loading the initial ramdisk is not currently supported. Therefore we copy the module (`greeter.ko`) and put it inside `src/hdd/mod`. All files within `src/hdd` will be accessible through the filesystem.

## Loading the module

Within the operating systems shell we can issue the following commands to load our new module.

```sh
insmod /mod/greeter.ko
```

Alternatively, we can also load modules programmatically using the `ModuleLoader` service.

```c++
...

File *module = File::open("/mod/greeter.ko", "r+");

ModuleLoader *loader = Kernel::getService<ModuleLoader>();

loader->load(module);

...
```

Note however that this is only possible after the filesystem has been initialized.









