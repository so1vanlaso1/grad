# Nhật ký dự án · 04/11/2026

| Phát hiện / vấn đề | Cách xử lý |
| --- | --- |
| Bản mẫu có bốn cảnh, dùng chung camera Three.js, nội dung RMIT và ngày tháng 04/2025. | Giữ luồng di chuyển trong cùng canvas, thêm cảnh 05 và 06. Chuyển thông tin hiển thị sang thiệp của Thùy Dung và bỏ liên kết cá nhân của tác giả mẫu khỏi thanh điều hướng. |
| Thiệp gốc ghi 10:00 sáng thứ Bảy 07/11/2026, UEH Campus A, Hall A.116, 59C Nguyễn Đình Chiểu, phường Xuân Hòa, TP. Hồ Chí Minh. | Giữ tấm thiệp kính nổi và các đạo cụ vườn từ cảnh gốc. Thay ảnh trên thiệp, cập nhật nội dung 3D và hiển thị thiệp gốc cùng địa chỉ trong hộp thoại. |
| Ảnh trường có mặt kính, ban công, lam đỏ, mái kính và bậc thềm. Logo có khiên đỏ chữ W. | Bản thử đầu dùng khối hình học. Theo yêu cầu giữ style RMIT, bản cuối dùng ảnh trường tách nền trên mặt phẳng lơ lửng trong không gian 3D, cùng thẻ kính logo SVG, chữ nổi, cây, cỏ và confetti của bố cục cũ. |
| Có ba nhóm người nhận và chưa có nguyên văn thư. | Dựng ba phong bì với nắp gập, dấu sáp, bục và nhãn. Viết lời nháp tiếng Việt trong src/graduation.ts để Dung chỉnh sửa. |
| Album có 10 ảnh, gồm 8 ảnh dọc và 2 ảnh ngang. | Chia thành bốn gian, dùng khung theo tỷ lệ ảnh và thêm hộp xem ảnh trước/sau xuyên suốt album. Tách tải ảnh khỏi phần còn lại của canvas khi đổi gian. |
| Bộ đếm theo thời gian cố định có thể đổi tiêu đề khi camera vẫn ở cảnh trước. | Đồng bộ theo Promise của CameraControls, chặn yêu cầu chuyển cảnh trùng lúc camera đang bay và giới hạn thao tác mở thư/ảnh/thiệp theo cảnh hiện tại. Có nhánh đưa camera tới đích nếu trình duyệt trì hoãn vòng lặp hoạt ảnh. |
| Màn hình hẹp cần giữ cả dãy phong bì và ảnh trong khung nhìn. | Co sân khấu theo tỷ lệ khung nhìn. Thêm nút HTML cho thao tác chạm hoặc dùng bàn phím và hộp thoại có nút đóng, hỗ trợ Escape. |
| Bộ chỉ báo tải cũ gây cảnh báo cập nhật trạng thái khi texture bắt đầu tải. | Dùng chỉ báo tĩnh trong Suspense, tránh cập nhật theo tiến độ texture trong lúc React dựng cảnh. |

## Tệp chỉnh sửa

- Nội dung thiệp, thư và album: src/graduation.ts.
- Mô hình trường: src/sections/SchoolSection.tsx, src/components/3d-shapes/WSUCampus.tsx và src/assets/western-sydney-emblem.svg.
- Hai cảnh mới: src/sections/LettersSection.tsx và src/sections/GallerySection.tsx.

## Chạy cục bộ

- npm run dev
- npm run build


## Kiểm chứng trên trình duyệt

- Đi qua sáu cảnh theo thứ tự và kiểm tra trực quan cảnh WSU, thiệp kính và hai cảnh mới.
- Mở đủ ba thư bằng nút người nhận, chuyển sang gian ảnh thứ hai, rồi lùi từ ảnh 4 về ảnh 3 qua ranh giới hai gian.
- Bản thử cảnh WSU từng có texture SVG màu đen do thiếu kích thước nội tại. Khai báo width/height trong SVG và kiểm tra logo đã hiện lại.

