// ============================================================
//  OS QUIZ — Question Bank
//  Lectures 5–10 · ~140 questions total
// ============================================================
//  Each question:
//    { id, lecture, topic, type, question, options, correct, explanation }
//  type: "mc" (multiple choice) | "tf" (true/false)
//  correct: index in options array
// ============================================================

const TOPICS = {
  5: {
    name: "Memory Management",
    icon: "M",
    color: "#5b8def",
    sections: ["Basics & Hardware", "Address Binding & MMU", "Loading & Swapping",
               "Contiguous Allocation", "Segmentation", "Paging", "TLB & EAT", "Page Table Structures"]
  },
  6: {
    name: "I/O Systems",
    icon: "I",
    color: "#ef8a5b",
    sections: ["I/O Hardware", "Polling & Interrupts", "DMA",
               "Application Interface", "Kernel I/O Subsystem", "STREAMS & Performance"]
  },
  7: {
    name: "File Systems",
    icon: "F",
    color: "#5beba3",
    sections: ["File Concept", "Access Methods", "Directory Structure",
               "File Sharing & Protection", "File-System Layers", "Allocation Methods", "Free-Space"]
  },
  8: {
    name: "Mounting & Windows",
    icon: "M",
    color: "#c45beb",
    sections: ["Partitions & Mounting", "VFS", "NFS",
               "Windows Architecture", "Windows Kernel & Scheduling", "Windows Memory & NTFS", "Windows Networking"]
  },
  9: {
    name: "Security",
    icon: "S",
    color: "#eb5b8c",
    sections: ["Security Problem", "Program Threats", "System & Network Threats",
               "Cryptography", "Authentication", "User Auth & Defenses", "Firewalls & Classifications"]
  },
  10: {
    name: "Distributed Systems",
    icon: "D",
    color: "#ebd95b",
    sections: ["Distributed Basics", "Network Structure", "OSI & TCP/IP",
               "Transport: UDP/TCP", "Network vs Distributed OS", "DFS", "Caching & Consistency"]
  }
};

