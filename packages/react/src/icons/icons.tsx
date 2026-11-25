import { createIcon } from "./create-icon";

/* A small built-in set for the components themselves. Bring any SVG icon set for the rest. */

export const IconCheck = createIcon({ name: "Check", children: <path d="M20 6 9 17l-5-5" /> });
export const IconMinus = createIcon({ name: "Minus", children: <path d="M5 12h14" /> });
export const IconPlus = createIcon({ name: "Plus", children: <path d="M5 12h14M12 5v14" /> });
export const IconX = createIcon({ name: "X", children: <path d="M18 6 6 18M6 6l12 12" /> });
export const IconChevronDown = createIcon({
  name: "ChevronDown",
  children: <path d="m6 9 6 6 6-6" />,
});
export const IconChevronUp = createIcon({
  name: "ChevronUp",
  children: <path d="m18 15-6-6-6 6" />,
});
export const IconChevronLeft = createIcon({
  name: "ChevronLeft",
  mirrorInRtl: true,
  children: <path d="m15 18-6-6 6-6" />,
});
export const IconChevronRight = createIcon({
  name: "ChevronRight",
  mirrorInRtl: true,
  children: <path d="m9 18 6-6-6-6" />,
});
export const IconArrowUp = createIcon({
  name: "ArrowUp",
  children: <path d="M12 19V5m-7 7 7-7 7 7" />,
});
export const IconArrowDown = createIcon({
  name: "ArrowDown",
  children: <path d="M12 5v14m7-7-7 7-7-7" />,
});
export const IconArrowUpDown = createIcon({
  name: "ArrowUpDown",
  children: <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />,
});
export const IconSearch = createIcon({
  name: "Search",
  children: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
});
export const IconMenu = createIcon({
  name: "Menu",
  children: <path d="M4 6h16M4 12h16M4 18h16" />,
});
export const IconMoreHorizontal = createIcon({
  name: "MoreHorizontal",
  children: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
});
export const IconInfo = createIcon({
  name: "Info",
  children: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
});
export const IconCircleCheck = createIcon({
  name: "CircleCheck",
  children: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
});
export const IconCircleAlert = createIcon({
  name: "CircleAlert",
  children: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
});
export const IconTriangleAlert = createIcon({
  name: "TriangleAlert",
  children: (
    <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" />
  ),
});
export const IconEye = createIcon({
  name: "Eye",
  children: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
});
export const IconEyeOff = createIcon({
  name: "EyeOff",
  children: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      <path d="m3 3 18 18" />
    </>
  ),
});
export const IconSun = createIcon({
  name: "Sun",
  children: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
});
export const IconMoon = createIcon({
  name: "Moon",
  children: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
});
export const IconBell = createIcon({
  name: "Bell",
  children: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />,
});
export const IconHome = createIcon({
  name: "Home",
  children: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />,
});
export const IconUser = createIcon({
  name: "User",
  children: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
});
export const IconSettings = createIcon({
  name: "Settings",
  children: (
    <>
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
});
export const IconInbox = createIcon({
  name: "Inbox",
  children: (
    <path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z" />
  ),
});
export const IconPanelLeft = createIcon({
  name: "PanelLeft",
  mirrorInRtl: true,
  children: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </>
  ),
});
export const IconLogOut = createIcon({
  name: "LogOut",
  mirrorInRtl: true,
  children: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />,
});
export const IconFolder = createIcon({
  name: "Folder",
  children: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
});
export const IconChart = createIcon({
  name: "Chart",
  children: <path d="M3 3v18h18M7 16v-4M12 16V8M17 16v-7" />,
});
export const IconCalendar = createIcon({
  name: "Calendar",
  children: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
});
export const IconMail = createIcon({
  name: "Mail",
  children: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
});
export const IconSparkles = createIcon({
  name: "Sparkles",
  children: (
    <path d="m12 3 1.8 4.6 4.7 1.9-4.7 1.9L12 16l-1.8-4.6-4.7-1.9 4.7-1.9ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />
  ),
});
export const IconTrash = createIcon({
  name: "Trash",
  children: <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />,
});
export const IconPencil = createIcon({
  name: "Pencil",
  children: <path d="M17 3l4 4L8 20H4v-4Z" />,
});
export const IconCopy = createIcon({
  name: "Copy",
  children: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
});
export const IconExternalLink = createIcon({
  name: "ExternalLink",
  mirrorInRtl: true,
  children: (
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  ),
});
export const IconFilter = createIcon({
  name: "Filter",
  children: <path d="M3 5h18l-7 8v6l-4 2v-8Z" />,
});
export const IconChevronsUpDown = createIcon({
  name: "ChevronsUpDown",
  children: <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />,
});
export const IconChevronsLeft = createIcon({
  name: "ChevronsLeft",
  mirrorInRtl: true,
  children: <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />,
});
export const IconChevronsRight = createIcon({
  name: "ChevronsRight",
  mirrorInRtl: true,
  children: <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />,
});
export const IconMonitor = createIcon({
  name: "Monitor",
  children: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </>
  ),
});
export const IconLanguages = createIcon({
  name: "Languages",
  children: <path d="m5 8 6 6m-7 0 6-6 2-3M2 5h12M7 2h1m14 20-5-10-5 10m2-4h6" />,
});
export const IconCommand = createIcon({
  name: "Command",
  children: (
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 0 0 0-6Z" />
  ),
});
export const IconColumns = createIcon({
  name: "Columns",
  children: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18m6-18v18" />
    </>
  ),
});
export const IconCalendarDays = createIcon({
  name: "CalendarDays",
  children: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M3 11h18M8 15h.01M12 15h.01M16 15h.01" />
    </>
  ),
});
export const IconCircleX = createIcon({
  name: "CircleX",
  children: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6m0-6 6 6" />
    </>
  ),
});
