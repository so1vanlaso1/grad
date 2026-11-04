export const event = {
  name: "Thùy Dung",
  university: "Western Sydney University",
  date: "Saturday, 7 November 2026",
  time: "10:00 AM",
  venue: "UEH Campus A · Hall A.116",
  address: "59C Nguyen Dinh Chieu Street, Xuan Hoa Ward, Ho Chi Minh City",
  phone: "0985763939",
  start: "2026-11-07T10:00:00+07:00",
};

export const chapters = [
  { id: "welcome", name: "Welcome Gate", label: "The invitation", description: "A letter at the campus gate" },
  { id: "memories", name: "Memory Lane", label: "How we got here", description: "An avenue of memories" },
  { id: "turning", name: "The Turning Point", label: "A change of light", description: "The doorway between night and morning" },
  { id: "graduation", name: "Graduation Day", label: "The ceremony", description: "A miniature of UEH Campus A" },
  { id: "thanks", name: "Thank-You Garden", label: "The people who stayed", description: "A garden for the people who got me here" },
  { id: "future", name: "The Next Chapter", label: "The open horizon", description: "The road into the next chapter" },
] as const;

export type GraduationPhoto = {
  id: string;
  title: string;
  category: "portrait" | "memory" | "friends";
  src?: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
};

// Graduation portraits supplied for the invitation. Paths are relative to public/.
export const photos: GraduationPhoto[] = [
  { id: "portrait", title: "A New Chapter", category: "portrait", src: "assets/photos/graduation-portrait.jpg", alt: "Thùy Dung holding a bouquet in graduation attire" },
  { id: "beginning", title: "Under the Trees", category: "memory", src: "assets/photos/lawn-portrait.jpg", alt: "Thùy Dung seated on the campus lawn in graduation attire" },
  { id: "moments", title: "A Moment on the Steps", category: "memory", src: "assets/photos/campus-steps.jpg", alt: "Thùy Dung seated on campus steps in graduation attire" },
  { id: "people", title: "A Walk Through Campus", category: "memory", src: "assets/photos/bouquet-portrait.jpg", alt: "Thùy Dung walking through campus with a bouquet" },
  { id: "semester", title: "Beneath the Old Tree", category: "memory", src: "assets/photos/tree-portrait.jpg", alt: "Thùy Dung seated beneath a tree in graduation attire" },
  { id: "family", title: "Along the Campus Path", category: "friends", src: "assets/photos/campus-walk.jpg", alt: "Thùy Dung walking along a tree-lined campus path" },
  { id: "friends", title: "A Quiet Campus Moment", category: "friends", src: "assets/photos/path-portrait.jpg", alt: "Thùy Dung holding a bouquet on a campus path" },
  { id: "classmates", title: "The Graduation Walk", category: "friends", src: "assets/photos/graduation-walk.jpg", alt: "Thùy Dung walking across campus in graduation attire" },
  { id: "mentors", title: "A Keepsake for the Journey", category: "friends", src: "assets/photos/diploma-portrait.jpg", alt: "Thùy Dung holding a red graduation keepsake on campus" },
];

export function downloadCalendar() {
  const escape = (value: string) => value.replace(/[\\;,]/g, "\\$&").replace(/\r?\n/g, "\\n");
  const utc = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Thuy Dung//Graduation Invitation//EN",
    "BEGIN:VEVENT", "UID:thuy-dung-graduation-20261107@graduation-invitation",
    "DTSTAMP:" + utc(new Date()), "DTSTART:" + utc(new Date(event.start)),
    "SUMMARY:" + escape(event.name + "’s graduation"),
    "LOCATION:" + escape(event.venue + ", " + event.address),
    "DESCRIPTION:" + escape(event.university + " graduation"),
    "END:VEVENT", "END:VCALENDAR", "",
  ];
  const encoder = new TextEncoder();
  const folded = lines.map((line) => {
    let result = "";
    let bytes = 0;
    for (const character of line) {
      const length = encoder.encode(character).length;
      if (bytes + length > 75) {
        result += "\r\n ";
        bytes = 1;
      }
      result += character;
      bytes += length;
    }
    return result;
  });
  const url = URL.createObjectURL(new Blob([folded.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "thuy-dung-graduation.ics";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
