---
id: paging_mm
title: General Overview
---

# Memory and Paging

## Introduction
hhuOS makes Paging (which is available on all modern x86-CPUs) to abstract virtual memory from the physical memory installed in the system. Since hhuOS is only 32-bit compatible at the current state of development, a total virtual memory of 4GB is available for the system. In this section we will describe how the virtual memory in hhuOS is divided in different parts, which memory managers take care for the different memory sections and how the paging system is integrated into the operating system.

## The Virtual Memory Layout in hhuOS
The 4 GB of virtual memory are divided into a Userspace-section and a Kernelspace section at the 3 GB mark at the `0xC0000000`. In future versions of hhuOS, each process works in his own address space (which is guaranteed through paging) and is able to use the whole memory below 3 GB. In contrast, everything above 3 GB belongs to the kernel and is mapped into every process`s address space. Since the Userspace memory layout is not implemented yet, lets take a closer look at the structure of the Kernelspace-memory. The 1 GB Kernelspace-memory are divided as follows:

* `0xC0000000 - 0xC040000`: This part of the memory is mapped to `0x0 - 0x40000`, e.g. the first 4 MB in physical memory. This identity mapping is very important, because the whole Kernel-code is placed at 1 MB physically and the system´s entry point into the code is defined at `0xC0100000`. Below the Kernel Code a BIOS-call segment is placed (at physical addresses). The startup-stack for the kernel is located at the `0xC0400000` mark and grows downwards towards the Kernel-code.
* `0xC0400000 - 0xDF400000`: Around 500 MB a reserved for the Kernel-heap. This heap is used in Kernel-mode and managed by a list-based `HeapMemoryManager`. It is important to note, that this heap is only used by the Kernel and is mapped into every address space that is created. The Userspace-heap gets its own `HeapMemoryManager` for each address space. Only the first 4 MB of this heap are mapped to `0x40000 - 0x80000` in physical memory to bootstrap the whole system (for more information about this please refer the corresponding section in this documentation).
* `0xDF400000 - 0xEEE00000`: This part of memory is called _Paging Area_. It is supposed to hold the Pagetables and Pagedirectories used by the CPU to abstract virtual memory. Since each table or directroy has a size of 4 KB, the whole Paging Area is divided into 4 KB frames and controlled y a simple bitmap-based memory manager.
* `0xEEE00000 - 0xFFFFFFFF`: The last part of the virtual address space is called _IO Memory_. Mappings for hardware-buffers (AHCI-buffers or the LFB) should be placed here. Every allocation made by the `IOMemoryManager` is 4 KB-aligned annd its size is a multiple of 4KB.

TODO: Insert Memory Layout map here

## Brief Description of the different memory areas and their memory managers
All implementations of memory managers in `hhuOS` derive form one single class called `MemoryManager`. Simple as it is, it contains only the start- and end-address of the correspondong memory area and the status of the memory manager. With all implementations of memory managers deriving from this interface it is possible to inialize several instances of the same memory manager for different areas of memroy. One might ask why the usual methods `alloc` and `free` are not placed here as virtual functions to get a cleaner structure of derivation. But since the different memory managers have different requirements on parameters and return values for `alloc` and `free`, we decided against this idea.

### The Heap Memory Management
The `HeapMemoryManager` uses a simple list-based implementation to allocate and free memory blocks. Each memory block, regardless if allocated or free, has a header at the beginning of itself with the following structure:
```
struct Chunk{
	Chunk* prev;
	Chunk* next;
	bool allocated;
	uint32_t size;
};
```
One may notice that a double linked list is used to iterate over the different memory blocks. This makes it easy to merge free neighboring memory blocks with each other. Furthermore, every memory block, especially the allocated ones, have a header. There are implementations with a simple free list only, but we decided to use this solution, since the memory consumption is not that much higher and it is easier to work with.
The `init`-function of this memory manager will set up the header of the first chunk right at the beginning of the memory block, which contains all the memory to be controlled by this memory manager. Right after that, a Spinlock is allocated.
If the memory manager receives an `alloc`-call, it will lock the list of memory headers at first and then start to loop over all headers to find a free memory block that fulfills the memory request. If thre is no such memory block, the address `0` (nullpointer) will be returned. When a memory block is found, it is divided into two blocks if the size is larger than requested. At the end of the allocation the Spinlock is unlocked and the address right behind the header of the allocated memory block is returned.
The `free`-function will try to get the lock in first place and then set the `allocated`-entry in the header to `false`. Afterwards, it checks in loops if there are free neighbouring memory blocks and will merge them if possible. As a last step
the freed memory will be unmapped by the Paging-system. It is important to remember that all headers of memory blocks must never be unmapped! If you do so, it may be mapped to a completely different physical address on the next access, not containing the needed information anymore.
There is one static instance of this `HeapMemoryManager` to controll the Kernelheap located at `0xC0400000`. All further instances of this memory manager - for example to manage the different Userspace-heaps - can be allocated on the Kernelheap using `new` Kernel-mode.
The operators `new` and `delete` are defined in `SystemManagement.cc`. They check whether the system is in Kernel- or Usermode and redirect the request to the corresponding memory manager.

### The Paging Area
The Paging Area, starting at `0xDF400000` is used to store all Pagedirectories and Pagetables used by the Paging system. Each Pagedirectory or Pagetable has a size of 4 KB. Therefore memory in this area is allocated and freed only in 4 KB chunks. To get track of all allocated and free 4 KB chunks, the memory manager uses a bitmap where one bit represents one 4 KB chunk. The whole bitmap is stored as an `uint32_t`-array. Allocations can be made fast using bitwise operations like rotations.

### The IO Memory
The IO Memory Area at the top of the address space is used to map buffers for hardware devices to virtual addresses. Since hardware buffers need an alignement in most cases, allocations of IO Memory are only made at addresses an with sizes which are a multiple of 4 KB. A 4 KB alignement fulfills the requirements of most hardware devices, so this is a very simple solution to the problem of allocating aligned memory. There are two types of mappings available: The first version of `mapIO` allocates some virtual memory in the IO Area and  - according to the allocation made in virtual memory - an amount of physical pages (using the `PageFramAllocator`). Then the virtual memory is mapped to these phyiscal addresses. This version should be used if ones needs a buffer for hardware at arbitrary physical addresses, for example for AHCI-devices. Note that the physical pages allocated by the `PageFrameAllocator` are not necessarily coherent. There is a special `mapIOPhysRange` function that tries to achieve this. The second version of `mapIO` needs a given physical address where the physical memory should be mapped to. This can be used if the hardware device has its own physical memory at own addresses like the Linear Frame Buffer. Please note, that the given physical address should never be within physical address space managed by the `Page FrameAllocator`, or otherwise there will be conflicts. Indeed this is very unlikely to happen since the available physical memory restricted in a way that thre is enough space left to 4 GB for things like video memory.
The `IOMemoryManager` uses a free list to manage free memory blocks. There is one difficulty left, as there is no room left to store the size of allocated blocks: most memory managers using free lists store this information right at the beginning of the block, but this does not work here since it would break the 4 KB alignement. So the `IOMemoryManager` does not simply return one memory address, but a structure instead. This structure looks as following:
```
struct IOMemInfo{
    uint32_t virtStartAddress;  // virtual start address of allocated memory
    uint32_t pageCount;         // size of virtual area in pages
    uint32_t* physAddresses;    // Array with physical addresses for the allocated pages
};
```
This returned structure should be stored within the class that requests the IO memory, otherwise the memory block cannot be freed later. The returned `IOMemInfo` is also useful because it holds all addresses of physical pages the memory is mapped to. In many cases these physical addresses are needed by the hardware devices using the buffers, so the memory managers reutrns them directly to the requesting class.

## A closer look at the implementation of the paging system

The Paging-system in hhuOS is used to abstract different virtual address spaces from the pyhsical memory.
It consists fo several classes controlled by the so called `SystemManager`, which acts as a central instance
to manage requests for page-(un)mappings, address space switches and memory allocations. 

### The `PageFrameAllocator`
The `PageFrameAllocator` is the only instance in hhuOS that works with physical memory directly.
Its task is to keep track of mapped and non mapped page frames. The physical memory is divided
into 4 KB chunks, each of them called _page frame_. If an new page of virtual memory needs to
be mapped into phyiscal memory, the `PageFrameAllocator` uses a simple bitmap mechanism 
(the same as in the Paging area) and allocated a single 4 KB pagfe frame in physical memory.
Afterwards, the start address of this page frame is returned. 

### The `PageDirectory`
The class `PageDirectory` is the abstraction of the table called _Pagedirectory_. hhuOS uses 
a two-level approach to realize memory virtualization through paging. So fore each address
space there exists one Pagedirectory as a table with 1024 pointers (physical addresses) to PageTables.
These Pagetables contain 1024 physical addresses (one for each 4 KB page). With this approach it is possible
to create virtual address spaces with `4 KB * 1024 * 1024 = 4 GB` of virtual memory for each Pagedirectory.
A given virtual 32-bit address is translated as follows: The first 10 bits of the address are
used as an index to an entry in the Pagedirectory-table. The next 10 bits of th address are used 
as an index into the Pagetable, addressed by the entry in the directory. The entry in the Pagetable
then contains the physicals memory address of the 4 KB page the hardware should use. The remaining 12 bits
of the virtual address are the offset into the 4 KB page.
The abstracting class `PageDirectory` has three important private members that are used to realize the mapping.
The first is the virtual address of the Pagedirectory (the 4 KB table is placed in the Paging area as described above). This address is needed to manipulate or look up entries in the Pagedirectoy, since the physical address
would not be helpful here. The second is the physical address of the Pagedirectory, needed by the hardware (ore more detailled: by the MMu of the CPU) to make address translations. This is the address that should be loaded to the CR3-register of x86-CPUs. The third is a pointer to a table containing all virtual addresses of the Pagetables addressed by the Pagedirectory. This point needs a bit of explanation: The x86-CPU only uses physical addresses to locate Pagedirctories and -tables. Using virtual addresses would not work here, since the tables are used to translate the virtual addresses into physical ones. But if hhuOS wants to look up entries in the Pagetables or manipulate them, it needs the virtual address of them - therefore we store those addresses in an extra table (which is also placed in th Paging area). The class `PageDirectory` offers functions to (un)map virtual addresses into the Pagedirectory or to get the corresponding physical address for a virtual address.
Note that there exists two constructors for this class: The first constructor does not take an argument and is only called once to initialize the Paging-system. It creates the `basePageDirectories` containing the Kernelspace-mappings. The second constructor is used to create the Pagedirectories for the several address spaces. It takes the `basePageDirectory` as an argument since the Kernelspace-mappings are used in every address space.

### What about the `basePageDirectory`?
The `basePageDirector` contains all mappings for the whole Kernelspace (everything above 3 GB). The Kernelspace is mapped into every address space. These mappings are identical for all address spaces, because we want the Kernel-data to be placed at the same addresses in every address space. This is realized by a simple construction: The last 256 entries of each Pagedirectory (addressing everything above 3 GB) created by the system point to 256 Pagetables right at the beginning of the Paging area. These 256 Pagetables map the Kernelspace and are created by the `basePageDirectory`. When a new Pagedirectory is created, these 256 addresses of Pagetables are copied from the `basePageDirectory` into the new directory so that the Kernel of hhuOS is mapped from the first step on.

### Virtual Address Spaces
A virtual address space is the next abstraction one level above the `PageDirectory`. Each address space contains one Pagedirectory, since it abstracts the virtual memory from the _real_ physical memory. But additionally each address space has two `HeapMemoryManager`: One of those is the Kernelspace-heap memory manager, which exists once for the whole system (and all address spaces). The other one is individual for each address space and responsible for the Userspace-heap (which differs from address space to address space).

### The `SystemManager`