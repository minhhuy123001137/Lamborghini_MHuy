# Lamborghini — Beyond the Limits (3D Wind Tunnel & Dynamic Drive-By Showcase)

Website giới thiệu siêu xe Lamborghini thế hệ mới với hiệu ứng 3D siêu xe chạy trong nền, hầm gió lướt khí động học (Wind Tunnel) sống động và hiệu ứng **chiếc xe Lamborghini chạy qua kéo mở nội dung** các phần tiếp theo theo đúng yêu cầu!

---

## 🚀 Các tính năng nâng cấp mới

1. **Hiệu ứng 3D siêu xe chạy trong nền & lướt gió (Three.js WebGL):**
   - Mô hình 3D siêu xe Lamborghini sắc sảo (khung nêm góc cạnh đặc trưng, đèn pha LED chữ Y Terzo Millennio / Revuelto, cánh gió chủ động, ống xả kép phun lửa và mâm hợp kim thể thao xoay theo tốc độ).
   - Bánh xe trước bẻ lái mượt mà theo vị trí con trỏ chuột.
   - Thân xe rung nhẹ theo mặt đường mô phỏng tốc độ cao trên 350 km/h.
   - **Hiệu ứng lướt gió khí động học (Wind Tunnel Streamlines):** 8 đường luồng khí 3D ôm sát mũi xe, nắp capo, kính chắn gió, nóc xe và cuộn lốc xoáy (vortex) sau cánh gió, kết hợp hàng trăm vệt gió tốc độ cao lướt qua.
   - Chuyển động góc nhìn camera điện ảnh (Cinematic Camera) thay đổi góc quay theo từng phần khi cuộn trang:
     - **Hero:** Góc 3/4 mặt trước uy lực.
     - **Thiết kế (01):** Góc ngang sườn xe thể hiện trọn vẹn luồng gió hầm khí động học.
     - **Hiệu năng (02):** Góc thấp đuôi xe chiêm ngưỡng ống xả phun lửa và lực ép mặt đường.
     - **Dòng xe (03):** Góc showroom 45° từ trên cao, kèm bộ đổi màu sơn xe 3D tức thì.
     - **Trải nghiệm (04):** Góc rượt đuổi tốc độ cao ban đêm (Hyperdrive Chase).

2. **Hiệu ứng xe chạy qua kéo mở nội dung ("Car Drive-By Wipe Reveal"):**
   - Khi cuộn đến từng phần (Thiết kế, Hiệu năng, Dòng xe, Trải nghiệm), một chiếc siêu xe Lamborghini tốc độ cao với đèn pha rọi sáng và ống xả phun lửa sẽ phóng vụt qua màn hình từ trái sang phải.
   - Gắn liền với đuôi xe là luồng cắt laser kim loại vàng và tia lửa: **xe chạy đến đâu sẽ kéo mở (`clip-path`) nội dung phần đó ra đến đấy**, tạo hiệu ứng thị giác bứt phá cực kỳ mạnh mẽ.
   - Mỗi phần đều có nút **`[ 🏎️ KÉO LẠI NỘI DUNG ]`** cho phép xem lại hiệu ứng bất cứ lúc nào.

3. **Bảng điều khiển tương tác HUD:**
   - **Đổi màu sơn xe 3D:** Vàng Giallo Auge, Cam Arancio Argos, Xanh Verde Mantis, Đen mờ Nero Nemesis, Đỏ Rosso Mars, Trắng Bianco Monocerus.
   - **`[ 🏎️ XOAY 3D ]`:** Cho phép dùng chuột kéo xoay 360 độ tự do và lăn chuột để phóng to/thu nhỏ ngắm trọn vẹn chiếc xe.
   - **`[ 💨 LƯỚT GIÓ ]`:** Bật / tắt các đường luồng khí động học hầm gió.
   - **`[ 🔊 SOUND ]`:** Âm thanh gầm động cơ V12 và tiếng xe lướt gió Doppler chân thực tổng hợp bằng Web Audio API (mặc định tắt, bấm để bật).
   - **Telemetry HUD:** Đồng hồ hiển thị tốc độ (355 km/h), lực ép downforce (610 kg) và hệ số cản gió (0.33 Cd) theo thời gian thực.

---

## 🛠️ Hướng dẫn khởi chạy

1. Mở thư mục dự án trong **VS Code**.
2. Chuột phải vào `index.html` → chọn **Open with Live Server** (hoặc mở trực tiếp file `index.html` bằng trình duyệt Chrome, Edge, Brave, Firefox).
3. Thưởng thức trải nghiệm 3D và cuộn trang để thấy chiếc xe phóng qua kéo mở từng khối nội dung!