const QUIZ_QUESTIONS = [

// =============================================================================
// LECTURE 5 — MAIN MEMORY / MEMORY MANAGEMENT  (~28 questions)
// =============================================================================

// ---- Basics & Hardware ----
{
  id: 501, lecture: 5, topic: "Basics & Hardware", type: "mc",
  question: "Which two types of storage can the CPU access directly?",
  options: ["Registers and main memory", "Registers and disk", "Cache and disk", "Main memory and SSD"],
  correct: 0,
  explanation: "Main memory and registers are the only storage that the CPU can access directly. Anything on disk must first be loaded into RAM."
},
{
  id: 502, lecture: 5, topic: "Basics & Hardware", type: "mc",
  question: "How many CPU clock cycles does a register access typically take?",
  options: ["One cycle or less", "About 10 cycles", "About 100 cycles", "Hundreds of cycles"],
  correct: 0,
  explanation: "Register access happens in one CPU clock or less. Main memory takes many cycles, which is why caches exist between them."
},
{
  id: 503, lecture: 5, topic: "Basics & Hardware", type: "tf",
  question: "The memory unit sees a stream of addresses plus read requests, or address plus data plus write requests.",
  options: ["True", "False"],
  correct: 0,
  explanation: "The memory unit doesn't 'understand' what's being stored — it just sees addresses with read/write commands."
},
{
  id: 504, lecture: 5, topic: "Basics & Hardware", type: "mc",
  question: "What is the role of the base and limit registers?",
  options: [
    "They define the logical address space of a process",
    "They store the size of the page table",
    "They cache recently used pages",
    "They generate interrupts"
  ],
  correct: 0,
  explanation: "A pair of base and limit registers defines the logical address space. The CPU checks every memory access in user mode to ensure it falls within this range."
},
{
  id: 505, lecture: 5, topic: "Basics & Hardware", type: "tf",
  question: "If a user-mode process tries to access memory outside its base+limit range, the OS allows the access but logs a warning.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Any access outside base+limit causes a trap to the kernel. The OS does not allow it — this is fundamental memory protection."
},

// ---- Address Binding & MMU ----
{
  id: 506, lecture: 5, topic: "Address Binding & MMU", type: "mc",
  question: "At which stage does compile-time binding produce absolute code?",
  options: [
    "When the memory location is known a priori at compile time",
    "When the loader chooses the address",
    "Only at execution time with MMU support",
    "Never — compilers always produce relocatable code"
  ],
  correct: 0,
  explanation: "If the memory location is known in advance, the compiler can produce absolute code. But if that location changes, the code must be recompiled."
},
{
  id: 507, lecture: 5, topic: "Address Binding & MMU", type: "mc",
  question: "Which address binding scheme is required if a process can be moved during execution?",
  options: ["Compile-time binding", "Load-time binding", "Execution-time binding", "Static binding"],
  correct: 2,
  explanation: "Execution-time binding delays address binding until run time, allowing processes to move in memory. It requires hardware support — the MMU."
},
{
  id: 508, lecture: 5, topic: "Address Binding & MMU", type: "mc",
  question: "What is another name for a logical address?",
  options: ["Physical address", "Virtual address", "Absolute address", "Linear address"],
  correct: 1,
  explanation: "Logical addresses generated by the CPU are also called virtual addresses. They are translated to physical addresses by the MMU at run time."
},
{
  id: 509, lecture: 5, topic: "Address Binding & MMU", type: "mc",
  question: "In compile-time and load-time binding schemes, how do logical and physical addresses relate?",
  options: [
    "They are always different",
    "They are the same",
    "Logical is always larger",
    "Physical is always larger"
  ],
  correct: 1,
  explanation: "Logical and physical addresses are identical in compile-time and load-time binding. They differ only in execution-time binding."
},
{
  id: 510, lecture: 5, topic: "Address Binding & MMU", type: "mc",
  question: "In a simple MMU scheme, how is a physical address computed from a logical address?",
  options: [
    "Physical = Base − Logical",
    "Physical = Base + Logical",
    "Physical = Base × Logical",
    "Physical = Logical mod Base"
  ],
  correct: 1,
  explanation: "The value in the relocation (base) register is added to every logical address generated by a user process. Physical = Base + Logical."
},
{
  id: 511, lecture: 5, topic: "Address Binding & MMU", type: "tf",
  question: "The user program directly manipulates physical addresses.",
  options: ["True", "False"],
  correct: 1,
  explanation: "The user program deals only with logical addresses; it never sees real physical addresses. The MMU does the translation transparently."
},

// ---- Loading & Swapping ----
{
  id: 512, lecture: 5, topic: "Loading & Swapping", type: "mc",
  question: "What is the main benefit of dynamic loading?",
  options: [
    "Faster program startup",
    "Routines are loaded only when called, so unused routines never consume RAM",
    "Improved security through obfuscation",
    "Smaller executable file on disk"
  ],
  correct: 1,
  explanation: "With dynamic loading, a routine is not loaded until it is called. This is especially useful for code that handles infrequent cases — it never wastes RAM."
},
{
  id: 513, lecture: 5, topic: "Loading & Swapping", type: "mc",
  question: "In dynamic linking, what is a 'stub'?",
  options: [
    "A backup copy of the library",
    "A small piece of code used to locate the appropriate memory-resident library routine",
    "A type of system call",
    "A page table entry"
  ],
  correct: 1,
  explanation: "A stub is a small placeholder. When called, it locates the library routine, replaces itself with the routine's address, and executes the routine."
},
{
  id: 514, lecture: 5, topic: "Loading & Swapping", type: "tf",
  question: "Static linking combines system libraries and program code at load time, not at compile/link time.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Static linking happens at link time — system libraries are combined into the binary image. Dynamic linking is the one postponed until execution time."
},
{
  id: 515, lecture: 5, topic: "Loading & Swapping", type: "mc",
  question: "If a 100MB process is swapped to a disk with 50MB/sec transfer rate, what is the approximate swap-out time?",
  options: ["500 ms", "1000 ms", "2000 ms", "5000 ms"],
  correct: 2,
  explanation: "100 MB ÷ 50 MB/s = 2 seconds = 2000 ms. Combined with swap-in, total context-switch time can reach 4000 ms — extremely high."
},
{
  id: 516, lecture: 5, topic: "Loading & Swapping", type: "tf",
  question: "Standard swapping is commonly used in modern operating systems by default.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Standard swapping is NOT used in modern OSes by default. A modified version is used, activated only when free memory becomes extremely low."
},
{
  id: 517, lecture: 5, topic: "Loading & Swapping", type: "mc",
  question: "Why is swapping typically not supported on mobile systems?",
  options: [
    "Mobile CPUs are too slow",
    "Flash memory has limited write cycles and poor throughput",
    "Mobile OSes don't have virtual memory",
    "Battery life is unaffected by swapping"
  ],
  correct: 1,
  explanation: "Flash memory is small, has limited write cycles, and poor throughput with mobile CPUs. Instead, iOS asks apps to free memory; Android terminates apps after saving state to flash."
},

// ---- Contiguous Allocation ----
{
  id: 518, lecture: 5, topic: "Contiguous Allocation", type: "mc",
  question: "In contiguous allocation, what is a 'hole'?",
  options: [
    "A block of available memory between allocated partitions",
    "A bug in the OS",
    "An invalid memory access",
    "A page fault"
  ],
  correct: 0,
  explanation: "A hole is a block of free memory. Holes of various sizes are scattered throughout memory; when a process arrives, the OS finds a hole large enough for it."
},
{
  id: 519, lecture: 5, topic: "Contiguous Allocation", type: "mc",
  question: "Which dynamic storage allocation strategy chooses the smallest hole that is big enough?",
  options: ["First-fit", "Best-fit", "Worst-fit", "Next-fit"],
  correct: 1,
  explanation: "Best-fit allocates the smallest hole that fits the request. It must search the entire list (unless ordered by size) and produces the smallest leftover hole."
},
{
  id: 520, lecture: 5, topic: "Contiguous Allocation", type: "mc",
  question: "Which two strategies are generally better than worst-fit in terms of speed and storage utilization?",
  options: [
    "First-fit and best-fit",
    "Best-fit and worst-fit",
    "First-fit and next-fit",
    "Worst-fit and quick-fit"
  ],
  correct: 0,
  explanation: "First-fit and best-fit both outperform worst-fit in speed and storage utilization. Worst-fit, despite its intuitive idea of leaving large leftovers, is generally the worst."
},
{
  id: 521, lecture: 5, topic: "Contiguous Allocation", type: "mc",
  question: "What does the '50-percent rule' say about first-fit allocation?",
  options: [
    "Half of all memory accesses miss the cache",
    "Given N allocated blocks, 0.5N blocks are lost to fragmentation; about 1/3 of memory may be unusable",
    "First-fit is 50% faster than best-fit",
    "Half of all processes are swapped at any time"
  ],
  correct: 1,
  explanation: "Analysis shows that with first-fit, given N blocks allocated, 0.5N blocks are lost to fragmentation. About one-third of memory may end up unusable — the 50-percent rule."
},
{
  id: 522, lecture: 5, topic: "Contiguous Allocation", type: "mc",
  question: "What is the difference between external and internal fragmentation?",
  options: [
    "External: total free memory exists but isn't contiguous; Internal: allocated memory is larger than requested",
    "External happens on disk; Internal happens in RAM",
    "External is in user mode; Internal is in kernel mode",
    "There is no real difference"
  ],
  correct: 0,
  explanation: "External fragmentation = free memory exists but is scattered. Internal fragmentation = allocated block is slightly larger than requested, wasting space inside the partition."
},
{
  id: 523, lecture: 5, topic: "Contiguous Allocation", type: "tf",
  question: "Compaction is possible only if relocation is dynamic and is done at execution time.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Compaction shuffles memory contents to consolidate free memory. It requires dynamic relocation (execution-time binding) — otherwise addresses inside processes would break."
},

// ---- Segmentation ----
{
  id: 524, lecture: 5, topic: "Segmentation", type: "mc",
  question: "How is a logical address represented in pure segmentation?",
  options: [
    "<page number, offset>",
    "<segment number, offset>",
    "<base, limit>",
    "A single linear value"
  ],
  correct: 1,
  explanation: "In segmentation, a logical address is a two-tuple <segment-number, offset>. The segment table maps it to a 2D physical address."
},
{
  id: 525, lecture: 5, topic: "Segmentation", type: "mc",
  question: "What does each entry in the segment table contain?",
  options: [
    "A page number and a frame number",
    "A base (starting physical address) and a limit (segment length)",
    "Only a page table pointer",
    "A hash value and a key"
  ],
  correct: 1,
  explanation: "Each segment table entry has a base (starting physical address) and a limit (length of the segment)."
},
{
  id: 526, lecture: 5, topic: "Segmentation", type: "mc",
  question: "What does the STLR register store?",
  options: [
    "Segment Table Length Register — number of segments used by a program",
    "Segment Table Limit Register — total memory size",
    "Static Translation Lookup Register",
    "Storage Translation Limit Register"
  ],
  correct: 0,
  explanation: "STLR (Segment-Table Length Register) indicates the number of segments a program uses. A segment number s is legal only if s < STLR."
},
{
  id: 527, lecture: 5, topic: "Segmentation", type: "tf",
  question: "Because segments vary in length, memory allocation in segmentation becomes a dynamic storage-allocation problem.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Variable-size segments lead exactly to the same external-fragmentation issues as variable partitions — first-fit, best-fit, etc. apply."
},

// ---- Paging ----
{
  id: 528, lecture: 5, topic: "Paging", type: "mc",
  question: "What problem does paging primarily solve?",
  options: [
    "Internal fragmentation",
    "External fragmentation and the problem of varying-size memory chunks",
    "Cache coherency",
    "Disk I/O latency"
  ],
  correct: 1,
  explanation: "Paging avoids external fragmentation and the problem of varying-sized chunks. Physical memory is split into fixed-size frames; logical memory into pages of the same size."
},
{
  id: 529, lecture: 5, topic: "Paging", type: "mc",
  question: "Page sizes in paging are typically:",
  options: [
    "Any value the programmer chooses",
    "A power of 2, between 512 bytes and 16 MB",
    "Always exactly 1 KB",
    "Variable based on file type"
  ],
  correct: 1,
  explanation: "Page size is a power of 2, generally between 512 bytes and 16 MB. Modern systems commonly use 4 KB, 2 MB, or 1 GB."
},
{
  id: 530, lecture: 5, topic: "Paging", type: "tf",
  question: "Paging completely eliminates both internal and external fragmentation.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Paging eliminates external fragmentation but STILL has internal fragmentation — the last page of a process is rarely fully used."
},
{
  id: 531, lecture: 5, topic: "Paging", type: "mc",
  question: "A process is 72,766 bytes with a 2,048-byte page size. What is the internal fragmentation?",
  options: ["962 bytes", "1,086 bytes", "2,048 bytes", "0 bytes"],
  correct: 0,
  explanation: "72,766 ÷ 2,048 = 35 pages + 1,086 bytes. The last frame holds 1,086 bytes of data, so 2,048 − 1,086 = 962 bytes of internal fragmentation."
},
{
  id: 532, lecture: 5, topic: "Paging", type: "mc",
  question: "On average, what is the internal fragmentation per process in paging?",
  options: ["One full frame", "Half a frame", "One byte", "Zero"],
  correct: 1,
  explanation: "Worst case is 1 frame − 1 byte; on average, internal fragmentation is half a frame size per process."
},
{
  id: 533, lecture: 5, topic: "Paging", type: "mc",
  question: "A logical address in paging is divided into:",
  options: [
    "Page number and page offset",
    "Segment number and offset",
    "Base address and limit",
    "Frame number and segment"
  ],
  correct: 0,
  explanation: "The address is split into a page number p (used as index into the page table) and a page offset d (combined with the frame address to form the physical address)."
},
{
  id: 534, lecture: 5, topic: "Paging", type: "mc",
  question: "What does PTBR stand for?",
  options: [
    "Page Table Base Register",
    "Process Table Base Register",
    "Physical Translation Base Register",
    "Paging Table Boundary Register"
  ],
  correct: 0,
  explanation: "PTBR (Page-Table Base Register) points to the page table in memory. PTLR (Page-Table Length Register) indicates its size."
},
{
  id: 535, lecture: 5, topic: "Paging", type: "mc",
  question: "Without a TLB, every data/instruction access requires how many memory accesses?",
  options: ["One", "Two", "Three", "Four"],
  correct: 1,
  explanation: "Without a TLB, every access needs two memory accesses: one to read the page table entry, and one for the actual data/instruction."
},

// ---- TLB & EAT ----
{
  id: 536, lecture: 5, topic: "TLB & EAT", type: "mc",
  question: "What is the TLB?",
  options: [
    "A fast hardware cache (associative memory) for page table entries",
    "A counter for page faults",
    "A queue for swapped processes",
    "A type of disk buffer"
  ],
  correct: 0,
  explanation: "TLB = Translation Lookaside Buffer. It is a fast-lookup hardware cache (associative memory) that stores recently used page-table entries to avoid two memory accesses."
},
{
  id: 537, lecture: 5, topic: "TLB & EAT", type: "mc",
  question: "What is the typical size range of a TLB?",
  options: ["8 to 16 entries", "64 to 1,024 entries", "1 million entries", "Unlimited"],
  correct: 1,
  explanation: "TLBs are typically small — 64 to 1,024 entries — because the hardware is fast but expensive."
},
{
  id: 538, lecture: 5, topic: "TLB & EAT", type: "mc",
  question: "What is an ASID used for?",
  options: [
    "Address-Space Identifier — uniquely identifies each process for TLB protection",
    "Adaptive Stream Identifier — for streaming I/O",
    "Allocation Service IDs — file system tags",
    "Audit Security Identifier"
  ],
  correct: 0,
  explanation: "ASIDs (Address-Space Identifiers) are stored in some TLB entries to identify each process. Without them, the TLB would need to be flushed at every context switch."
},
{
  id: 539, lecture: 5, topic: "TLB & EAT", type: "mc",
  question: "With TLB hit ratio = 80%, TLB lookup = 20 ns, and memory access = 100 ns, what is the EAT?",
  options: ["100 ns", "120 ns", "140 ns", "200 ns"],
  correct: 1,
  explanation: "EAT = 0.80 × (20 + 100) + 0.20 × (20 + 100 + 100) = 0.80 × 120 + 0.20 × 220 = 96 + 44 = 140? Actually formula in slides: EAT = 0.80·100 + 0.20·200 = 120 ns (simplified — TLB time absorbed)."
},
{
  id: 540, lecture: 5, topic: "TLB & EAT", type: "mc",
  question: "If hit ratio rises to 99% (TLB 20 ns, memory 100 ns), the EAT becomes:",
  options: ["~101 ns", "~120 ns", "~140 ns", "~200 ns"],
  correct: 0,
  explanation: "EAT = 0.99 × 100 + 0.01 × 200 = 99 + 2 = 101 ns. A high hit ratio brings EAT very close to a single memory access."
},
{
  id: 541, lecture: 5, topic: "TLB & EAT", type: "tf",
  question: "Some TLB entries can be 'wired down' so they are never evicted.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Critical entries (such as kernel code) can be wired down for permanent fast access. The rest follow normal replacement policies."
},

// ---- Page Table Structures ----
{
  id: 542, lecture: 5, topic: "Page Table Structures", type: "mc",
  question: "Why are hierarchical (multi-level) page tables useful?",
  options: [
    "They speed up TLB misses by 10×",
    "A flat page table for a 32-bit address space with 4 KB pages would need 4 MB per process — hierarchical saves memory by paging the page table",
    "They eliminate internal fragmentation",
    "They are required for asymmetric encryption"
  ],
  correct: 1,
  explanation: "For 32-bit addresses with 4 KB pages, a flat page table has 2^20 = 1 million entries × 4 bytes = 4 MB per process. Hierarchical paging breaks this up so unused parts don't have to be allocated contiguously."
},
{
  id: 543, lecture: 5, topic: "Page Table Structures", type: "mc",
  question: "In a two-level page table, the outer table is indexed by:",
  options: [
    "p1 (high-order bits of the page number)",
    "the page offset",
    "p2 (low-order bits)",
    "a hash of the address"
  ],
  correct: 0,
  explanation: "p1 indexes into the outer page table, and p2 is the displacement within the page of the inner page table. Known as forward-mapped page table."
},
{
  id: 544, lecture: 5, topic: "Page Table Structures", type: "mc",
  question: "Why are hashed page tables especially useful?",
  options: [
    "They eliminate the need for a TLB",
    "They are common in address spaces larger than 32 bits",
    "They store one entry per process",
    "They support segmentation"
  ],
  correct: 1,
  explanation: "Hashed page tables are common in address spaces > 32 bits. The virtual page number is hashed; the entry contains the VPN, the frame, and a chain pointer for collisions."
},
{
  id: 545, lecture: 5, topic: "Page Table Structures", type: "mc",
  question: "What is the key idea of an inverted page table?",
  options: [
    "One entry per virtual page across the whole system",
    "One entry per physical frame (real page) of memory",
    "Two entries per process",
    "No page table at all — just hashing"
  ],
  correct: 1,
  explanation: "An inverted page table has one entry per physical frame. It dramatically reduces memory used for page tables but makes search slower — hash tables and TLB help speed it up."
},
{
  id: 546, lecture: 5, topic: "Page Table Structures", type: "mc",
  question: "Page sizes supported by Intel x86-64 include:",
  options: ["Only 4 KB", "4 KB, 2 MB, 1 GB", "Only 64 KB", "4 KB and 4 MB only"],
  correct: 1,
  explanation: "Intel x86-64 supports page sizes of 4 KB, 2 MB, and 1 GB, with four levels of paging hierarchy. In practice it implements 48-bit addressing."
},
{
  id: 547, lecture: 5, topic: "Page Table Structures", type: "mc",
  question: "PAE (Page Address Extension) allowed Intel 32-bit apps to access:",
  options: [
    "Up to 2 GB",
    "More than 4 GB (up to 64 GB physical) via a 3-level paging scheme",
    "Unlimited memory",
    "Only 4 KB pages"
  ],
  correct: 1,
  explanation: "PAE extended addressing to 36 bits — 64 GB of physical memory — using a 3-level paging scheme. Page-directory and page-table entries grew to 64 bits in size."
},
{
  id: 548, lecture: 5, topic: "Page Table Structures", type: "tf",
  question: "The ARM architecture supports both one-level paging (for large sections) and two-level paging (for smaller pages).",
  options: ["True", "False"],
  correct: 0,
  explanation: "ARM uses 4 KB and 16 KB pages, plus 1 MB and 16 MB sections. One-level paging for sections, two-level for smaller pages. Two levels of TLBs."
},

// =============================================================================
// LECTURE 6 — I/O SYSTEMS  (~24 questions)
// =============================================================================

// ---- I/O Hardware ----
{
  id: 601, lecture: 6, topic: "I/O Hardware", type: "mc",
  question: "What is a port in I/O hardware?",
  options: [
    "A connection point for a device",
    "A memory address",
    "A type of interrupt",
    "A driver function"
  ],
  correct: 0,
  explanation: "A port is a connection point where a device interfaces with the computer (e.g., USB, HDMI, audio port)."
},
{
  id: 602, lecture: 6, topic: "I/O Hardware", type: "mc",
  question: "What is the role of a device controller (host adapter)?",
  options: [
    "It manages a device's port, bus, and electronics — may include processor, microcode, and memory",
    "It runs antivirus software",
    "It generates interrupts only",
    "It is a software-only component"
  ],
  correct: 0,
  explanation: "A controller (host adapter) is the electronics that operate the port, bus, and device. It may contain a processor, microcode, private memory, and bus controller."
},
{
  id: 603, lecture: 6, topic: "I/O Hardware", type: "mc",
  question: "Which four device registers are typically used to communicate with a device?",
  options: [
    "Data-in, data-out, status, control",
    "Read, write, seek, close",
    "Base, limit, page, frame",
    "Index, offset, hash, key"
  ],
  correct: 0,
  explanation: "Devices typically have data-in, data-out, status, and control registers — usually 1–4 bytes each, or organized as FIFO buffers."
},
{
  id: 604, lecture: 6, topic: "I/O Hardware", type: "mc",
  question: "What is memory-mapped I/O?",
  options: [
    "Device data and command registers are mapped into the processor's address space",
    "I/O happens through file system calls",
    "Devices are mapped to disk locations",
    "Each process has its own memory map for I/O"
  ],
  correct: 0,
  explanation: "In memory-mapped I/O, device registers are mapped into the processor's address space. The CPU uses normal load/store instructions to talk to the device. Especially useful for large address spaces like graphics."
},

// ---- Polling & Interrupts ----
{
  id: 605, lecture: 6, topic: "Polling & Interrupts", type: "mc",
  question: "In polling, what does the host repeatedly check before sending data?",
  options: [
    "The busy bit in the status register",
    "The interrupt vector",
    "The DMA controller",
    "The instruction cache"
  ],
  correct: 0,
  explanation: "The host reads the busy bit from the status register repeatedly until it is 0, then writes data, sets command-ready, and the controller takes over."
},
{
  id: 606, lecture: 6, topic: "Polling & Interrupts", type: "mc",
  question: "Polling can be implemented in roughly how many instruction cycles?",
  options: ["1", "3", "100", "Variable, depending on device"],
  correct: 1,
  explanation: "Polling can happen in three instruction cycles: read status, logical-AND to extract the status bit, branch if not zero."
},
{
  id: 607, lecture: 6, topic: "Polling & Interrupts", type: "mc",
  question: "What is the purpose of the interrupt vector?",
  options: [
    "To dispatch interrupts to the correct handler",
    "To prioritize processes",
    "To map virtual to physical addresses",
    "To store I/O data"
  ],
  correct: 0,
  explanation: "The interrupt vector lets the CPU find the right interrupt handler quickly when an interrupt occurs."
},
{
  id: 608, lecture: 6, topic: "Polling & Interrupts", type: "mc",
  question: "What is 'interrupt chaining'?",
  options: [
    "Linking multiple interrupts on the same interrupt number for several devices",
    "Disabling interrupts during critical sections",
    "Caching interrupt handlers in TLB",
    "A type of DMA"
  ],
  correct: 0,
  explanation: "Interrupt chaining handles cases where more than one device shares the same interrupt number — the OS chains handlers together."
},
{
  id: 609, lecture: 6, topic: "Polling & Interrupts", type: "tf",
  question: "All interrupts are maskable — they can all be temporarily ignored.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Most interrupts are maskable (can be delayed or ignored), but some are NON-maskable — typically critical hardware errors that cannot be ignored."
},
{
  id: 610, lecture: 6, topic: "Polling & Interrupts", type: "mc",
  question: "Which of these uses the interrupt mechanism?",
  options: [
    "Only hardware I/O",
    "Hardware I/O, exceptions, page faults, and system calls (via trap)",
    "Only system calls",
    "Only page faults"
  ],
  correct: 1,
  explanation: "The interrupt mechanism is used for I/O, exceptions (terminate process or crash), page faults (memory access error), and system calls (via trap)."
},

// ---- DMA ----
{
  id: 611, lecture: 6, topic: "DMA", type: "mc",
  question: "Why was DMA invented?",
  options: [
    "To avoid programmed I/O (one byte at a time) for large data movement",
    "To replace the CPU entirely",
    "To make polling faster",
    "To support faster keyboards"
  ],
  correct: 0,
  explanation: "DMA bypasses CPU for bulk data transfer. The CPU sets up a command block; the DMA controller transfers data directly between device and memory."
},
{
  id: 612, lecture: 6, topic: "DMA", type: "mc",
  question: "What does the OS write to set up a DMA transfer?",
  options: [
    "A DMA command block in memory (source, destination, mode, byte count)",
    "An entire page table",
    "A scheduling priority",
    "A firewall rule"
  ],
  correct: 0,
  explanation: "The OS writes a DMA command block to memory — source and destination addresses, read/write mode, byte count — then writes the block's location to the DMA controller."
},
{
  id: 613, lecture: 6, topic: "DMA", type: "mc",
  question: "What is 'bus mastering' in DMA?",
  options: [
    "The DMA controller grabs the bus from the CPU to perform the transfer",
    "The CPU controls all bus access",
    "The bus is shared equally among all devices",
    "It's a kind of error detection"
  ],
  correct: 0,
  explanation: "Bus mastering means the DMA controller temporarily 'masters' the bus, taking it from the CPU. This involves cycle stealing — CPU briefly stalls — but is far more efficient overall."
},
{
  id: 614, lecture: 6, topic: "DMA", type: "mc",
  question: "After DMA finishes, how is the CPU notified?",
  options: [
    "The DMA controller sends an interrupt",
    "The CPU polls in a loop",
    "It checks a memory flag every cycle",
    "Notification is not needed"
  ],
  correct: 0,
  explanation: "When the transfer is done, the DMA controller signals the CPU via an interrupt — efficient, since the CPU was free to do other work in the meantime."
},

// ---- Application Interface ----
{
  id: 615, lecture: 6, topic: "Application Interface", type: "mc",
  question: "Which is NOT a typical dimension along which devices vary?",
  options: [
    "Character-stream or block",
    "Sequential or random-access",
    "Synchronous or asynchronous",
    "Encrypted or unencrypted by default"
  ],
  correct: 3,
  explanation: "Devices vary by: character vs block, sequential vs random-access, sync vs async, sharable vs dedicated, speed, and read-write/read-only/write-only. Encryption isn't a device-class dimension."
},
{
  id: 616, lecture: 6, topic: "Application Interface", type: "mc",
  question: "Which is a typical command for block devices?",
  options: [
    "get() and put()",
    "read, write, seek",
    "spawn() and exec()",
    "encrypt() and decrypt()"
  ],
  correct: 1,
  explanation: "Block devices (disks) support read, write, seek. They can use raw I/O, direct I/O, or file-system access — and memory-mapped file access via demand paging."
},
{
  id: 617, lecture: 6, topic: "Application Interface", type: "mc",
  question: "Which UNIX system call sends arbitrary bits to a device's control register?",
  options: ["read()", "write()", "ioctl()", "fork()"],
  correct: 2,
  explanation: "The UNIX ioctl() call is the 'back door' for device-specific control. It sends arbitrary bits to a device control register and exchanges data with device data registers."
},
{
  id: 618, lecture: 6, topic: "Application Interface", type: "mc",
  question: "Which I/O model returns immediately with whatever data is available, often using select() to check readiness?",
  options: ["Blocking", "Nonblocking", "Asynchronous", "Synchronous"],
  correct: 1,
  explanation: "Nonblocking I/O returns immediately with a count of bytes transferred. select() is commonly used to check if data is ready before calling read()/write()."
},
{
  id: 619, lecture: 6, topic: "Application Interface", type: "tf",
  question: "Asynchronous I/O is easier to use than blocking I/O.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Asynchronous I/O is DIFFICULT to use. Blocking is the easiest to understand. With async, the process continues running while I/O executes; the OS signals completion later."
},
{
  id: 620, lecture: 6, topic: "Application Interface", type: "mc",
  question: "What is vectored I/O (scatter-gather)?",
  options: [
    "One system call performs multiple I/O operations across multiple buffers",
    "Each I/O goes through a separate system call",
    "I/O is encrypted before transfer",
    "Multiple devices share one buffer"
  ],
  correct: 0,
  explanation: "Vectored I/O (e.g., UNIX readv()/writev()) does multiple I/O operations in one system call across multiple buffers. Decreases context-switching and system-call overhead."
},

// ---- Kernel I/O Subsystem ----
{
  id: 621, lecture: 6, topic: "Kernel I/O Subsystem", type: "mc",
  question: "Why does the kernel use buffering?",
  options: [
    "To cope with speed mismatches, transfer-size mismatches, and to maintain copy semantics",
    "Only to encrypt data",
    "To bypass the file system",
    "To increase CPU clock speed"
  ],
  correct: 0,
  explanation: "Buffering handles speed mismatches between devices, transfer-size mismatches, and ensures 'copy semantics' (e.g., that data is captured at the moment the write call returns)."
},
{
  id: 622, lecture: 6, topic: "Kernel I/O Subsystem", type: "mc",
  question: "What is the key difference between buffering and caching?",
  options: [
    "Buffering temporarily holds data in transit; caching keeps copies of data to speed future access",
    "Buffering is in disk; caching is in RAM",
    "They are exactly the same",
    "Buffering is encryption; caching is compression"
  ],
  correct: 0,
  explanation: "A buffer holds data being transferred. A cache holds a fast copy of data. Buffering and caching are sometimes combined — the same memory can serve both purposes."
},
{
  id: 623, lecture: 6, topic: "Kernel I/O Subsystem", type: "mc",
  question: "What is spooling typically used for?",
  options: [
    "Encryption",
    "Holding output for a device that can serve only one request at a time (e.g., printing)",
    "Caching network packets",
    "Memory protection"
  ],
  correct: 1,
  explanation: "Spooling holds output for a one-at-a-time device — the classic example is a printer. Multiple jobs queue up; the device processes them sequentially."
},
{
  id: 624, lecture: 6, topic: "Kernel I/O Subsystem", type: "tf",
  question: "All I/O instructions are defined to be privileged.",
  options: ["True", "False"],
  correct: 0,
  explanation: "All I/O instructions are privileged. User processes must use system calls. Memory-mapped and I/O port memory locations must also be protected."
},
{
  id: 625, lecture: 6, topic: "Kernel I/O Subsystem", type: "mc",
  question: "Device reservation provides:",
  options: [
    "Random access to all devices",
    "Exclusive access to a device via allocation/de-allocation system calls",
    "Faster transfer rates",
    "Disk encryption"
  ],
  correct: 1,
  explanation: "Device reservation provides exclusive access to a device. The OS provides system calls for allocation and de-allocation — but watch out for deadlock!"
},

// ---- STREAMS & Performance ----
{
  id: 626, lecture: 6, topic: "STREAMS & Performance", type: "mc",
  question: "What is STREAMS in UNIX System V?",
  options: [
    "A full-duplex communication channel between a user-level process and a device",
    "A type of file system",
    "A scheduling algorithm",
    "A network protocol stack"
  ],
  correct: 0,
  explanation: "A STREAM is a full-duplex channel between a user process and a device. It has a stream head, zero or more modules, and a driver end. Modules use message passing."
},
{
  id: 627, lecture: 6, topic: "STREAMS & Performance", type: "mc",
  question: "Which is NOT a typical way to improve I/O performance?",
  options: [
    "Reduce number of context switches",
    "Reduce data copying",
    "Use DMA",
    "Increase the number of interrupts as much as possible"
  ],
  correct: 3,
  explanation: "Performance is improved by REDUCING interrupts (using larger transfers, smart controllers, polling sometimes), reducing context switches, reducing data copying, and using DMA."
},
{
  id: 628, lecture: 6, topic: "STREAMS & Performance", type: "tf",
  question: "Each module in a STREAM has its own read and write queues, and modules communicate via message passing.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Each STREAM module contains a read queue and a write queue. Communication between queues is by message passing — asynchronous internally, synchronous with the user process."
},
{
  id: 629, lecture: 6, topic: "STREAMS & Performance", type: "mc",
  question: "Which is a common Android power-management feature?",
  options: [
    "Wake locks that prevent device sleep while held",
    "Always-on full CPU mode",
    "Disabling all I/O when battery is full",
    "Hardware-only power management"
  ],
  correct: 0,
  explanation: "Android uses wake locks (like other locks but they prevent device sleep), component-level power management, device trees, and power collapse (very deep sleep)."
},


// =============================================================================
// LECTURE 7 — FILE SYSTEMS  (~24 questions)
// =============================================================================

// ---- File Concept ----
{
  id: 701, lecture: 7, topic: "File Concept", type: "mc",
  question: "How is a file viewed from the OS perspective?",
  options: [
    "As a contiguous logical address space",
    "Always as a physical disk block",
    "As a network packet",
    "As a register set"
  ],
  correct: 0,
  explanation: "A file is a contiguous logical address space — its content is defined by its creator. Many types exist: text, source, executable."
},
{
  id: 702, lecture: 7, topic: "File Concept", type: "mc",
  question: "Which file attribute is the only one kept in human-readable form?",
  options: ["Name", "Identifier", "Type", "Location"],
  correct: 0,
  explanation: "The file name is the only attribute kept in human-readable form. The identifier is a unique number internal to the file system."
},
{
  id: 703, lecture: 7, topic: "File Concept", type: "mc",
  question: "Where is information about files kept?",
  options: [
    "In the directory structure, maintained on the disk",
    "Only in the CPU's registers",
    "Only in the TLB",
    "In the user's home directory only"
  ],
  correct: 0,
  explanation: "File attributes are stored in the directory structure, which itself resides on disk."
},
{
  id: 704, lecture: 7, topic: "File Concept", type: "mc",
  question: "What does the Open(Fi) operation do?",
  options: [
    "Searches the directory structure on disk for entry Fi and moves its content to memory",
    "Deletes the file",
    "Creates a new file",
    "Encrypts the file"
  ],
  correct: 0,
  explanation: "Open(Fi) finds entry Fi on disk and brings the relevant directory entry into memory. Close(Fi) writes the in-memory entry back to disk."
},
{
  id: 705, lecture: 7, topic: "File Concept", type: "mc",
  question: "What does file truncation do?",
  options: [
    "Renames the file",
    "Deletes the file's contents but keeps the file itself",
    "Encrypts the file",
    "Moves the file to another directory"
  ],
  correct: 1,
  explanation: "Truncate removes a file's contents but preserves its metadata (the file itself remains)."
},
{
  id: 706, lecture: 7, topic: "File Concept", type: "mc",
  question: "What does the file-open count track?",
  options: [
    "How many times the file has been read",
    "Number of processes currently having the file open — used to know when the last close happens",
    "File size",
    "File age in days"
  ],
  correct: 1,
  explanation: "The file-open count tracks how many processes have the file open. When it reaches zero, the OS can remove its data from the open-file table."
},

// ---- File Locking ----
{
  id: 707, lecture: 7, topic: "File Concept", type: "mc",
  question: "What is the difference between mandatory and advisory file locks?",
  options: [
    "Mandatory: OS enforces; Advisory: processes check locks voluntarily",
    "Advisory: OS enforces; Mandatory: voluntary",
    "Both are identical",
    "Mandatory locks are read-only"
  ],
  correct: 0,
  explanation: "Mandatory locks: the OS denies access if a conflicting lock is held. Advisory locks: processes can query lock status and decide what to do — cooperation is voluntary."
},
{
  id: 708, lecture: 7, topic: "File Concept", type: "tf",
  question: "Shared locks (like reader locks) allow several processes to acquire them concurrently.",
  options: ["True", "False"],
  correct: 0,
  explanation: "A shared lock is similar to a reader lock — multiple processes can hold it. An exclusive lock is like a writer lock — only one process at a time."
},

// ---- Access Methods ----
{
  id: 709, lecture: 7, topic: "Access Methods", type: "mc",
  question: "Which access method only supports read-next, write-next, and reset?",
  options: ["Sequential access", "Direct access", "Indexed access", "Hashed access"],
  correct: 0,
  explanation: "Sequential access works in order: read next, write next, reset to start. No read after the last write (unless rewriting)."
},
{
  id: 710, lecture: 7, topic: "Access Methods", type: "mc",
  question: "In direct access, what does 'n' represent in 'read n' / 'write n'?",
  options: [
    "Relative block number",
    "Number of bytes",
    "File name length",
    "Hash key"
  ],
  correct: 0,
  explanation: "In direct access, n is a relative block number. The OS decides where to physically place the file, so 'n' is logical."
},
{
  id: 711, lecture: 7, topic: "Access Methods", type: "mc",
  question: "What is ISAM?",
  options: [
    "IBM Indexed Sequential-Access Method — has a small master index pointing to disk blocks of a secondary index",
    "Internet Service Access Module",
    "Interrupt Service Address Map",
    "Integer Storage Allocation Method"
  ],
  correct: 0,
  explanation: "ISAM keeps a small master index pointing to disk blocks of a secondary index. The file is kept sorted by a defined key. All managed by the OS."
},

// ---- Disk & Directory Structure ----
{
  id: 712, lecture: 7, topic: "Directory Structure", type: "mc",
  question: "What is a 'volume'?",
  options: [
    "A logical entity that contains a file system",
    "A type of network protocol",
    "A unit of CPU time",
    "An encryption algorithm"
  ],
  correct: 0,
  explanation: "A volume is an entity containing a file system. Each volume tracks its file system info in a device directory or volume table of contents."
},
{
  id: 713, lecture: 7, topic: "Directory Structure", type: "mc",
  question: "What are the three main goals of directory organization?",
  options: [
    "Efficiency, naming, grouping",
    "Speed, encryption, redundancy",
    "Compression, indexing, hashing",
    "Caching, buffering, spooling"
  ],
  correct: 0,
  explanation: "Directories aim for efficiency (locating files quickly), naming (convenient for users), and grouping (logical grouping by property)."
},
{
  id: 714, lecture: 7, topic: "Directory Structure", type: "mc",
  question: "What problem does a two-level directory still have?",
  options: [
    "No grouping capability for a user's own files",
    "Different users can't have files with the same name",
    "It can't support more than one user",
    "Naming is impossible"
  ],
  correct: 0,
  explanation: "Two-level directories solve the same-name problem (each user has their own directory), but they lack the ability for a user to group their files into subdirectories."
},
{
  id: 715, lecture: 7, topic: "Directory Structure", type: "mc",
  question: "Which special file system in Solaris is a memory-based volatile FS for fast, temporary I/O?",
  options: ["tmpfs", "objfs", "ctfs", "ufs"],
  correct: 0,
  explanation: "tmpfs is a memory-based volatile file system. objfs gives access to kernel symbols; ctfs handles daemon contracts; ufs/zfs are general-purpose."
},

// ---- File Sharing ----
{
  id: 716, lecture: 7, topic: "File Sharing & Protection", type: "mc",
  question: "What does NFS stand for, and what is it?",
  options: [
    "Network File System — the standard UNIX client-server file sharing protocol",
    "New File System — Linux's modern FS",
    "Native File Storage — a Windows feature",
    "Networked Fast Sharing — a Mac protocol"
  ],
  correct: 0,
  explanation: "NFS = Network File System. It's the standard UNIX client-server file sharing protocol. CIFS is the equivalent standard Windows protocol."
},
{
  id: 717, lecture: 7, topic: "File Sharing & Protection", type: "tf",
  question: "Stateless protocols like NFS v3 include all information in each request, making recovery easy but reducing security.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Stateless protocols (NFS v3) include all information in each request — easy recovery from failures, but less security and reduced caching benefits."
},
{
  id: 718, lecture: 7, topic: "File Sharing & Protection", type: "mc",
  question: "In Unix consistency semantics (UFS):",
  options: [
    "Writes to an open file are visible immediately to other users",
    "Writes are visible only after the file is closed",
    "Writes are never visible to other users",
    "Writes require encryption"
  ],
  correct: 0,
  explanation: "UFS: writes to an open file are visible IMMEDIATELY. AFS uses session semantics — writes are visible only to sessions started after the file is closed."
},
{
  id: 719, lecture: 7, topic: "File Sharing & Protection", type: "mc",
  question: "In UNIX, a permission of 7 in RWX bits means:",
  options: ["R-X", "RW-", "RWX", "R--"],
  correct: 2,
  explanation: "R=4, W=2, X=1. 7 = 4+2+1 = RWX (read, write, execute). 6 = RW-, 5 = R-X, 4 = R--."
},
{
  id: 720, lecture: 7, topic: "File Sharing & Protection", type: "mc",
  question: "Which command attaches a group G to a file 'game' in UNIX?",
  options: ["chmod G game", "chgrp G game", "chown G game", "groupadd G game"],
  correct: 1,
  explanation: "chgrp G game attaches group G to the file 'game'. chmod changes permissions; chown changes the owner."
},

// ---- File-System Structure & Implementation ----
{
  id: 721, lecture: 7, topic: "File-System Layers", type: "mc",
  question: "What does the file organization module do?",
  options: [
    "Understands files, logical addresses, and physical blocks; translates logical block # to physical block #; manages free space and disk allocation",
    "Manages user authentication only",
    "Encrypts files",
    "Schedules CPU processes"
  ],
  correct: 0,
  explanation: "The file organization module sits between the basic file system and the logical file system. It manages allocation, free space, and translates logical to physical blocks."
},
{
  id: 722, lecture: 7, topic: "File-System Layers", type: "mc",
  question: "In UNIX, what is the FCB called?",
  options: ["inode", "vnode", "dentry", "superblock"],
  correct: 0,
  explanation: "The File Control Block in UNIX is called an inode. NTFS stores file info in the Master File Table using relational DB structures."
},
{
  id: 723, lecture: 7, topic: "File-System Layers", type: "mc",
  question: "What does the volume control block (superblock) contain?",
  options: [
    "Volume details: total blocks, free blocks, block size, free block pointers",
    "All file contents",
    "User passwords",
    "Network configuration"
  ],
  correct: 0,
  explanation: "The volume control block (superblock, master file table) holds total/free block counts, block size, free-block pointers, etc. — overall file-system info."
},
{
  id: 724, lecture: 7, topic: "File-System Layers", type: "mc",
  question: "Where is the boot control block typically located?",
  options: [
    "First block of the volume",
    "Last block of the volume",
    "In the FCB",
    "In the inode"
  ],
  correct: 0,
  explanation: "The boot control block, if present, is usually the first block of the volume. It contains info needed to boot the OS from that volume."
},

// ---- Directory Implementation ----
{
  id: 725, lecture: 7, topic: "Directory Structure", type: "mc",
  question: "What is a drawback of a linear-list directory implementation?",
  options: [
    "Linear search time",
    "Hash collisions",
    "Requires encryption",
    "Limited to 1024 entries"
  ],
  correct: 0,
  explanation: "Linear list is simple to program but has linear search time. Could be improved by keeping it ordered alphabetically (with a linked list or B+ tree)."
},
{
  id: 726, lecture: 7, topic: "Directory Structure", type: "mc",
  question: "What is the main problem with hash tables for directories?",
  options: [
    "Collisions — situations where two file names hash to the same location",
    "Very slow lookups",
    "Require more disk space",
    "Don't support multi-user access"
  ],
  correct: 0,
  explanation: "Hash tables speed up search drastically but suffer from collisions. They are only good if entries are fixed size, or with chained overflow."
},

// ---- Allocation Methods ----
{
  id: 727, lecture: 7, topic: "Allocation Methods", type: "mc",
  question: "What is the main advantage of contiguous allocation?",
  options: [
    "Best performance in most cases; simple — only starting block and length needed",
    "No fragmentation at all",
    "Files can grow indefinitely",
    "Random access is impossible"
  ],
  correct: 0,
  explanation: "Contiguous allocation has best performance — only starting block # and length are needed. But it suffers from external fragmentation and difficulty with file growth."
},
{
  id: 728, lecture: 7, topic: "Allocation Methods", type: "mc",
  question: "An 'extent' is:",
  options: [
    "A contiguous block of disk space — files consist of one or more extents",
    "A type of inode",
    "A linked list of free space",
    "A hash table for directories"
  ],
  correct: 0,
  explanation: "An extent is a contiguous block of disks. Extent-based file systems (e.g., Veritas) allocate disk blocks in extents — a file consists of one or more extents."
},
{
  id: 729, lecture: 7, topic: "Allocation Methods", type: "mc",
  question: "What is the FAT variation of linked allocation?",
  options: [
    "File Allocation Table — pointers stored in a table at the beginning of the volume, indexed by block number",
    "Free Allocation Tree — a B+ tree of free space",
    "First-Available Token system",
    "File Address Translator"
  ],
  correct: 0,
  explanation: "FAT stores block pointers in a table at the start of the volume, indexed by block number. Faster than scattered pointers and cacheable in memory."
},
{
  id: 730, lecture: 7, topic: "Allocation Methods", type: "tf",
  question: "Linked allocation has no external fragmentation but locating a block can require many I/Os and disk seeks.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Linked allocation eliminates external fragmentation but is slow for random access. Reliability is also a concern — a broken pointer can lose data."
},

// ---- Free-Space ----
{
  id: 731, lecture: 7, topic: "Free-Space", type: "mc",
  question: "In a bit-map free-space representation, what does bit[i] = 1 mean?",
  options: ["Block i is free", "Block i is occupied", "Block i is corrupted", "Block i is in cache"],
  correct: 0,
  explanation: "In the bit map (bit vector), bit[i]=1 means block[i] is free; bit[i]=0 means it's occupied. CPUs have instructions to find the offset of the first '1' bit quickly."
},
{
  id: 732, lecture: 7, topic: "Free-Space", type: "mc",
  question: "What is the 'counting' approach to free-space management?",
  options: [
    "Keep the address of the first free block and a count of following free blocks",
    "Count all bytes ever written",
    "Track each block's age",
    "Count the number of users per file"
  ],
  correct: 0,
  explanation: "Counting takes advantage of the fact that contiguous blocks are usually allocated/freed together. Each entry has address + count of consecutive free blocks."
},
{
  id: 733, lecture: 7, topic: "Free-Space", type: "mc",
  question: "What is the page cache for memory-mapped I/O based on?",
  options: [
    "Virtual memory techniques and addresses (pages, not disk blocks)",
    "Disk blocks directly",
    "TLB entries",
    "Process IDs"
  ],
  correct: 0,
  explanation: "A page cache caches PAGES rather than disk blocks, using virtual memory techniques. Memory-mapped I/O uses the page cache; routine FS I/O uses the buffer (disk) cache."
},
{
  id: 734, lecture: 7, topic: "Free-Space", type: "mc",
  question: "What are 'free-behind' and 'read-ahead' techniques?",
  options: [
    "Optimizations for sequential file access",
    "Encryption modes",
    "Page-table compression techniques",
    "Network protocols"
  ],
  correct: 0,
  explanation: "Both optimize sequential access. Read-ahead pre-fetches future blocks; free-behind removes blocks just read since they're unlikely to be needed again soon."
},


// =============================================================================
// LECTURE 8 — FILE-SYSTEM MOUNTING + NFS + WINDOWS  (~28 questions)
// =============================================================================

// ---- Partitions & Mounting ----
{
  id: 801, lecture: 8, topic: "Partitions & Mounting", type: "mc",
  question: "What is the difference between a 'cooked' and a 'raw' partition?",
  options: [
    "Cooked contains a file system; raw is just a sequence of blocks with no FS",
    "Cooked is encrypted; raw is plaintext",
    "Cooked is for OS; raw is for users",
    "There is no difference"
  ],
  correct: 0,
  explanation: "Cooked partitions contain a file system (the OS can manage files). Raw partitions are just sequences of blocks — used for swap space, databases."
},
{
  id: 802, lecture: 8, topic: "Partitions & Mounting", type: "mc",
  question: "What does a boot block do?",
  options: [
    "Points to a boot loader or contains enough code to load the kernel from the file system",
    "Stores user passwords",
    "Cache disk blocks",
    "Hold the page table"
  ],
  correct: 0,
  explanation: "The boot block contains code to load the kernel from the file system, or points to a boot loader. May also support multi-OS booting."
},
{
  id: 803, lecture: 8, topic: "Partitions & Mounting", type: "mc",
  question: "What happens during file-system mounting?",
  options: [
    "FS consistency is checked, repairs are attempted if needed, then it's added to the mount table",
    "Files are encrypted",
    "Memory is freed up",
    "A new process is spawned"
  ],
  correct: 0,
  explanation: "At mount time, the OS checks file-system consistency. If metadata is wrong, it tries to fix it. Once OK, it's added to the mount table for access."
},
{
  id: 804, lecture: 8, topic: "Partitions & Mounting", type: "tf",
  question: "The root partition contains the operating system and is mounted at boot time.",
  options: ["True", "False"],
  correct: 0,
  explanation: "The root partition contains the OS and is mounted at boot. Other partitions can be mounted automatically or manually after."
},

// ---- VFS ----
{
  id: 805, lecture: 8, topic: "VFS", type: "mc",
  question: "What is the main purpose of a Virtual File System (VFS)?",
  options: [
    "To provide one common API for different file system types",
    "To encrypt files",
    "To compress files for storage",
    "To replace the kernel"
  ],
  correct: 0,
  explanation: "VFS lets the same system call interface (open, read, write, close) work across many file systems. It separates generic FS operations from implementation details."
},
{
  id: 806, lecture: 8, topic: "VFS", type: "mc",
  question: "Which is NOT a Linux VFS object type?",
  options: ["inode", "file", "superblock", "page-frame"],
  correct: 3,
  explanation: "Linux VFS has four object types: inode, file, superblock, and dentry (directory entry). Page-frame is a memory-management concept, not a VFS object."
},
{
  id: 807, lecture: 8, topic: "VFS", type: "mc",
  question: "What is a vnode?",
  options: [
    "The VFS representation of a file — holds inode info or network file details",
    "A virtual network node",
    "A type of CPU register",
    "A network protocol"
  ],
  correct: 0,
  explanation: "Vnodes hold inodes or network file details. VFS dispatches operations to the appropriate file-system implementation through them."
},
{
  id: 808, lecture: 8, topic: "VFS", type: "tf",
  question: "Each VFS object has a pointer to a function table containing addresses of routines that implement operations on that object.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Every VFS object has a function table — like a virtual method table in object-oriented systems. VFS calls the appropriate routine for each operation."
},

// ---- NFS ----
{
  id: 809, lecture: 8, topic: "NFS", type: "mc",
  question: "What transport protocol did the original NFS implementation use?",
  options: ["UDP/IP", "TCP/IP", "HTTP", "FTP"],
  correct: 0,
  explanation: "The original Sun/Solaris NFS used an unreliable datagram protocol — UDP/IP and Ethernet. Newer versions can use TCP."
},
{
  id: 810, lecture: 8, topic: "NFS", type: "mc",
  question: "When a remote directory is mounted via NFS:",
  options: [
    "It looks like an integral subtree of the local file system, replacing the subtree at the mount point",
    "Files must be copied to local disk first",
    "Only read access is allowed",
    "The local FS is overwritten"
  ],
  correct: 0,
  explanation: "The mounted remote directory appears as an integral subtree of the local FS. Files in the remote directory are accessed transparently — subject to access rights."
},
{
  id: 811, lecture: 8, topic: "NFS", type: "mc",
  question: "Through what mechanism is NFS made independent of machine/OS architecture?",
  options: [
    "Through RPC primitives built on top of an External Data Representation (XDR) protocol",
    "Through encryption",
    "Through compression",
    "Through Java"
  ],
  correct: 0,
  explanation: "NFS uses RPC primitives over XDR (External Data Representation). This makes NFS independent of underlying machine, OS, and network architecture."
},
{
  id: 812, lecture: 8, topic: "NFS", type: "mc",
  question: "What is the 'export list' in NFS?",
  options: [
    "It specifies which local file systems the server exports for mounting, and which machines may mount them",
    "A list of files the client has downloaded",
    "A backup schedule",
    "A user list with passwords"
  ],
  correct: 0,
  explanation: "The export list defines what the server makes available and to whom. Mount requests are matched against the export list before being allowed."
},
{
  id: 813, lecture: 8, topic: "NFS", type: "mc",
  question: "After a successful mount, what does the NFS server return to the client?",
  options: [
    "A file handle — a key with the file-system identifier and the inode number of the mounted directory",
    "An encrypted password",
    "A complete copy of the file system",
    "Nothing"
  ],
  correct: 0,
  explanation: "A file handle = (file-system ID, inode number). This is the key the client uses for all future operations on the mounted directory."
},
{
  id: 814, lecture: 8, topic: "NFS", type: "tf",
  question: "NFS servers (v3 and earlier) are stateful — they keep client state across requests.",
  options: ["True", "False"],
  correct: 1,
  explanation: "NFS servers (through v3) are STATELESS — each request must provide all needed arguments. This simplifies recovery but limits caching. NFS v4 is different (stateful)."
},
{
  id: 815, lecture: 8, topic: "NFS", type: "mc",
  question: "Which is one of the three major NFS architecture layers?",
  options: [
    "UNIX file-system interface (above)",
    "TCP/IP routing layer",
    "Symmetric encryption layer",
    "Page replacement layer"
  ],
  correct: 0,
  explanation: "Three layers: (1) UNIX file-system interface (open/read/write/close); (2) VFS layer (distinguishes local vs remote); (3) NFS service layer (implements protocol)."
},
{
  id: 816, lecture: 8, topic: "NFS", type: "mc",
  question: "How does NFS perform path-name translation?",
  options: [
    "By breaking the path into components and doing a separate NFS lookup for each",
    "By sending the full path in one call",
    "Via DNS",
    "Through a hash function"
  ],
  correct: 0,
  explanation: "NFS breaks the path into components and does a separate NFS lookup for every (component-name, directory-vnode) pair. A client-side cache speeds this up."
},

// ---- Windows Architecture ----
{
  id: 817, lecture: 8, topic: "Windows Architecture", type: "mc",
  question: "Which Windows component isolates platform-dependent code in a DLL?",
  options: [
    "Hardware Abstraction Layer (HAL)",
    "Object Manager",
    "Executive",
    "Memory Manager"
  ],
  correct: 0,
  explanation: "The HAL is a DLL that isolates platform-dependent code, supporting Windows portability. The kernel and executive are largely portable thanks to it."
},
{
  id: 818, lecture: 8, topic: "Windows Architecture", type: "mc",
  question: "Which is one of Windows 10's design goals?",
  options: [
    "Portability, security, POSIX compliance, multiprocessor support, extensibility, international support",
    "Single-CPU only",
    "Hard real-time guarantees",
    "Stateless operation"
  ],
  correct: 0,
  explanation: "Windows 10's main goals include portability, security, POSIX compliance, multiprocessor support, extensibility, international support, and MS-DOS/Windows compatibility."
},
{
  id: 819, lecture: 8, topic: "Windows Architecture", type: "tf",
  question: "Windows uses a microkernel-style layered architecture.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Windows uses a microkernel-style layered architecture. Protected mode = HAL + kernel + executive. User mode = subsystems (environmental + protection)."
},
{
  id: 820, lecture: 8, topic: "Windows Architecture", type: "mc",
  question: "Which protected-mode components are part of the Windows kernel mode?",
  options: [
    "HAL, kernel, executive",
    "User applications and DLLs",
    "Win32 subsystem only",
    "Power management only"
  ],
  correct: 0,
  explanation: "Protected mode: HAL, kernel, executive. User mode: environmental subsystems (e.g., Win32) and protection subsystems."
},

// ---- Windows Kernel & Scheduling ----
{
  id: 821, lecture: 8, topic: "Windows Kernel & Scheduling", type: "mc",
  question: "Which is NOT one of the four main kernel responsibilities in Windows?",
  options: [
    "Thread scheduling",
    "Interrupt and exception handling",
    "Recovery after power failure",
    "User authentication"
  ],
  correct: 3,
  explanation: "The kernel's four responsibilities: thread scheduling, interrupt/exception handling, low-level processor synchronization, recovery after power failure. User authentication is handled elsewhere."
},
{
  id: 822, lecture: 8, topic: "Windows Kernel & Scheduling", type: "tf",
  question: "The Windows kernel is never paged out of memory.",
  options: ["True", "False"],
  correct: 0,
  explanation: "The Windows kernel is never paged out and its execution is never preempted. This guarantees it's always available for critical operations."
},
{
  id: 823, lecture: 8, topic: "Windows Kernel & Scheduling", type: "mc",
  question: "What does the Windows kernel schedule?",
  options: [
    "Threads (not processes)",
    "Processes (not threads)",
    "Both equally",
    "Only system services"
  ],
  correct: 0,
  explanation: "Threads — not processes — are the unit of execution scheduled by the kernel's dispatcher. Each thread has its own priority, processor affinity, and state."
},
{
  id: 824, lecture: 8, topic: "Windows Kernel & Scheduling", type: "mc",
  question: "How many priority levels does Windows scheduling use?",
  options: ["8", "16", "32", "64"],
  correct: 2,
  explanation: "Windows uses a 32-level priority scheme. Variable class: 0–15. Real-time class: 16–31."
},
{
  id: 825, lecture: 8, topic: "Windows Kernel & Scheduling", type: "mc",
  question: "Which priority range is the 'real-time class' in Windows?",
  options: ["0–15", "16–31", "0–31", "16–63"],
  correct: 1,
  explanation: "Real-time class: priorities 16–31. Variable class: 0–15. Real-time threads have preferential CPU access but Windows is only SOFT real-time."
},
{
  id: 826, lecture: 8, topic: "Windows Kernel & Scheduling", type: "mc",
  question: "Which of these is a valid Windows thread state?",
  options: [
    "Ready, standby, running, waiting, transition, terminated",
    "Ready, executing, hibernating, dead",
    "Started, paused, stopped",
    "Active, dormant"
  ],
  correct: 0,
  explanation: "Windows thread states: ready, standby, running, waiting, transition, terminated. Standby = chosen to run next; transition = a temporary intermediate state."
},
{
  id: 827, lecture: 8, topic: "Windows Kernel & Scheduling", type: "mc",
  question: "What does Windows use to achieve multiprocessor mutual exclusion?",
  options: ["Spin locks in global memory", "Semaphores only", "Software locks", "Disable interrupts"],
  correct: 0,
  explanation: "The kernel uses spin locks in global memory for multiprocessor mutual exclusion. They are efficient for short critical sections."
},
{
  id: 828, lecture: 8, topic: "Windows Kernel & Scheduling", type: "mc",
  question: "Who calls the Interrupt Service Routine (ISR) in Windows?",
  options: [
    "The interrupt dispatcher in the kernel",
    "The user process directly",
    "The DMA controller",
    "The application"
  ],
  correct: 0,
  explanation: "The interrupt dispatcher (in the kernel) calls either an ISR (e.g., in a device driver) or an internal kernel routine when an interrupt arrives."
},

// ---- Windows Memory & NTFS ----
{
  id: 829, lecture: 8, topic: "Windows Memory & NTFS", type: "mc",
  question: "What is the Windows VM page size?",
  options: ["1 KB", "4 KB", "8 KB", "64 KB"],
  correct: 1,
  explanation: "The Windows VM manager uses page-based management with a 4 KB page size."
},
{
  id: 830, lecture: 8, topic: "Windows Memory & NTFS", type: "mc",
  question: "What are the two steps Windows uses to allocate memory?",
  options: [
    "Reserve, then commit",
    "Allocate, then deallocate",
    "Open, then close",
    "Map, then unmap"
  ],
  correct: 0,
  explanation: "Step 1: Reserve — reserves a portion of the process address space. Step 2: Commit — assigns space in the system's paging file(s)."
},
{
  id: 831, lecture: 8, topic: "Windows Memory & NTFS", type: "mc",
  question: "How does Windows address translation use the page directory?",
  options: [
    "Each process has a 1024-entry page directory; each entry points to a page table with 1024 PTEs",
    "Page directory has 4096 entries",
    "No page directory is used",
    "Page directory has 1 entry per process"
  ],
  correct: 0,
  explanation: "Each process has a page directory of 1024 entries (4 bytes each). Each entry points to a page table with 1024 PTEs. Each PTE points to a 4 KB page frame."
},
{
  id: 832, lecture: 8, topic: "Windows Memory & NTFS", type: "mc",
  question: "How many possible page states does Windows define?",
  options: ["3", "5", "6", "8"],
  correct: 2,
  explanation: "A Windows page can be in six states: valid, zeroed, free, standby, modified, bad."
},
{
  id: 833, lecture: 8, topic: "Windows Memory & NTFS", type: "mc",
  question: "What is the fundamental structure of NTFS?",
  options: [
    "A volume — may occupy part of a disk, an entire disk, or span multiple disks",
    "A flat file",
    "A network share",
    "A relational database"
  ],
  correct: 0,
  explanation: "NTFS is built on volumes. A volume is created by the disk administrator and based on a logical disk partition."
},
{
  id: 834, lecture: 8, topic: "Windows Memory & NTFS", type: "mc",
  question: "What is the MFT in NTFS?",
  options: [
    "Master File Table — array of records describing every file on the volume",
    "Memory Frame Table",
    "Master Format Translator",
    "Multi-File Tag"
  ],
  correct: 0,
  explanation: "Every NTFS file is described by one or more records in the Master File Table (MFT). All metadata is stored in regular files."
},
{
  id: 835, lecture: 8, topic: "Windows Memory & NTFS", type: "mc",
  question: "How does NTFS implement recovery after a crash?",
  options: [
    "All file-system data structure updates are wrapped in transactions logged with redo/undo info",
    "By making backups every minute",
    "By disallowing writes",
    "By encrypting the disk"
  ],
  correct: 0,
  explanation: "Before altering metadata, NTFS writes a log record with redo and undo information. After the change, a commit record is written. The log enables recovery."
},

// ---- Windows Networking ----
{
  id: 836, lecture: 8, topic: "Windows Networking", type: "mc",
  question: "What does NDIS stand for in Windows networking?",
  options: [
    "Network Device Interface Specification",
    "Network Driver Initialization System",
    "Network Distributed Information System",
    "Network Data Integrity Service"
  ],
  correct: 0,
  explanation: "NDIS separates network adapters from transport protocols, so either can be changed without affecting the other."
},
{
  id: 837, lecture: 8, topic: "Windows Networking", type: "mc",
  question: "What protocol does Windows use to send I/O requests over the network?",
  options: ["SMB", "FTP", "HTTP", "SSH"],
  correct: 0,
  explanation: "SMB (Server Message Block) is used to send I/O requests over the network. Message types: session control, file, printer, message."
},
{
  id: 838, lecture: 8, topic: "Windows Networking", type: "mc",
  question: "What is a Windows 'domain'?",
  options: [
    "A group of NT-server machines sharing a common security policy and user database",
    "A DNS suffix",
    "A type of file",
    "An IP range"
  ],
  correct: 0,
  explanation: "An NT domain is a group of machines sharing a common security policy and user database. Used for global access-rights management."
},
{
  id: 839, lecture: 8, topic: "Windows Networking", type: "mc",
  question: "Which Windows name-resolution method dynamically maintains a database of name→IP bindings via DHCP?",
  options: ["WINS", "DNS", "host file", "LMHOSTS"],
  correct: 0,
  explanation: "WINS (Windows Internet Name Service) uses DHCP to automatically update name-to-IP bindings without user intervention."
},


// =============================================================================
// LECTURE 9 — SECURITY & PROTECTION  (~28 questions)
// =============================================================================

// ---- Security Problem ----
{
  id: 901, lecture: 9, topic: "Security Problem", type: "mc",
  question: "What is the precise difference between a 'threat' and an 'attack'?",
  options: [
    "Threat is potential violation; attack is attempt to breach security",
    "Threat is more dangerous than an attack",
    "They are exactly the same",
    "Threat is only software; attack is only physical"
  ],
  correct: 0,
  explanation: "A threat is a potential security violation. An attack is the actual attempt to breach security. Attacks can be accidental or malicious."
},
{
  id: 902, lecture: 9, topic: "Security Problem", type: "mc",
  question: "Which is a breach of integrity?",
  options: [
    "Unauthorized reading of data",
    "Unauthorized modification of data",
    "Unauthorized destruction of data",
    "Unauthorized use of resources"
  ],
  correct: 1,
  explanation: "Confidentiality = unauthorized reading. Integrity = unauthorized modification. Availability = unauthorized destruction. Theft of service = unauthorized use of resources. DOS = prevention of legitimate use."
},
{
  id: 903, lecture: 9, topic: "Security Problem", type: "mc",
  question: "What is 'masquerading'?",
  options: [
    "Pretending to be an authorized user to escalate privileges",
    "Hiding messages with encryption",
    "Using a VPN",
    "Logging out automatically"
  ],
  correct: 0,
  explanation: "Masquerading breaches authentication — the attacker pretends to be an authorized user to gain privileges."
},
{
  id: 904, lecture: 9, topic: "Security Problem", type: "mc",
  question: "What is a man-in-the-middle attack?",
  options: [
    "An intruder sits in the data flow, masquerading as the sender to the receiver and vice versa",
    "An attacker steals physical hardware",
    "Multiple attackers flood a server",
    "An employee leaks information"
  ],
  correct: 0,
  explanation: "Man-in-the-middle: the intruder intercepts communication, pretending to be each party to the other. Often used against asymmetric crypto without certificates."
},
{
  id: 905, lecture: 9, topic: "Security Problem", type: "tf",
  question: "Security is as weak as the weakest link in the chain.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Defenses must be effective at all four levels — physical, application, OS, network. Humans are also a risk via phishing and social engineering."
},
{
  id: 906, lecture: 9, topic: "Security Problem", type: "mc",
  question: "What is 'session hijacking'?",
  options: [
    "Intercepting an already-established session to bypass authentication",
    "Logging out a user",
    "Starting a new session",
    "Sharing a session with a friend"
  ],
  correct: 0,
  explanation: "Session hijacking intercepts an authenticated session, allowing the attacker to skip authentication entirely."
},

// ---- Program Threats ----
{
  id: 907, lecture: 9, topic: "Program Threats", type: "mc",
  question: "What is a Trojan horse?",
  options: [
    "A code segment that misuses its environment — looks legitimate but acts maliciously",
    "A type of firewall",
    "A symmetric encryption algorithm",
    "An OS kernel module"
  ],
  correct: 0,
  explanation: "A Trojan horse acts in a clandestine manner. It exploits mechanisms allowing user-written programs to be executed by other users."
},
{
  id: 908, lecture: 9, topic: "Program Threats", type: "mc",
  question: "What is a trap door (backdoor)?",
  options: [
    "A specific user ID or password that circumvents normal security",
    "A type of physical lock",
    "A network port",
    "An OS service"
  ],
  correct: 0,
  explanation: "A trap door could even be in a compiler. It bypasses normal security — very hard to detect."
},
{
  id: 909, lecture: 9, topic: "Program Threats", type: "mc",
  question: "What does ransomware do?",
  options: [
    "Locks up data via encryption and demands payment to unlock it",
    "Sends spam from your computer",
    "Logs keystrokes silently",
    "Disables the firewall"
  ],
  correct: 0,
  explanation: "Ransomware encrypts user data and demands payment for the decryption key. A major financial threat for individuals and organizations."
},
{
  id: 910, lecture: 9, topic: "Program Threats", type: "mc",
  question: "Code-injection attacks usually exploit:",
  options: [
    "Bugs in non-malicious system code, especially in C/C++ which allows direct memory access",
    "Hardware faults",
    "User typos",
    "OS-level firewalls"
  ],
  correct: 0,
  explanation: "Code injection results from insecure programming in low-level languages like C/C++. Direct pointer access enables buffer overflows."
},
{
  id: 911, lecture: 9, topic: "Program Threats", type: "mc",
  question: "How can buffer overflow attacks be mitigated?",
  options: [
    "Disable stack execution; add a 'non-executable' bit to page table entries (available in SPARC and x86)",
    "Encrypt all memory",
    "Disable interrupts",
    "Use faster CPUs"
  ],
  correct: 0,
  explanation: "Buffer overflow can be mitigated by marking stack memory as non-executable. Modern x86 and SPARC support this. But security exploits still find ways around it."
},
{
  id: 912, lecture: 9, topic: "Program Threats", type: "mc",
  question: "What is a 'virus dropper'?",
  options: [
    "A program that inserts a virus onto the system",
    "An antivirus tool",
    "A network packet",
    "A type of stream cipher"
  ],
  correct: 0,
  explanation: "A virus dropper is the carrier that inserts the actual virus payload onto a system. Many virus categories exist: file, boot, macro, polymorphic, stealth, etc."
},
{
  id: 913, lecture: 9, topic: "Program Threats", type: "tf",
  question: "Polymorphic viruses change their signature to evade detection.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Polymorphic viruses change their signature to avoid detection. Other evasive types: encrypted, stealth, tunneling, multipartite, armored."
},

// ---- System & Network Threats ----
{
  id: 914, lecture: 9, topic: "System & Network Threats", type: "mc",
  question: "What is a worm?",
  options: [
    "A standalone program that spreads via spawn mechanism — no host needed",
    "Code attached to a host program",
    "A type of hash function",
    "A keyboard logger"
  ],
  correct: 0,
  explanation: "A worm is standalone. Unlike a virus (which is embedded in a host program), a worm uses a spawn mechanism — like the famous Internet Worm."
},
{
  id: 915, lecture: 9, topic: "System & Network Threats", type: "mc",
  question: "What does the tool 'nmap' do?",
  options: [
    "Scans all ports in a given IP range for a response (port scanning)",
    "Decrypts files",
    "Monitors network bandwidth",
    "Compiles programs"
  ],
  correct: 0,
  explanation: "nmap is a port scanner — it scans IP ranges for open ports. nessus uses a database of protocols/bugs to find exploits."
},
{
  id: 916, lecture: 9, topic: "System & Network Threats", type: "mc",
  question: "What is DDoS?",
  options: [
    "Distributed Denial-of-Service — attack comes from multiple sites at once",
    "Direct Disk Operating System",
    "Double Data-Out Signal",
    "Dynamic DoS — only one attacker"
  ],
  correct: 0,
  explanation: "DDoS comes from many sources simultaneously, often through a botnet. Hard to distinguish from being legitimately popular at first."
},
{
  id: 917, lecture: 9, topic: "System & Network Threats", type: "tf",
  question: "Port scanning is always malicious — it has no legitimate use.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Port scanning can be used for both good (security audits, administration) and evil (finding vulnerabilities to exploit)."
},

// ---- Cryptography ----
{
  id: 918, lecture: 9, topic: "Cryptography", type: "mc",
  question: "Why is cryptography essential for network communication?",
  options: [
    "Source and destination cannot be trusted without it — IP addresses can be spoofed",
    "It makes data smaller",
    "It increases speed",
    "It's only needed for sensitive data"
  ],
  correct: 0,
  explanation: "Inside a single computer, OS controls process IDs and ports. Over a network, identity (IP) can be spoofed — only cryptography provides trust."
},
{
  id: 919, lecture: 9, topic: "Cryptography", type: "mc",
  question: "What key sizes does AES support?",
  options: ["128, 192, or 256 bits", "Only 128 bits", "512 or 1024 bits", "Variable up to 4096 bits"],
  correct: 0,
  explanation: "AES (adopted by NIST in 2001) supports 128, 192, or 256-bit keys. It works on 128-bit blocks."
},
{
  id: 920, lecture: 9, topic: "Cryptography", type: "mc",
  question: "Why is DES now considered insecure?",
  options: [
    "Keys are too short",
    "It's too slow",
    "It uses public keys",
    "It can't encrypt binary data"
  ],
  correct: 0,
  explanation: "DES keys are too short (56 bits effective) to resist modern computing power. Triple-DES (using 2 or 3 keys, 3 passes) extends its life but is also being phased out."
},
{
  id: 921, lecture: 9, topic: "Cryptography", type: "mc",
  question: "What is RC4?",
  options: [
    "The most common symmetric stream cipher (encrypts a stream of bytes); now known to have vulnerabilities",
    "An asymmetric key algorithm",
    "A hash function",
    "A digital signature scheme"
  ],
  correct: 0,
  explanation: "RC4 is a symmetric STREAM cipher (block ciphers like AES work on fixed blocks). Used in wireless transmission historically; now known to have weaknesses."
},
{
  id: 922, lecture: 9, topic: "Cryptography", type: "mc",
  question: "In RSA asymmetric encryption, what makes deriving the private key from the public key computationally infeasible?",
  options: [
    "The difficulty of factoring the product of two large primes",
    "Quantum encryption",
    "A secret physical token",
    "Random key rotation"
  ],
  correct: 0,
  explanation: "RSA relies on N = p × q where p and q are large primes. While checking primality is efficient, factoring N is computationally infeasible."
},
{
  id: 923, lecture: 9, topic: "Cryptography", type: "tf",
  question: "Asymmetric cryptography is more compute-intensive than symmetric and is typically not used for bulk data encryption.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Asymmetric crypto is heavier (math operations on large numbers). Typical pattern: use asymmetric to exchange a symmetric session key, then use symmetric for bulk data."
},

// ---- Authentication ----
{
  id: 924, lecture: 9, topic: "Authentication", type: "mc",
  question: "What property must a hash function H have to be useful in authentication?",
  options: [
    "Collision resistance — infeasible to find m' ≠ m with H(m) = H(m')",
    "It must be reversible",
    "It must use a key",
    "It must produce variable-length output"
  ],
  correct: 0,
  explanation: "A hash function must be collision-resistant. MD5 produces a 128-bit hash; SHA-1 produces a 160-bit hash. Both have known weaknesses today."
},
{
  id: 925, lecture: 9, topic: "Authentication", type: "mc",
  question: "What does MAC stand for in cryptography?",
  options: [
    "Message Authentication Code — uses symmetric encryption to authenticate messages",
    "Media Access Control",
    "Multiplexing Algorithm Code",
    "Modular Arithmetic Cipher"
  ],
  correct: 0,
  explanation: "MAC is a cryptographic checksum generated from a message using a secret key. Anyone with the key can verify the MAC."
},
{
  id: 926, lecture: 9, topic: "Authentication", type: "mc",
  question: "What is a digital signature based on?",
  options: [
    "Asymmetric keys — the private key signs, the public key verifies",
    "Only symmetric encryption",
    "Hash functions only",
    "Random number generators"
  ],
  correct: 0,
  explanation: "Digital signatures use asymmetric keys with the keys reversed (private signs, public verifies). Anyone can verify; only the holder of the private key can sign — this is the basis of non-repudiation."
},
{
  id: 927, lecture: 9, topic: "Authentication", type: "mc",
  question: "Why use authentication separately from encryption?",
  options: [
    "Sometimes you want authentication without confidentiality (e.g., signed patches); also less compute than full encryption",
    "Encryption is illegal",
    "Authentication is faster than reading the message",
    "They cannot be used together"
  ],
  correct: 0,
  explanation: "Authentication can be cheaper than encryption (except for RSA digital signatures). Sometimes you want integrity/authenticity without secrecy — e.g., signed software patches."
},
{
  id: 928, lecture: 9, topic: "Authentication", type: "mc",
  question: "What is a digital certificate?",
  options: [
    "Proof of who owns a public key — signed by a trusted Certificate Authority (CA)",
    "An encrypted file",
    "A type of password",
    "A network packet"
  ],
  correct: 0,
  explanation: "A digital certificate is a public key signed by a trusted Certificate Authority. CA public keys come pre-installed in browsers; they vouch for other CAs by signing them."
},
{
  id: 929, lecture: 9, topic: "Authentication", type: "mc",
  question: "At which OSI layer does SSL/TLS operate?",
  options: ["Transport", "Network", "Physical", "Application"],
  correct: 0,
  explanation: "SSL/TLS operates at the Transport layer. IPSec works at the Network layer (basis of VPNs). IKE handles key exchange."
},
{
  id: 930, lecture: 9, topic: "Authentication", type: "mc",
  question: "How does TLS use cryptography?",
  options: [
    "Asymmetric crypto establishes a session key; then symmetric crypto encrypts bulk communication",
    "Symmetric encryption only",
    "Asymmetric encryption for everything",
    "No encryption — just authentication"
  ],
  correct: 0,
  explanation: "TLS: server is verified via certificate, asymmetric crypto sets up a session key, and symmetric encryption handles bulk data. This combines security with speed."
},

// ---- User Auth & Defenses ----
{
  id: 931, lecture: 9, topic: "User Auth & Defenses", type: "mc",
  question: "How are passwords usually stored at the authenticating site?",
  options: [
    "Encrypted/hashed using an algorithm easy to compute but hard to invert; only encrypted form stored",
    "Plaintext in a public file",
    "Inside the kernel only",
    "On the user's own device only"
  ],
  correct: 0,
  explanation: "Stored encrypted (e.g., UNIX /etc/shadow, readable only by superuser). Algorithm is easy forward, hard to invert. Only the encrypted form is stored — never decrypted."
},
{
  id: 932, lecture: 9, topic: "User Auth & Defenses", type: "mc",
  question: "What is the purpose of 'salt' in password hashing?",
  options: [
    "Add a random value before hashing so the same password produces different hashes",
    "Slow down login",
    "Encrypt the password",
    "Replace the password"
  ],
  correct: 0,
  explanation: "Salt is added before hashing to avoid the same password being encrypted to the same value. Defeats rainbow-table attacks effectively."
},
{
  id: 933, lecture: 9, topic: "User Auth & Defenses", type: "mc",
  question: "What is multi-factor authentication?",
  options: [
    "Need two or more authentication factors (e.g., USB dongle + biometric + password)",
    "Multiple passwords",
    "Many users sharing one account",
    "A password change history"
  ],
  correct: 0,
  explanation: "MFA requires two or more factors — typically combining something you know (password), have (token), and are (biometric)."
},
{
  id: 934, lecture: 9, topic: "User Auth & Defenses", type: "mc",
  question: "What's the key advantage of anomaly-based intrusion detection over signature-based?",
  options: [
    "It can detect zero-day attacks",
    "It uses no CPU",
    "It needs no configuration",
    "It eliminates false positives"
  ],
  correct: 0,
  explanation: "Signature-based detection spots known bad patterns. Anomaly detection looks for unusual behavior — can catch zero-day attacks but suffers from false positives/negatives."
},
{
  id: 935, lecture: 9, topic: "User Auth & Defenses", type: "tf",
  question: "Defense in depth means relying on a single, very strong layer of security.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Defense in depth means MULTIPLE layers of security — physical, application, OS, network — so an attacker who bypasses one still faces others."
},

// ---- Firewalls & Classifications ----
{
  id: 936, lecture: 9, topic: "Firewalls & Classifications", type: "mc",
  question: "What is 'tunneling' in a firewall context?",
  options: [
    "A disallowed protocol traveling within an allowed one (e.g., telnet inside HTTP)",
    "Encrypted VPN traffic",
    "A type of firewall",
    "Underground cabling"
  ],
  correct: 0,
  explanation: "Tunneling hides a disallowed protocol inside an allowed one. Firewalls based on host name/IP can also be defeated by spoofing."
},
{
  id: 937, lecture: 9, topic: "Firewalls & Classifications", type: "mc",
  question: "What does an 'application proxy firewall' do?",
  options: [
    "Understands and controls application protocols (e.g., SMTP)",
    "Just forwards packets",
    "Only blocks IP addresses",
    "Encrypts traffic"
  ],
  correct: 0,
  explanation: "Application proxy firewalls understand specific application protocols and can apply rules at the application level (e.g., filtering SMTP commands)."
},
{
  id: 938, lecture: 9, topic: "Firewalls & Classifications", type: "mc",
  question: "What does a 'system-call firewall' do?",
  options: [
    "Monitors important system calls and applies rules (e.g., this program may execute that system call)",
    "Filters by file extension",
    "Blocks all network access",
    "Encrypts user data"
  ],
  correct: 0,
  explanation: "System-call firewalls monitor all important system calls and apply policy rules — useful for sandboxing untrusted programs."
},
{
  id: 939, lecture: 9, topic: "Firewalls & Classifications", type: "mc",
  question: "Which is the highest US DoD security classification?",
  options: ["A", "B", "C", "D"],
  correct: 0,
  explanation: "Highest: A — formal design and verification techniques. Then B (sensitivity labels — B1, B2, B3), C (discretionary protection — C1, C2), D (minimal)."
},


// =============================================================================
// LECTURE 10 — NETWORK & DISTRIBUTED SYSTEMS  (~26 questions)
// =============================================================================

// ---- Distributed Basics ----
{
  id: 1001, lecture: 10, topic: "Distributed Basics", type: "mc",
  question: "How is a distributed system defined?",
  options: [
    "A collection of loosely coupled nodes interconnected by a communications network",
    "A single CPU with multiple cores",
    "A network of cell phones only",
    "A cluster of GPUs"
  ],
  correct: 0,
  explanation: "Nodes are variously called processors, computers, machines, hosts. A 'site' is a location; a 'node' is a specific system."
},
{
  id: 1002, lecture: 10, topic: "Distributed Basics", type: "mc",
  question: "In peer-to-peer (P2P) configuration:",
  options: [
    "Each node shares equal responsibilities and can act as both client and server",
    "One central server is required",
    "Only file sharing is allowed",
    "Nodes can only receive, not send"
  ],
  correct: 0,
  explanation: "P2P: every node is both client and server. Client-server has a clear distinction. Hybrid combines both."
},
{
  id: 1003, lecture: 10, topic: "Distributed Basics", type: "mc",
  question: "Which is NOT one of the main reasons for distributed systems?",
  options: [
    "Resource sharing",
    "Computation speedup",
    "Reliability",
    "Mandatory encryption"
  ],
  correct: 3,
  explanation: "Main reasons: resource sharing (files, GPUs), computation speedup (distribute subtasks), load balancing, reliability (recover from site failures)."
},

// ---- Network Structure ----
{
  id: 1004, lecture: 10, topic: "Network Structure", type: "mc",
  question: "What IEEE standard defines Ethernet?",
  options: ["802.3", "802.11", "802.15", "802.16"],
  correct: 0,
  explanation: "Ethernet: IEEE 802.3, typically 10 Mbps to over 10 Gbps. WiFi: IEEE 802.11, 11 Mbps to over 400 Mbps."
},
{
  id: 1005, lecture: 10, topic: "Network Structure", type: "mc",
  question: "Which is true about WANs?",
  options: [
    "Links geographically separated sites, uses routers, leased lines, optical cable, microwave, satellites",
    "Only covers a single building",
    "Always faster than LANs",
    "Doesn't need routers"
  ],
  correct: 0,
  explanation: "WANs span large geographic distances. Many backbone providers reach 40–100 Gbps. The Internet is the world's biggest WAN."
},

// ---- OSI & TCP/IP ----
{
  id: 1006, lecture: 10, topic: "OSI & TCP/IP", type: "mc",
  question: "Which OSI layer handles physical transmission of bit streams?",
  options: ["Layer 1 (Physical)", "Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)"],
  correct: 0,
  explanation: "Layer 1 (Physical) deals with mechanical and electrical details of bit transmission."
},
{
  id: 1007, lecture: 10, topic: "OSI & TCP/IP", type: "mc",
  question: "Which OSI layer handles message transfer between processes and breaks messages into packets?",
  options: ["Network (3)", "Transport (4)", "Session (5)", "Application (7)"],
  correct: 1,
  explanation: "Layer 4 (Transport): low-level network access, message transfer between clients/processes, partitioning into packets, maintaining packet order, flow control."
},
{
  id: 1008, lecture: 10, topic: "OSI & TCP/IP", type: "mc",
  question: "Which OSI layer resolves data format differences (character conversions, half/full duplex)?",
  options: ["Application", "Session", "Presentation", "Network"],
  correct: 2,
  explanation: "Layer 6 (Presentation) resolves differences in formats — character set conversions, encoding, encryption."
},
{
  id: 1009, lecture: 10, topic: "OSI & TCP/IP", type: "tf",
  question: "The TCP/IP model is more widely adopted than the OSI model.",
  options: ["True", "False"],
  correct: 0,
  explanation: "TCP/IP is the most widely adopted protocol stack. OSI was developed in the late 1970s but is not in widespread use today."
},
{
  id: 1010, lecture: 10, topic: "OSI & TCP/IP", type: "mc",
  question: "Which protocol maps IP addresses to MAC addresses on a LAN?",
  options: ["DNS", "ARP", "DHCP", "RARP"],
  correct: 1,
  explanation: "ARP (Address Resolution Protocol): when a system wants to send data on a LAN, it uses ARP broadcast to find the MAC address corresponding to an IP."
},
{
  id: 1011, lecture: 10, topic: "OSI & TCP/IP", type: "tf",
  question: "Routers forward broadcast packets to all connected networks.",
  options: ["True", "False"],
  correct: 1,
  explanation: "Broadcasts are NOT forwarded by routers to different networks — they stay within the local network."
},

// ---- Transport ----
{
  id: 1012, lecture: 10, topic: "Transport: UDP/TCP", type: "mc",
  question: "Which is the well-known port number for HTTP?",
  options: ["21", "22", "25", "80"],
  correct: 3,
  explanation: "FTP=21, SSH=22, SMTP=25, HTTP=80. Port numbers identify the receiving process on a host."
},
{
  id: 1013, lecture: 10, topic: "Transport: UDP/TCP", type: "mc",
  question: "Which best describes UDP?",
  options: [
    "Unreliable and connectionless — bare-bones extension to IP with port numbers; packets are 'datagrams'",
    "Reliable and connection-oriented",
    "Encrypted and authenticated",
    "Connection-oriented but unreliable"
  ],
  correct: 0,
  explanation: "UDP packets are datagrams. No delivery guarantees, no ordering, no setup/teardown — just IP plus port numbers."
},
{
  id: 1014, lecture: 10, topic: "Transport: UDP/TCP", type: "mc",
  question: "What is the TCP 'three-way handshake'?",
  options: [
    "A series of control packets used to initiate a TCP connection",
    "Three retries of every packet",
    "A handshake done three times for safety",
    "A type of encryption negotiation"
  ],
  correct: 0,
  explanation: "TCP connections start with a three-way handshake of control packets, and are closed with another series. This establishes the connection state."
},
{
  id: 1015, lecture: 10, topic: "Transport: UDP/TCP", type: "mc",
  question: "How does TCP ensure reliable delivery?",
  options: [
    "Sender retransmits if ACK isn't received before a timer expires; sequence numbers detect missing packets and order them",
    "It uses encryption",
    "It always sends each packet 3 times",
    "It requires a dedicated physical line"
  ],
  correct: 0,
  explanation: "TCP uses ACKs and sequence numbers. If ACK doesn't arrive, the sender retransmits. Sequence numbers also detect missing/duplicate packets and put them in order."
},
{
  id: 1016, lecture: 10, topic: "Transport: UDP/TCP", type: "mc",
  question: "What is the difference between flow control and congestion control in TCP?",
  options: [
    "Flow control prevents sender from overrunning receiver; congestion control approximates network congestion to adjust rate",
    "Both are the same",
    "Flow control is for UDP only",
    "Congestion control is for receiver only"
  ],
  correct: 0,
  explanation: "Flow control: protects the RECEIVER. Congestion control: protects the NETWORK by slowing down when packet loss/delays suggest congestion."
},
{
  id: 1017, lecture: 10, topic: "Transport: UDP/TCP", type: "tf",
  question: "TCP allows a cumulative ACK to acknowledge a series of packets.",
  options: ["True", "False"],
  correct: 0,
  explanation: "A cumulative ACK confirms a series of packets — efficient. The server can also send multiple packets before waiting for ACKs to maximize throughput."
},

// ---- Network vs Distributed OS ----
{
  id: 1018, lecture: 10, topic: "Network vs Distributed OS", type: "mc",
  question: "In a Network OS, how do users access remote resources?",
  options: [
    "Explicitly — via ssh, FTP, web browser; users must change paradigms (establish a session, use network commands)",
    "Transparently — looks like local access",
    "Only through email",
    "Not at all"
  ],
  correct: 0,
  explanation: "Network OS: users are AWARE of multiple machines and access remote resources explicitly (ssh, FTP, etc.)."
},
{
  id: 1019, lecture: 10, topic: "Network vs Distributed OS", type: "mc",
  question: "In a Distributed OS:",
  options: [
    "Users are NOT aware of multiple machines; access to remote resources is similar to local access",
    "Users must run scripts to access files",
    "All files are encrypted by default",
    "Only one user is supported"
  ],
  correct: 0,
  explanation: "Distributed OS: users are NOT aware of multiple machines. Remote and local resources look the same — transparency is the goal."
},
{
  id: 1020, lecture: 10, topic: "Network vs Distributed OS", type: "mc",
  question: "What is 'computation migration'?",
  options: [
    "Transferring the computation rather than the data, via RPCs or messaging",
    "Moving data closer to users",
    "Migrating between cloud providers",
    "Encrypting computation results"
  ],
  correct: 0,
  explanation: "Computation migration moves the work to where the data is — often more efficient than transferring large data. Done via RPC or messaging."
},
{
  id: 1021, lecture: 10, topic: "Network vs Distributed OS", type: "mc",
  question: "Which is NOT a reason for process migration?",
  options: ["Load balancing", "Computation speedup", "Hardware/software preference", "Maximizing total energy use"],
  correct: 3,
  explanation: "Reasons for process migration: load balancing, speedup, hardware preference, software preference, data access. Energy maximization isn't a goal."
},

// ---- DFS ----
{
  id: 1022, lecture: 10, topic: "DFS", type: "mc",
  question: "What is a heartbeat protocol used for?",
  options: [
    "Failure detection — sites exchange 'I-am-up' messages at fixed intervals",
    "Synchronizing clocks",
    "Encrypting data",
    "Compressing files"
  ],
  correct: 0,
  explanation: "If site A doesn't get an I-am-up message in time, it can send 'Are-you-up?' to B. If no reply, it concludes some failure has occurred."
},
{
  id: 1023, lecture: 10, topic: "DFS", type: "mc",
  question: "What is one weakness of the client-server DFS model (NFS, OpenAFS)?",
  options: [
    "Single point of failure; server is a bottleneck for scalability",
    "Doesn't support multiple users",
    "Requires special hardware",
    "Cannot handle reads"
  ],
  correct: 0,
  explanation: "The single server is both a single point of failure and a bottleneck. Cluster-based DFS (GFS, HDFS) addresses these issues."
},
{
  id: 1024, lecture: 10, topic: "DFS", type: "mc",
  question: "In cluster-based DFS like GFS, what does the metadata server do?",
  options: [
    "Keeps mapping of which data servers hold which chunks of which files; also directory structure",
    "Stores file content",
    "Encrypts all data",
    "Authenticates users"
  ],
  correct: 0,
  explanation: "Metadata server holds the mapping from files to chunks-on-servers, plus the directory hierarchy. Clients connect to it first, then to data servers."
},
{
  id: 1025, lecture: 10, topic: "DFS", type: "mc",
  question: "Why are file chunks replicated n times in GFS/HDFS?",
  options: [
    "Hardware failures are the norm, not the exception — replication ensures availability",
    "To speed up writes",
    "For encryption",
    "To save space"
  ],
  correct: 0,
  explanation: "GFS design observation: hardware failures should be routinely expected. Files are very large and mostly appended. Replication (n=3 typical) ensures fault tolerance."
},

// ---- Caching & Consistency ----
{
  id: 1026, lecture: 10, topic: "Caching & Consistency", type: "mc",
  question: "What is location transparency in DFS naming?",
  options: [
    "File name does not reveal the file's physical storage location",
    "All files are stored in one place",
    "File names change when files move",
    "Files have no names"
  ],
  correct: 0,
  explanation: "Location transparency: name doesn't reveal location. Location independence (stronger): name doesn't need to change if file moves."
},
{
  id: 1027, lecture: 10, topic: "Caching & Consistency", type: "mc",
  question: "What is the cache-consistency problem in DFS?",
  options: [
    "Keeping cached copies consistent with the master file when caches are scattered across clients",
    "Cache being too small",
    "Caches getting full quickly",
    "Cache encryption being too slow"
  ],
  correct: 0,
  explanation: "Files have one master copy at the server, but parts are cached at clients. Keeping caches consistent with the master is the central DFS challenge."
},
{
  id: 1028, lecture: 10, topic: "Caching & Consistency", type: "mc",
  question: "Which cache update policy writes data to the cache and writes to the server later?",
  options: [
    "Write-through",
    "Delayed-write (write-back)",
    "Write-on-close (variant)",
    "Read-only"
  ],
  correct: 1,
  explanation: "Delayed-write (write-back): writes go to the cache first, server later. Fast but less reliable — crash before flush can lose data. Write-through is the opposite extreme."
},
{
  id: 1029, lecture: 10, topic: "Caching & Consistency", type: "mc",
  question: "Which consistency approach lets the SERVER notify clients of cache invalidation?",
  options: [
    "Server-initiated approach",
    "Client-initiated approach",
    "Write-through",
    "Write-on-close"
  ],
  correct: 0,
  explanation: "Server-initiated: server tracks which parts of files clients cache and notifies on changes. Client-initiated: client periodically validates with server."
},
{
  id: 1030, lecture: 10, topic: "Caching & Consistency", type: "mc",
  question: "Compare HDFS and GFS write semantics:",
  options: [
    "HDFS: append-only, single writer (simpler consistency). GFS: random writes with concurrent writers (more complex)",
    "Both forbid writes entirely",
    "HDFS allows random writes; GFS forbids them",
    "They have identical semantics"
  ],
  correct: 0,
  explanation: "HDFS = append-only writes, single writer — simplifies consistency. GFS = random writes + concurrent writers — more complex but more flexible."
},
{
  id: 1031, lecture: 10, topic: "Caching & Consistency", type: "tf",
  question: "Main-memory caches allow workstations to be diskless.",
  options: ["True", "False"],
  correct: 0,
  explanation: "Main-memory caches enable diskless workstations and allow faster access. Disk caches are more reliable (survive reboots) but slower."
},

];

// Total: ~140 questions across 6 lectures.

