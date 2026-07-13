import * as OTPAuth from 'otpauth';

// Các tùy chọn tạo mã. Mặc định 6 số, đổi mỗi 30 giây, thuật toán SHA1 —
// đây là chuẩn mà hầu hết dịch vụ (Google, Facebook, Binance...) dùng.
export type TotpOptions = {
  digits: number;
  period: number;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
};

export type TotpResult =
  | {ok: true; token: string; remaining: number; period: number}
  | {ok: false; error: string};

// Nhận vào chuỗi người dùng nhập (mã bí mật base32, hoặc link otpauth://)
// và trả về mã 6 số cùng số giây còn lại. Trả về null nếu chưa nhập gì.
export function computeTotp(
  input: string,
  opts: TotpOptions,
  nowMs: number,
): TotpResult | null {
  const raw = input.trim();
  if (!raw) return null;

  try {
    let totp: OTPAuth.TOTP;

    if (raw.toLowerCase().startsWith('otpauth://')) {
      // Người dùng dán nguyên link/QR dạng otpauth:// — lấy hết cấu hình từ đó.
      const parsed = OTPAuth.URI.parse(raw);
      if (!(parsed instanceof OTPAuth.TOTP)) {
        return {
          ok: false,
          error: 'Link này là dạng HOTP (theo lượt), công cụ chỉ hỗ trợ TOTP (theo thời gian).',
        };
      }
      totp = parsed;
    } else {
      // Trường hợp thường: chỉ là mã bí mật. Bỏ khoảng trắng, viết hoa cho chuẩn base32.
      const cleaned = raw.replace(/\s+/g, '').toUpperCase();
      const secret = OTPAuth.Secret.fromBase32(cleaned);
      totp = new OTPAuth.TOTP({
        secret,
        algorithm: opts.algorithm,
        digits: opts.digits,
        period: opts.period,
      });
    }

    const token = totp.generate({timestamp: nowMs});
    const period = totp.period;
    const remaining = period - (Math.floor(nowMs / 1000) % period);
    return {ok: true, token, remaining, period};
  } catch {
    return {
      ok: false,
      error: 'Mã bí mật chưa đúng. Mã hợp lệ chỉ gồm chữ A–Z và số 2–7 (không có số 0, 1, 8, 9).',
    };
  }
}

// Tách mã cho dễ đọc: "123456" -> "123 456", "12345678" -> "1234 5678".
export function formatToken(token: string): string {
  if (token.length === 6) return `${token.slice(0, 3)} ${token.slice(3)}`;
  if (token.length === 8) return `${token.slice(0, 4)} ${token.slice(4)}`;
  return token;
}