## Sửa font tiếng Việt · 04/11/2026

- Tiêu đề, lời chào và chữ ký dùng các serif hệ thống khác nhau tùy thiết bị. Một số dấu kép trông lệch trong bản xem trước.
- Kiểm tra cmap của hai font Cormorant Infant có sẵn. Cả hai bao phủ toàn bộ U+1EA0–U+1EF9 và các chữ Ă, Đ, Ơ, Ư ở hai kiểu hoa/thường. Nội dung hiện có dùng Unicode NFC.
- Khai báo hai font cục bộ cho các vùng chữ serif và tăng chiều cao dòng tiêu đề. Chữ trên thiệp 3D đã dùng hai tệp font này, nên giữ nguyên cách dựng chữ.

## Mây ở cảnh 02 · 04/11/2026

- Tái hiện trên bản xem trước: hai cụm mây lớn chồng lên nhau ở góc trên bên phải và bị cắt sát mép khung hình.
- Thu nhỏ hai cụm, hạ xuống và đưa về lớp nền phía sau tán hoa. Thay đổi vị trí và kích thước riêng ở cảnh 02.

## Thiết kế lại triển lãm ảnh · 04/11/2026

- Bố cục cũ đặt từng khung trên một vách rời. Bố cục mới dùng một phòng mở có ba mặt tường, sàn ván, ghế băng và ray đèn, với khung ảnh và bảng tên tác phẩm treo trên cùng một tường.
- Giữ đủ 10 ảnh, chia thành bốn gian có tên. Gian cuối trưng bày một ảnh khổ lớn. Bảng tên có số và chú thích, mở ảnh trực tiếp từ khung hoặc từ nút điều hướng.
- Cường độ và tầm chiếu của đèn được chỉnh theo tỷ lệ phòng, để ánh sáng không bị gắt khi khung nhìn hẹp.
- Kiểm tra trên trình duyệt: vào cảnh album, bấm khung ảnh số 02, mở gian 02 và lùi từ ảnh 04 về ảnh 03 qua ranh giới giữa hai gian.
- Kiểm tra thêm ở khung nhìn 390 × 844: phòng và điều hướng nằm trong khung. Chuyển đến gian cuối và mở ảnh 10/10.

## Khung cảnh và hiệu ứng cho sáu chương · 04/11/2026

- Phát hiện: các chương có vật thể chính và một số hiệu ứng sẵn có, nhưng dùng chung nền. Phong bì có bục riêng mà chưa có không gian chung; triển lãm có phòng nhưng thiếu điểm sáng ở lối vào.
- Cách xử lý: thêm nền chuyển màu theo chương, đặt phía sau canvas. Cảnh 01 có vòng sáng và đèn lơ lửng; cảnh 02 có nền vườn dưới ghế và đèn bên lối đi; cảnh 03 có bệ sân trường, bậc thấp và đèn; cảnh 04 có cặp đèn vườn bên thiệp; cảnh 05 có phông nan gỗ, bục chung và đèn; cảnh 06 có đèn ở lối vào và hạt bụi sáng trong phòng.
- Đạo cụ dùng hình khối Three.js và co theo tỷ lệ khung nhìn. Chỉ cảnh đang xem chạy lớp hạt sáng mới. Khi hệ thống yêu cầu giảm chuyển động, lớp hạt mới và hiệu ứng chuyển nền được tắt; hoạt ảnh có sẵn giữ nguyên.
- Kiểm tra: `npm run lint` và `npm run build` đều đạt. Build báo cảnh báo về kích thước bundle và việc dùng eval trong thư viện phụ thuộc.
- Ảnh kiểm tra cảnh 03 cho thấy camera nhìn từ thấp nên mặt dưới bệ tròn chiếm vùng điều hướng. Bỏ bệ tròn, giữ bậc và đèn. Ảnh cảnh 02 cho thấy đèn trông như lơ lửng; thêm trụ đỡ nối đèn với nền vườn.
- Chromium 390 × 844 với tùy chọn giảm chuyển động: đi qua đủ sáu cảnh, mở và đóng thiệp, thư và ảnh bằng Escape; không ghi nhận lỗi JavaScript. Ảnh chụp xác nhận cảnh thư và triển lãm nằm trong khung. Kiểm tra desktop ghi được ba cảnh đầu; chạy toàn bộ bị giới hạn thời gian do Chromium dựng WebGL bằng phần mềm.

