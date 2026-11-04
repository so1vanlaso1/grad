export const event = {
  name: "Thùy Dung",
  fullName: "Phạm Thùy Dung",
  degree: "Bachelor of Business",
  degreeVi: "Cử nhân Kinh doanh",
  university: "Western Sydney University",
  universityVi: "Đại học Western Sydney",
  date: "Saturday, 7 November 2026",
  dateVi: "Thứ Bảy, ngày 7 tháng 11 năm 2026",
  time: "10:00 AM",
  timeVi: "10:00 Sáng (Đón khách từ 9:15 AM)",
  venue: "UEH Campus A · Hall A.116",
  venueVi: "UEH Cơ sở A · Hội trường A.116",
  address: "59C Nguyen Dinh Chieu Street, Vo Thi Sau Ward, District 3, Ho Chi Minh City",
  addressVi: "59C Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
  phone: "0985763939",
  start: "2026-11-07T10:00:00+07:00",
};

export const chapters = [
  {
    id: "welcome",
    name: "Welcome Gate",
    nameVi: "Cổng Chào",
    label: "The invitation",
    labelVi: "Thư mời",
    description: "A letter at the campus gate",
    descriptionVi: "Lá thư gửi trao tại cổng trường",
  },
  {
    id: "memories",
    name: "Memory Lane",
    nameVi: "Con Đường Kỷ Niệm",
    label: "How we got here",
    labelVi: "Chặng đường đã qua",
    description: "An avenue of memories",
    descriptionVi: "Những năm tháng rực rỡ dưới mái trường",
  },
  {
    id: "turning",
    name: "The Turning Point",
    nameVi: "Bước Ngoặt",
    label: "A change of light",
    labelVi: "Khoảnh khắc chuyển mình",
    description: "The doorway between night and morning",
    descriptionVi: "Cánh cửa nối giữa đêm đen và bình minh",
  },
  {
    id: "graduation",
    name: "Graduation Day",
    nameVi: "Ngày Tốt Nghiệp",
    label: "The ceremony",
    labelVi: "Lễ tốt nghiệp",
    description: "A miniature of UEH Campus A",
    descriptionVi: "Hội trường A.116 - UEH Cơ sở A",
  },
  {
    id: "thanks",
    name: "Thank-You Garden",
    nameVi: "Khu Vườn Tri Ân",
    label: "The people who stayed",
    labelVi: "Những người luôn ở bên",
    description: "A garden for the people who got me here",
    descriptionVi: "Tri ân gia đình, thầy cô và bạn bè",
  },
  {
    id: "future",
    name: "The Next Chapter",
    nameVi: "Chân Trời Mới",
    label: "The open horizon",
    labelVi: "Chân trời rộng mở",
    description: "The road into the next chapter",
    descriptionVi: "Tự tin bước vào hành trình mới",
  },
] as const;

export type GraduationPhoto = {
  id: string;
  title: string;
  titleVi?: string;
  category: "portrait" | "memory" | "friends";
  src?: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
  captionVi?: string;
};

