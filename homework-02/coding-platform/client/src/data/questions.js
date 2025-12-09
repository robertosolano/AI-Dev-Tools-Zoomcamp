export const QUESTIONS = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        starterCode: {
            javascript: "function twoSum(nums, target) {\n  // Write your code here\n}",
            python: "def two_sum(nums, target):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 2,
        title: "Reverse String",
        difficulty: "Easy",
        description: "Write a function that reverses a string.",
        starterCode: {
            javascript: "function reverseString(s) {\n  return s.split('').reverse().join('');\n}",
            python: "def reverse_string(s):\n    return s[::-1]"
        }
    },
    {
        id: 3,
        title: "Palindrome Number",
        difficulty: "Easy",
        description: "Given an integer x, return true if x is palindrome integer.",
        starterCode: {
            javascript: "function isPalindrome(x) {\n  // Write your code here\n}",
            python: "def is_palindrome(x):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 4,
        title: "FizzBuzz",
        difficulty: "Easy",
        description: "Print numbers from 1 to n. For multiples of 3 print 'Fizz', for 5 'Buzz', for both 'FizzBuzz'.",
        starterCode: {
            javascript: "function fizzBuzz(n) {\n  // Write your code here\n}",
            python: "def fizz_buzz(n):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 5,
        title: "Valid Parentheses",
        difficulty: "Medium",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        starterCode: {
            javascript: "function isValid(s) {\n  // Write your code here\n}",
            python: "def is_valid(s):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 6,
        title: "Merge Sorted Array",
        difficulty: "Medium",
        description: "Merge two sorted arrays nums1 and nums2 into a single sorted array.",
        starterCode: {
            javascript: "function merge(nums1, m, nums2, n) {\n  // Write your code here\n}",
            python: "def merge(nums1, m, nums2, n):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 7,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Medium",
        description: "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
        starterCode: {
            javascript: "function maxProfit(prices) {\n  // Write your code here\n}",
            python: "def max_profit(prices):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 8,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        starterCode: {
            javascript: "function lengthOfLongestSubstring(s) {\n  // Write your code here\n}",
            python: "def length_of_longest_substring(s):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 9,
        title: "Binary Tree Level Order Traversal",
        difficulty: "Hard",
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
        starterCode: {
            javascript: "function levelOrder(root) {\n  // Write your code here\n}",
            python: "def level_order(root):\n    # Write your code here\n    pass"
        }
    },
    {
        id: 10,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        starterCode: {
            javascript: "function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n}",
            python: "def find_median_sorted_arrays(nums1, nums2):\n    # Write your code here\n    pass"
        }
    }
];

export function getRandomQuestions(count = 10) {
    // For this homework, we just return all 10 since user asked for 10 random and we have 10.
    // In a real app we'd shuffle.
    return [...QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, count);
}
