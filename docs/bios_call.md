---
id: bios_call
title: Bios Call
---

# BIOS-calls
## Overview
hhuOS provides the possibility to invoke BIOS-calls since they are used to determine the amount of usable physical memory and to set up VESA graphic modes. Due to the fact that hhuOS runs in protected mode using Paging as a memory abstraction, some work is included to switch into realmode for a BIOS-call.
Everything that has to do with BIOS-calls is encapsulated in one static class called `BIOS` and some assembler code contained in `interrupt.asm`. Additionally, a seperate segment is set up in the GDT for address `0x24000`. This is the segment that is used during the BIOS-call.

## Initializing for BIOS-calls
The initialization of the BIOS-call segment at `0x24000` is somewhat tricky: 
The whole code that is used to invoke the BIOS-call is written manually into this segment. This is done by `BIOS::init()`. Later, the code jumps into this segment to execute the code.
## Detailed description of a BIOS-call
Invoking a BIOS-call starts a complex mechanism in hhuOS, since paging and the protected mode have to be disabled.
Here we describe the different steps that are done to invoke a BIOS-call:

1. Write the parameters for the BIOS-call to `0x26000`, right behind the 16-bit code. This can be done with paging enabled, because the BIOS-call segment at `0x24000` is simply mapped to `0xC0024000`.
2. Call `BIOS::Int(number)` with the number of the BIOS-call to invoke. Up to this step the application requesting the BIOS-call is responsible for everything. After calling `Int()`, control is handed to the BIOS-call class in hhuOS and the following steps are done by the system.
3. The BIOS-call number is wirtten at the right place into the BIOS-call segment manually. This might be _quick and dirty_, but it works.
4. All interrupts are disabled, so that the BIOS-call can be executed completely.
5. `bios_call` - implemented in `interrupt.asm` - is invoked.
6. First thing the assembler code does is loading the IDT for 16-bit code. Afterwards, the important registers are saved on the current stack.
7. Since we must disable paging in a later step, we have to make sure to be able to get the physical address of the stack. To ensure this, the code switches to the initial kernel stack that is used to set up the system. This stack is placed between `0xC0100000` and `0xC0400000` and the physical address can be calculated by subtracting `0xC0000000` (see following step). If the system is currently setting up, no stack switch is needed since the initial kernel stack is already in use. If the scheduling system is active, every thread uses its own stack and the old inital kernel stack is reused as a stack for BIOS-calls. 
8. The address of the active Pagedirectory (CR3-register) is pushed onto the stack and a special Pagedirectory, only for BIOS-calls, is loaded. This directory maps the virtual addresses `0xC0000000 - 0xC0400000` to the physical addresses `0x0 - 0x400000`. The advantage is that we are now able to calculate all relevant phyiscal addresses by subtracting `0xC0000000` from the virtual addresses. 
9. The code jumps to the next instruction, but subtracts `0xC0000000` from the instrcution address. Since the Kernel code is placed between `0xC0100000` and `0xC0400000` and the special Pagedirectory is loaded, subtracting `0xC0000000` from the next instruction-address results in using the physical addresses for instructions now.
10. The EIP now uses phyiscal addresses, so the paging can be disabled and a special GDT, in which the BIOS-call segment is defined, is loaded by its physical address. Additionally, some registers are set to the physical address values since paging is disabled.
11. Via `call 0x18:0` the system jumps to the special code segment that is placed at `0x240000` and prepared in `BIOS::init()`. Now the BIOS-call is executed.
12. After returning from the BIOS-call, the old state is restored in reversed order: So at first Paging with the BIOS-call Pagedirectory is enabled, the code jumps to the high addresses of Kernel code, the old stack is restored and the old Pagedirectory is loaded again.
13. The code returns to `BIOS::Int`. The return-value of the BIOS-call is available at `0xC9F000`.