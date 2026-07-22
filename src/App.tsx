import {useEffect, useState} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {y2kTheme} from '@astryxdesign/theme-y2k/built';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Button} from '@astryxdesign/core/Button';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Card} from '@astryxdesign/core/Card';
import {Banner} from '@astryxdesign/core/Banner';
import {Divider} from '@astryxdesign/core/Divider';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {computeTotp, formatToken, type TotpOptions} from './totp';
import {
  ShieldCheckIcon,
  CopyIcon,
  CheckIcon,
  TelegramIcon,
  InstagramIcon,
  GithubIcon,
} from './icons';

const EXAMPLE_SECRET = 'JBSWY3DPEHPK3PXP';

export default function App() {
  const [secret, setSecret] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  // Nhịp đồng hồ: cứ mỗi giây cập nhật thời gian để mã và vòng đếm ngược tự đổi.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Chuẩn phổ biến nhất, cũng là mặc định của hầu hết dịch vụ (Google, Facebook,
  // Binance...): 6 số, đổi mỗi 30 giây, thuật toán SHA1. Nếu người dùng dán link
  // otpauth:// thì cấu hình tự lấy từ link, không dùng mấy giá trị này.
  const opts: TotpOptions = {digits: 6, period: 30, algorithm: 'SHA1'};
  const result = computeTotp(secret, opts, now);

  const copyCode = async () => {
    if (result?.ok) {
      try {
        await navigator.clipboard.writeText(result.token);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* Nếu trình duyệt chặn clipboard thì bỏ qua, người dùng tự bôi đen copy. */
      }
    }
  };

  const remaining = result?.ok ? result.remaining : 0;
  const barVariant = remaining <= 5 ? 'error' : remaining <= 10 ? 'warning' : 'accent';

  return (
    <Theme theme={y2kTheme} mode="dark">
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <div style={{width: '100%', maxWidth: 460}}>
          <Card padding={6}>
            <VStack gap={5}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="center">
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheckIcon size={26} />
                  </span>
                  <Heading level={1}>2FA Live</Heading>
                </HStack>
                <Text type="body" color="secondary">
                  Dán mã bí mật, nhận ngay mã xác thực 2 bước 6 số — giống Google
                  Authenticator, nhưng chạy thẳng trên trình duyệt.
                </Text>
              </VStack>

              <Banner
                status="success"
                title="Riêng tư 100%"
                description="Mọi tính toán chạy trên máy bạn. Mã bí mật không được gửi lên mạng hay lưu lại ở đâu cả."
              />

              <VStack gap={2}>
                <TextInput
                  label="Mã bí mật (Secret Key)"
                  placeholder="Ví dụ: JBSW Y3DP EHPK 3PXP  —  hoặc dán link otpauth://"
                  value={secret}
                  onChange={setSecret}
                  status={
                    result && !result.ok
                      ? {type: 'error', message: result.error}
                      : undefined
                  }
                />
                <HStack gap={2}>
                  <Button
                    label="Thử mã ví dụ"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSecret(EXAMPLE_SECRET)}
                  />
                  {secret && (
                    <Button
                      label="Xóa"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSecret('')}
                    />
                  )}
                </HStack>
              </VStack>

              {result?.ok ? (
                <VStack gap={3}>
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: 'clamp(2.75rem, 13vw, 3.75rem)',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1.1,
                    }}
                  >
                    {formatToken(result.token)}
                  </div>

                  <ProgressBar
                    label="Thời gian còn lại"
                    value={result.remaining}
                    max={result.period}
                    variant={barVariant}
                    hasValueLabel
                    formatValueLabel={(v) => `Còn ${v} giây`}
                  />

                  <Button
                    label={copied ? 'Đã sao chép' : 'Sao chép mã'}
                    variant="primary"
                    icon={copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                    onClick={copyCode}
                  />
                </VStack>
              ) : (
                <Card padding={5}>
                  <Text type="body" color="secondary">
                    Nhập mã bí mật ở ô trên để bắt đầu tạo mã. Chưa có mã?
                    Bấm “Thử mã ví dụ” để xem thử.
                  </Text>
                </Card>
              )}

              <Divider />

              <VStack gap={2}>
                <Text type="supporting" color="secondary">
                  Có thắc mắc hay cần hỗ trợ? Nhắn mình nhé:
                </Text>
                <HStack gap={2} wrap="wrap" hAlign="center">
                  <Button
                    label="Telegram"
                    variant="secondary"
                    size="sm"
                    icon={<TelegramIcon />}
                    onClick={() =>
                      window.open(
                        'https://t.me/Benedetta24k',
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                  />
                  <Button
                    label="Instagram"
                    variant="secondary"
                    size="sm"
                    icon={<InstagramIcon />}
                    onClick={() =>
                      window.open(
                        'https://www.instagram.com/seahaven.agent/',
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                  />
                  <Button
                    label="GitHub"
                    variant="secondary"
                    size="sm"
                    icon={<GithubIcon />}
                    onClick={() =>
                      window.open(
                        'https://github.com/ThienPhuc-2005',
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                  />
                </HStack>
              </VStack>
            </VStack>
          </Card>
        </div>
      </main>
    </Theme>
  );
}