## Nhãn phong bì và lần đầu vào triển lãm · 04/11/2026

- Nhãn giữa dùng toàn bộ tên nhóm nên chiếm nhiều diện tích và xuống dòng trên màn hình hẹp. Nhãn gắn vào phong bì dùng “Bạn đồng hành” trên một dòng với cỡ chữ theo màn hình. Nút mở thư vẫn ghi đầy đủ tên nhóm.
- Toàn bộ phòng triển lãm nằm trong cùng một vùng Suspense. Nếu ảnh hoặc font bảng tên chưa tải xong, vùng này ẩn cả phòng. Chuyển vùng chờ vào từng ảnh và từng cặp chữ trên bảng tên. Tường, sàn, đèn, khung và bảng tên tiếp tục hiển thị trong lúc ảnh và chữ tải. Ô màu tạm giữ chỗ cho từng ảnh.
- Kiểm tra tĩnh và build sản xuất đều đạt.
- Chromium 390 × 844 xác nhận chiều rộng và chiều cao nhãn không đổi sau khi zoom, và nút ghi tên đầy đủ vẫn mở đúng thư. Khi giữ các yêu cầu ảnh ở lần đầu vào triển lãm, sân khấu và ba khung vẫn hiện. Ảnh xuất hiện sau khi cho phép tải.

## Số thứ tự trong phòng triển lãm · 04/11/2026

- Bỏ dòng chú thích trên bảng dưới từng ảnh trong phòng 3D. Dùng bảng nhỏ đặt giữa khung, chỉ hiện số thứ tự 01–10.

## Hiệu ứng mặt tiền và logo WSU · 04/11/2026

- Đối chiếu thành phần RMIT còn trong mã nguồn. Ảnh trường dùng chuyển động nổi nhẹ, còn thẻ logo dùng chất liệu bóng và chuyển động lơ lửng.
- Tăng nhẹ độ lắc của ảnh và thẻ WSU. Thêm một vệt sáng chéo thưa, mờ hơn trên mặt tiền và rõ hơn trên logo. Vệt sáng dùng kênh trong suốt của từng ảnh để giữ đường viền. Hai chuyển động này tắt khi hệ thống yêu cầu giảm chuyển động.
- Build và lint đạt. Bản preview trên Chromium 390 × 844 vào được cảnh WSU và dựng ảnh cùng logo mà không báo lỗi JavaScript hay shader WebGL.

## English invitation · 04/11/2026

- Translated the opening, all six chapters, the 3D invitation, the three letters, gallery captions, navigation, accessibility labels, and page metadata.
- The supplied invitation artwork already uses English, so it stays in place. Personal names and official street and ward names retain their Vietnamese spelling.
- Production build and lint passed. Chromium at 390 × 844 confirmed the English page language and headings in all six scenes, and opened and closed the invitation, letter, and photo dialogs.

## Tutorial credit · 05/11/2026

- Added “Based on work by Tran Mai Nhung” to the navigation tutorial and linked the author’s name to the original GitHub repository.

## Letter box and RSVP · 05/11/2026

