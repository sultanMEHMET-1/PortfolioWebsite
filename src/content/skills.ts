import type { SkillGroup } from "./types";

export const skills: readonly SkillGroup[] = [
    {
        groupName: "Languages",
        skills: ["C", "C++", "Python", "Java", "SystemVerilog", "R"],
    },
    {
        groupName: "Hardware & Embedded",
        skills: ["MicroControllers (ESP32, STM32)", "FPGA", "CAN", "HDL", "RTL Diagrams", "PCB Design", "Internet of Things (IoT)", "LiDAR", "ROS"],
    },
    {
        groupName: "Data & Tools",
        skills: ["Pandas", "NumPy", "OpenCV", "Git/GitHub", "Linux", "High-Performance Computing (HPC)"],
    },
    {
        groupName: "Soft Skills & Languages",
        skills: ["Presentation Skills", "Mentorship", "Turkish (Native)", "English (Native)"],
    },
];
