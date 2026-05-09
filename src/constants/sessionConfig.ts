import { CalendarDaysIcon, PlayCircleIcon, Code2Icon, UsersIcon } from "lucide-react";

export interface ChallengeSchema {
  id: string;
  name: string;
  instructions: string;
  testCases: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  templates: {
    javascript: string;
    python: string;
    java: string;
  };
  limits?: string[];
}

// Map mapping internal session statuses to human-readable strings and badges
export const MEETING_STATUS_MAP = [
  { id: "upcoming", label: "Scheduled", theme: "outline" },
  { id: "completed", label: "Finished", theme: "secondary" },
  { id: "succeeded", label: "Passed", theme: "default" },
  { id: "failed", label: "Failed", theme: "destructive" },
] as const;

// 30-minute block increments for the date/time selectors
export const AVAILABLE_HOURS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

// Interactive action shortcuts displayed in the recruiter/interviewer dashboard grid
export const MENU_ACTIONS = [
  {
    icon: Code2Icon,
    title: "New Call",
    description: "Launch a workspace instantly",
    color: "primary",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    icon: UsersIcon,
    title: "Join Interview",
    description: "Connect using a link",
    color: "purple-500",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
  },
  {
    icon: CalendarDaysIcon,
    title: "Schedule",
    description: "Set up upcoming sessions",
    color: "blue-500",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    icon: PlayCircleIcon,
    title: "Recordings",
    description: "View previous video links",
    color: "orange-500",
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
  },
];

// Curated coding test questions for the live editor screen
export const CHALLENGE_LIST: ChallengeSchema[] = [
  {
    id: "two-sum",
    name: "Two Sum",
    instructions:
      "Find two indices in the integer array `nums` such that their values sum up to the specified `target`.\n\nYou should assume that each input array contains exactly one solution, and you are not allowed to use the same element index twice.",
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] equals 9, indices 0 and 1 are returned.",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    templates: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`,
    },
    limits: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Exactly one valid solution exists.",
    ],
  },
  {
    id: "reverse-string",
    name: "Reverse String",
    instructions:
      "Reverse the given array of characters `s` in-place.\n\nYou must perform this operation with O(1) auxiliary memory space by directly modifying the input array.",
    testCases: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    templates: {
      javascript: `function reverseString(s) {
  // Write your code here
  
}`,
      python: `def reverse_string(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Write your code here
        
    }
}`,
    },
  },
  {
    id: "palindrome-number",
    name: "Palindrome Number",
    instructions:
      "Determine whether the integer `x` is a palindrome. Return `true` if it reads the same forward and backward, otherwise return `false`.",
    testCases: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from both directions.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right it is -121, but from right to left it is 121-. Thus, it is not a palindrome.",
      },
    ],
    templates: {
      javascript: `function isPalindrome(x) {
  // Write your code here
  
}`,
      python: `def is_palindrome(x):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your code here
        return false;
    }
}`,
    },
  },
];

// Coding languages supported in the Monaco workspace panel
export const EDITOR_LANGUAGES = [
  { id: "javascript", label: "JavaScript", icon: "/javascript.png" },
  { id: "python", label: "Python", icon: "/python.png" },
  { id: "java", label: "Java", icon: "/java.png" },
] as const;

export type MenuItemInfo = (typeof MENU_ACTIONS)[number];
