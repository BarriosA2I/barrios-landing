/**
 * Production Complete Email Template (v2)
 *
 * Cyberpunk-themed React Email template for Commercial Lab.
 * Mulligan button now links to feedback page where customers
 * can specify exactly what they want changed.
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Img,
  Link,
  Hr,
  Preview,
} from "@react-email/components";

interface ProductionCompleteEmailProps {
  customerName: string;
  productionTitle: string;
  thumbnailUrl?: string;
  videoUrl: string;
  downloadHdUrl?: string;
  downloadSdUrl?: string;
  mulliganToken: string;
  dashboardUrl: string;
  processingMinutes?: number;
}

export default function ProductionCompleteEmail({
  customerName = "Customer",
  productionTitle = "Your Commercial",
  thumbnailUrl,
  videoUrl = "#",
  downloadHdUrl,
  downloadSdUrl,
  mulliganToken = "ABC123-XYZ789",
  dashboardUrl = "#",
  processingMinutes,
}: ProductionCompleteEmailProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.barriosa2i.com";

  // Link to FEEDBACK PAGE (not direct API)
  const mulliganUrl = `${baseUrl}/mulligan/${mulliganToken}`;

  return (
    <Html>
      <Head />
      <Preview>
        Your commercial &quot;{productionTitle}&quot; is ready for download
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Heading style={logoStyle}>BARRIOS A2I</Heading>
            <Text style={taglineStyle}>Commercial Lab</Text>
          </Section>

          {/* Main Content */}
          <Section style={contentStyle}>
            <Heading style={headingStyle}>
              Your commercial is ready, {customerName}!
            </Heading>

            <Text style={textStyle}>
              <strong style={{ color: "#00CED1" }}>{productionTitle}</strong> has
              been crafted by our AI production pipeline.
              {processingMinutes
                ? ` Completed in ${processingMinutes} minutes.`
                : ""}
            </Text>

            {/* Video Thumbnail */}
            {thumbnailUrl && (
              <Link href={videoUrl}>
                <Img
                  src={thumbnailUrl}
                  alt="Video Preview"
                  style={thumbnailStyle}
                />
              </Link>
            )}

            {/* Download Buttons */}
            <Section style={buttonContainerStyle}>
              {downloadHdUrl && (
                <Button href={downloadHdUrl} style={primaryButtonStyle}>
                  Download HD
                </Button>
              )}
              {downloadSdUrl && (
                <Button href={downloadSdUrl} style={secondaryButtonStyle}>
                  Download SD
                </Button>
              )}
            </Section>

            <Hr style={dividerStyle} />

            {/* Mulligan Section - Now links to feedback page */}
            <Section style={mulliganSectionStyle}>
              <Heading as="h3" style={mulliganHeadingStyle}>
                Not quite right?
              </Heading>
              <Text style={mulliganTextStyle}>
                Every production includes{" "}
                <strong style={{ color: "#D4AF37" }}>one free mulligan</strong>.
                Tell us what you&apos;d like changed and we&apos;ll recreate
                your commercial.
              </Text>
              <Button href={mulliganUrl} style={mulliganButtonStyle}>
                USE YOUR MULLIGAN
              </Button>
              <Text style={mulliganHintStyle}>
                You&apos;ll be able to specify exactly what you want different —
                pacing, colors, voice, messaging, and more.
              </Text>
            </Section>

            <Hr style={dividerStyle} />

            {/* Dashboard Link */}
            <Text style={linkTextStyle}>
              <Link href={dashboardUrl} style={linkStyle}>
                View in Dashboard &rarr;
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Barrios A2I | Commercial Lab
              <br />
              <Link href="https://www.barriosa2i.com" style={footerLinkStyle}>
                www.barriosa2i.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ============================================================================
// Styles
// ============================================================================

const bodyStyle = {
  backgroundColor: "#0A0A0F",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "40px 20px",
};

const containerStyle = {
  backgroundColor: "#0B1220",
  border: "1px solid rgba(0, 206, 209, 0.2)",
  borderRadius: "16px",
  maxWidth: "600px",
  margin: "0 auto",
  overflow: "hidden" as const,
};

const headerStyle = {
  padding: "32px 40px",
  borderBottom: "1px solid rgba(0, 206, 209, 0.1)",
};

const logoStyle = {
  color: "#00CED1",
  fontSize: "28px",
  fontWeight: 700,
  letterSpacing: "-0.5px",
  margin: 0,
};

const taglineStyle = {
  color: "#6B7280",
  fontSize: "14px",
  margin: "8px 0 0",
};

const contentStyle = {
  padding: "40px",
};

const headingStyle = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: 600,
  margin: "0 0 16px",
};

const textStyle = {
  color: "#9CA3AF",
  fontSize: "16px",
  lineHeight: 1.6,
  margin: "0 0 24px",
};

const thumbnailStyle = {
  display: "block" as const,
  width: "100%",
  borderRadius: "12px",
  border: "1px solid rgba(0, 206, 209, 0.2)",
  marginBottom: "24px",
};

const buttonContainerStyle = {
  marginBottom: "32px",
};

const primaryButtonStyle = {
  backgroundColor: "#00CED1",
  color: "#000000",
  padding: "14px 24px",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "14px",
  textDecoration: "none" as const,
  display: "inline-block" as const,
  marginRight: "12px",
};

const secondaryButtonStyle = {
  backgroundColor: "rgba(0, 206, 209, 0.1)",
  color: "#00CED1",
  padding: "14px 24px",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "14px",
  textDecoration: "none" as const,
  display: "inline-block" as const,
  border: "1px solid rgba(0, 206, 209, 0.3)",
};

const dividerStyle = {
  borderColor: "rgba(0, 206, 209, 0.1)",
  margin: "24px 0",
};

const mulliganSectionStyle = {
  backgroundColor: "rgba(212, 175, 55, 0.1)",
  border: "1px solid rgba(212, 175, 55, 0.3)",
  borderRadius: "12px",
  padding: "24px",
};

const mulliganHeadingStyle = {
  color: "#D4AF37",
  fontSize: "18px",
  fontWeight: 600,
  margin: "0 0 12px",
};

const mulliganTextStyle = {
  color: "#9CA3AF",
  fontSize: "14px",
  lineHeight: 1.5,
  margin: "0 0 16px",
};

const mulliganButtonStyle = {
  background: "linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)",
  backgroundColor: "#D4AF37",
  color: "#000000",
  padding: "14px 32px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "14px",
  textDecoration: "none" as const,
  display: "inline-block" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const mulliganHintStyle = {
  color: "#78716c",
  fontSize: "12px",
  margin: "16px 0 0 0",
  lineHeight: 1.5,
};

const linkTextStyle = {
  margin: 0,
};

const linkStyle = {
  color: "#00CED1",
  textDecoration: "none" as const,
  fontSize: "14px",
};

const footerStyle = {
  padding: "24px 40px",
  borderTop: "1px solid rgba(0, 206, 209, 0.1)",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
};

const footerTextStyle = {
  color: "#6B7280",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: 0,
};

const footerLinkStyle = {
  color: "#00CED1",
  textDecoration: "none" as const,
};