- Added a seventh chapter with a clickable 3D letter box, floating envelope, and a keyboard-accessible button. The envelope stays still when reduced motion is enabled.
- The form asks whether the guest will join and offers an optional note. It also collects the guest’s name so Dung can identify the reply.
- The site has no RSVP backend. The form prepares a text message for the invitation’s existing contact number and offers a copy option. The guest sends the message from their own messaging app.
- Build and lint passed. Chromium at 390 × 844 verified the 3D click, keyboard entry, required fields, note content, and generated SMS draft link. The check did not send a text.

## RSVP delivery options · 05/11/2026

- The current form prepares an SMS draft. The project does not store RSVP submissions.
- The template README links to the original author’s Netlify site. Hosting for Dung’s copy is unconfirmed. If hosted on Dung’s own Netlify site, Netlify Forms can accept and store the responses, with optional email notifications. React requires a matching static form definition and a form submission request.

## VPS RSVP API and Google Sheets · 05/11/2026

- Replaced the SMS draft with a same-origin API request. The form confirms only after Google Sheets reports one row written and preserves input on failure.
- Added a Node.js backend with zero npm dependencies in Desktop/grad. It uses a server-side service account, caches its access token, and appends the UTC timestamp, name, attendance, and note as raw values.
- Build and lint passed. Local HTTP checks with mocked Google responses covered validation, body limits, authentication caching, successful append and upstream rejection. Live delivery needs the user's Sheet and service account configuration.

## Live RSVP endpoint integration · 05/11/2026

- The hosted invitation cannot use the local development proxy, so the RSVP form now posts directly to `https://140-245-38-247.sslip.io/api/rsvp`. The API permits cross-origin POST requests with JSON. The form sends name, yes/no attendance, and the optional note; it preserves entries on failure and confirms only on a 201 response with `ok: true`.
- Live checks: CORS preflight returned 204, an invalid submission returned 400, and a labeled test submission (`TEST - Codex`, attendance `no`) returned 201 with `{"ok":true}`. The test creates a response that should be disregarded. This confirms the API response, not independent inspection of the spreadsheet.
- Production build and lint were run for this change.


## Phone 3D placement investigation · 05/11/2026

- The 3D camera uses the same section positions and offsets at every viewport size. `Stage` and the gallery shrink by viewport aspect ratio, but models in the milestone and campus scenes and decorative models in the invitation scene use unscaled positions. On a portrait screen, these elements can therefore move out of alignment with their scaled surroundings or be cropped.
- This is a code-level finding; the reported phone, affected scene and observed placement have not yet been confirmed. A targeted visual fix and device verification are pending that information.

## Phone and desktop 3D layout repair · 05/11/2026

- The supplied Android screenshots show the milestone bench detached from its platform, oversized foliage around the campus and invitation, and unreadable 3D date text. The platform and selected card scaled for portrait aspect ratios while surrounding models retained desktop transforms, breaking their relative positions.
- The milestone, campus and invitation now scale their scene contents with their stages. Portrait layouts use a centered invitation camera, smaller milestone tree, simple ground surfaces, and omit duplicate 3D text and excessive foliage/clouds. Desktop scene content and camera framing are retained.
- Portrait rendering uses fewer petals, sparkles, and confetti, caps pixel ratio, and omits bloom to reduce rendering work. These changes reduce the configured workload; actual phone performance and GPU behavior still need on-device confirmation. Orientation changes retarget the camera to the current chapter.
- Chromium software-rendered checks at 390 × 844 navigated the first four chapters without JavaScript errors; screenshots were inspected for placement. Desktop Chromium checks at 1365 × 768 and production build/lint were also run. Software rendering is not a substitute for a physical-phone test.


## Background music · 05/11/2026

- Added the supplied MP3 as background music across the opening and all chapters, starting at 4 seconds and returning to that point when the track ends.
- Browsers can block autoplay with sound. Playback is attempted on load and again on the first page interaction; the accessible speaker button also starts or pauses the music and respects a visitor’s choice to mute it.
- ESLint and the production build passed. The build retained the existing dependency eval and large bundle warnings. Playback has not been verified in a browser.
=======