// All 10 graduation portraits supplied for the invitation. Paths are relative to public/.
export const photos: GraduationPhoto[] = [
  {
    id: "portrait",
    title: "A New Chapter",
    titleVi: "Khởi Đầu Mới",
    category: "portrait",
    src: "assets/photos/graduation-portrait.jpg",
    alt: "Thùy Dung holding a bouquet in graduation attire",
    caption: "Phạm Thùy Dung · Bachelor of Business · Western Sydney University",
    captionVi: "Phạm Thùy Dung · Cử nhân Kinh doanh · Đại học Western Sydney",
  },
  {
    id: "flower-gaze",
    title: "Looking Forward",
    titleVi: "Ánh Nhìn Tương Lai",
    category: "portrait",
    src: "assets/photos/flower-gaze-portrait.jpg",
    alt: "Thùy Dung holding flowers in front of campus building",
    caption: "A quiet moment of reflection before stepping into the new chapter.",
    captionVi: "Khoảnh khắc tĩnh lặng và tự hào trước khi bước vào chặng đường mới.",
  },
  {
    id: "beginning",
    title: "Under the Trees",
    titleVi: "Dưới Bóng Cây Xanh",
    category: "memory",
    src: "assets/photos/lawn-portrait.jpg",
    alt: "Thùy Dung seated on the campus lawn in graduation attire",
    caption: "Relaxing on the lawn where so many university memories began.",
    captionVi: "Thảnh thơi trên thảm cỏ xanh — nơi bao kỷ niệm thời sinh viên bắt đầu.",
  },
  {
    id: "moments",
    title: "A Moment on the Steps",
    titleVi: "Bậc Thềm Kỷ Niệm",
    category: "memory",
    src: "assets/photos/campus-steps.jpg",
    alt: "Thùy Dung seated on campus steps in graduation attire",
    caption: "Holding the Western Sydney University diploma folder.",
    captionVi: "Giữ chặt tấm bằng cử nhân Đại học Western Sydney.",
  },
  {
    id: "people",
    title: "A Walk Through Campus",
    titleVi: "Dạo Bước Sân Trường",
    category: "memory",
    src: "assets/photos/bouquet-portrait.jpg",
    alt: "Thùy Dung walking through campus with a bouquet",
    caption: "Walking with graduation flowers on milestone day.",
    captionVi: "Bó hoa tươi thắm cùng nụ cười rạng rỡ trong ngày lễ trọng đại.",
  },
  {
    id: "semester",
    title: "Beneath the Old Tree",
    titleVi: "Dưới Tán Cây Già",
    category: "memory",
    src: "assets/photos/tree-portrait.jpg",
    alt: "Thùy Dung seated beneath a tree in graduation attire",
    caption: "Peaceful moments between lectures and exam weeks.",
    captionVi: "Khoảnh khắc bình yên giữa những tuần học và mùa thi bận rộn.",
  },
  {
    id: "family",
    title: "Along the Campus Path",
    titleVi: "Con Đường Thân Quen",
    category: "friends",
    src: "assets/photos/campus-walk.jpg",
    alt: "Thùy Dung walking along a tree-lined campus path",
    caption: "Cherishing every step of growth and learning.",
    captionVi: "Trân trọng từng bước trưởng thành và nỗ lực trong suốt những năm qua.",
  },
  {
    id: "friends",
    title: "A Quiet Campus Moment",
    titleVi: "Nắng Ấm Sân Trường",
    category: "friends",
    src: "assets/photos/path-portrait.jpg",
    alt: "Thùy Dung holding a bouquet on a campus path",
    caption: "Sunlit memories shared with wonderful friends.",
    captionVi: "Kỷ niệm chan hòa ánh nắng bên những người bạn tuyệt vời.",
  },
  {
    id: "classmates",
    title: "The Graduation Walk",
    titleVi: "Bước Đi Tự Tin",
    category: "friends",
    src: "assets/photos/graduation-walk.jpg",
    alt: "Thùy Dung walking across campus in graduation attire",
    caption: "Stepping with pride and gratitude into the future.",
    captionVi: "Tự tin và tự hào bước về phía trước cùng lòng biết ơn.",
  },
  {
    id: "mentors",
    title: "A Keepsake for the Journey",
    titleVi: "Hành Trang Vào Đời",
    category: "friends",
    src: "assets/photos/diploma-portrait.jpg",
    alt: "Thùy Dung holding a red graduation keepsake on campus",
    caption: "Ready for the adventures ahead with love and wisdom.",
    captionVi: "Sẵn sàng cho những chân trời mới với tình yêu thương và tri thức.",
  },
];

export function getGoogleCalendarUrl(): string {
  const title = encodeURIComponent("Lễ Tốt Nghiệp · Phạm Thùy Dung (Western Sydney University)");
  const details = encodeURIComponent(
    "Lễ Tốt Nghiệp Cử nhân Kinh doanh (Bachelor of Business)\n" +
    "Đại học Western Sydney (WSU)\n" +
    "Địa điểm: Hội trường A.116, UEH Cơ sở A, 59C Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh\n" +
    "Thời gian: Thứ Bảy, 07/11/2026 lúc 10:00 AM (Đón khách & chụp ảnh từ 9:15 AM)\n" +
    "Liên hệ: 0985 763 939"
  );
  const location = encodeURIComponent("UEH Campus A · Hội trường A.116, 59C Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP.HCM");
  // 10:00 AM UTC+7 is 03:00 UTC, ceremony ends ~13:00 UTC+7 is 06:00 UTC
  const dates = "20261107T030000Z/20261107T060000Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function downloadCalendar() {
  const escape = (value: string) => value.replace(/[\\;,]/g, "\\$&").replace(/\r?\n/g, "\\n");
  const utc = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pham Thuy Dung//Graduation Invitation//EN",
    "BEGIN:VEVENT",
    "UID:pham-thuy-dung-graduation-20261107@graduation-invitation",
    "DTSTAMP:" + utc(new Date()),
    "DTSTART:" + utc(new Date(event.start)),
    "DTEND:" + utc(new Date("2026-11-07T13:00:00+07:00")),
    "SUMMARY:" + escape(event.fullName + " — Lễ Tốt Nghiệp 2026"),
    "LOCATION:" + escape(event.venueVi + ", " + event.addressVi),
    "DESCRIPTION:" + escape(event.universityVi + " — " + event.degreeVi),
    "END:VEVENT",
    "END:VCALENDAR",
    "",
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
  link.download = "pham-thuy-dung-graduation.ics";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
