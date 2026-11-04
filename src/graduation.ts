import poster from "../media/Graduation Day Invitation Portrait.png";

export const graduation = {
  name: "Thùy Dung",
  date: "Saturday, 7 November 2026",
  time: "10:00 AM",
  venue: "UEH Campus A · Hall A.116",
  address: "59C Nguyễn Đình Chiểu Street, Xuân Hòa Ward, Ho Chi Minh City",
  phone: "0985763939",
  poster,
};

const photos = import.meta.glob<string>("../media/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

export const album = Object.entries(photos).sort(([a], [b]) => a.localeCompare(b)).map(([, url], index) => ({
  url,
  landscape: index === 3 || index === 8,
  caption: [
    "A quiet patch of green", "On the steps", "A bouquet for the big day",
    "A path beneath the trees", "A familiar corner", "In the shade",
    "A walk with flowers", "The graduation cap", "Flowers and the red folder",
    "A corner of campus",
  ][index],
}));

export const letters = [
  {
    title: "Family",
    color: "#a82044",
    greeting: "To my dear family,",
    paragraphs: [
      "As graduation approaches, I keep thinking about the little things: a message asking how I was, a meal at home, a reminder to take things one step at a time. They carried me through days that were harder than I expected.",
      "Thank you for believing in me and giving me time to grow. I can’t wait to give you all a long hug and take a photo together on the big day.",
    ],
  },
  {
    title: "Friends Who Saw Me Through",
    color: "#77504e",
    greeting: "To the friends who saw me through,",
    paragraphs: [
      "When I look back on university, I remember the chats we thought would last only a few minutes, the times we encouraged each other, and the laughter that made a tiring day feel lighter.",
      "Thank you for taking the time to listen and share so much with me. After the ceremony, I hope we’ll still find time to meet up and pick up our unfinished stories.",
    ],
  },
  {
    title: "Teachers",
    color: "#9c694b",
    greeting: "Dear teachers,",
    paragraphs: [
      "Thank you for your lessons, your feedback, and your patience while I was finding my own way. Some things only really made sense after I tried them myself and thought back to what you had taught me.",
      "Graduation is a chance to thank you for all I’ve learned from you. I’ll carry those lessons with me into the next chapter.",
    ],
  },
];
