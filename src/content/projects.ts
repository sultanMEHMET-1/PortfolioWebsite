import type { ProjectItem } from "./types";

export const projects: readonly ProjectItem[] = [
    {
        id: "formula-ev",
        name: "Formula-style Electric Vehicle",
        description:
            "Embedded firmware for the Purdue Electric Racing team's Formula-style EV. Developed low-level control for dashboard LEDs, driver inputs, and safety-critical pedal torque requests.",
        tech: ["C/C++", "STM32F4", "GPIO", "ADC"],
        links: [],
        highlights: [
            "Implemented low-level control of dashboard LEDs and driver inputs using GPIO configuration and interrupt-driven routines.",
            "Designed and tested safety-critical firmware to process pedal torque requests using ADC sampling and signal filtering.",
        ],
        featured: true,
    },
    {
        id: "frc-9016-auto",
        name: "FRC 9016 Autonomous Routine",
        description:
            "Finite state machine automation and computer vision localization for the FIRST Robotics Competition team 9016.",
        tech: ["Java", "OpenCV", "SolvePnP", "Computer Vision"],
        links: [],
        highlights: [
            "Developed finite state machine automation in Java, leading to the #1 ranked autonomous routine in regional play.",
            "Integrated computer vision for localization using SolvePnP, leading to the team’s first Regional Championship [NYLI2, 2024].",
        ],
        featured: true,
    },
    {
        id: "harmonicore",
        name: "Harmonicore DSP Modules",
        description:
            "FPGA-based digital signal processing modules for real-time autotuning as part of Embedded Systems @ Purdue.",
        tech: ["SystemVerilog", "FPGA", "DSP"],
        links: [],
        highlights: [
            "Designed and implemented FPGA-based digital signal processing (DSP) modules for real-time autotuning.",
            "Optimized HDL modules for timing and resource efficiency, enhancing the core’s responsiveness during live signal processing.",
        ],
        featured: true,
    },
    {
        id: "defect-detection",
        name: "Automated Defect Detection System",
        description:
            "An automated defect detection system using a camera mounted to a 3D printer platform for Brookhaven National Laboratory.",
        tech: ["Python", "OpenCV", "Computer Vision"],
        links: [],
        highlights: [
            "Designed and implemented an automated defect detection system using a camera mounted to a 3D printer platform.",
            "Wrote Python scripts integrating OpenCV to identify silicon wafer defects critical for photolithography.",
        ],
        featured: false,
    },
    {
        id: "lunabotics-nav",
        name: "Lunar Excavator Navigation",
        description:
            "Autonomous navigation and LiDAR integration for the Purdue Lunabotics lunar excavator.",
        tech: ["C++", "ROS", "LiDAR", "A* Algorithm"],
        links: [],
        highlights: [
            "Implemented autonomous navigation algorithms stemming from A* to reliably traverse in simulated lunar environments.",
            "Integrated LiDAR sensors with control systems to improve excavation accuracy and obstacle detection.",
            "Optimized communication between software modules with ROS.",
        ],
        featured: false,
    },
];
