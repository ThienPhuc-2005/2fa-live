# 2FA Live

Công cụ tạo mã xác thực 2 bước (2FA / TOTP) chạy hoàn toàn trên trình duyệt —
giống Google Authenticator nhưng dùng ngay trên web. Dán *mã bí mật* (secret key),
nhận ngay mã 6 số tự đổi mỗi 30 giây.

**Riêng tư:** mọi tính toán chạy trên máy người dùng, mã bí mật không gửi đi đâu.

## Công nghệ

- React 19 + Vite
- [Astryx](https://www.npmjs.com/package/@astryxdesign/core) design system (theme y2k)
- [otpauth](https://github.com/hectorm/otpauth) để tạo mã TOTP theo chuẩn RFC 6238

## Chạy trên máy

```bash
npm install     # cài thư viện (chỉ cần làm 1 lần)
npm run dev      # mở http://localhost:5173
```

## Build bản để đưa lên mạng

```bash
npm run build    # tạo thư mục dist/
```

## Đưa lên GitHub Pages

Kho này có sẵn file `.github/workflows/deploy.yml`: mỗi lần đẩy code lên nhánh
`main`, GitHub tự build và đăng web. Chỉ cần vào **Settings → Pages → Source:
GitHub Actions** một lần để bật.

## Liên hệ

- Facebook: https://www.facebook.com/thien.phuc.450676/
- Telegram: https://t.me/Atlantis24k
- Threads: https://www.threads.com/@thien240805
