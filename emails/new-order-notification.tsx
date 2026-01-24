/**
 * New Order Notification Email Template
 *
 * Sent to Gary (alienation2innovation@gmail.com) when a customer
 * places a new commercial order for manual fulfillment.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewOrderNotificationEmailProps {
  productionId: string;
  customerName: string;
  customerEmail: string;
  accountId: string;
  title: string;
  script: string;
  targetAudience?: string;
  brandVoice?: string;
  format?: string;
  duration?: number;
  priority: string;
  tokensUsed: number;
  timestamp: Date;
}

export default function NewOrderNotificationEmail({
  productionId = 'prod_abc123',
  customerName = 'John Doe',
  customerEmail = 'john@example.com',
  accountId = 'acc_xyz789',
  title = 'Summer Sale Campaign',
  script = 'This is the commercial script...',
  targetAudience = 'Small business owners',
  brandVoice = 'Professional yet friendly',
  format = '16:9',
  duration = 64,
  priority = 'STANDARD',
  tokensUsed = 1,
  timestamp = new Date(),
}: NewOrderNotificationEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.barriosa2i.com';
  const dashboardUrl = `${baseUrl}/dashboard/lab?production=${productionId}`;
  const formattedTime = timestamp.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <Html>
      <Head />
      <Preview>New Commercial Order: {title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>BARRIOS A2I</Text>
            <Text style={tagline}>New Order Notification</Text>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertText}>NEW ORDER RECEIVED</Text>
          </Section>

          {/* Order Info */}
          <Section style={infoSection}>
            <Heading style={sectionHeading}>Order Details</Heading>
            <Text style={infoRow}>
              <span style={label}>Production ID:</span> {productionId}
            </Text>
            <Text style={infoRow}>
              <span style={label}>Status:</span>{' '}
              <span style={statusBadge}>QUEUED</span>
            </Text>
            <Text style={infoRow}>
              <span style={label}>Order Time:</span> {formattedTime}
            </Text>
            <Text style={infoRow}>
              <span style={label}>Priority:</span> {priority}
            </Text>
            <Text style={infoRow}>
              <span style={label}>Tokens Used:</span> {tokensUsed}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Customer Info */}
          <Section style={infoSection}>
            <Heading style={sectionHeading}>Customer</Heading>
            <Text style={infoRow}>
              <span style={label}>Name:</span> {customerName}
            </Text>
            <Text style={infoRow}>
              <span style={label}>Email:</span>{' '}
              <Link href={`mailto:${customerEmail}`} style={linkCyan}>
                {customerEmail}
              </Link>
            </Text>
            <Text style={infoRow}>
              <span style={label}>Account ID:</span> {accountId}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Creative Brief */}
          <Section style={infoSection}>
            <Heading style={sectionHeading}>Creative Brief</Heading>
            <Text style={infoRow}>
              <span style={label}>Title:</span>
            </Text>
            <Text style={briefContent}>{title}</Text>

            <Text style={infoRow}>
              <span style={label}>Script:</span>
            </Text>
            <Text style={scriptBox}>{script}</Text>

            {targetAudience && (
              <>
                <Text style={infoRow}>
                  <span style={label}>Target Audience:</span>
                </Text>
                <Text style={briefContent}>{targetAudience}</Text>
              </>
            )}

            {brandVoice && (
              <>
                <Text style={infoRow}>
                  <span style={label}>Brand Voice:</span>
                </Text>
                <Text style={briefContent}>{brandVoice}</Text>
              </>
            )}

            <Text style={infoRow}>
              <span style={label}>Format:</span> {format}
            </Text>
            <Text style={infoRow}>
              <span style={label}>Duration:</span> {duration} seconds
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Action Button */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={dashboardUrl}>
              View in Dashboard
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This order is awaiting manual fulfillment.
            </Text>
            <Text style={footerLegal}>
              Barrios A2I Commercial Lab
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

const main: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '0 20px',
  maxWidth: '600px',
};

const header: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const logoText: React.CSSProperties = {
  color: '#00CED1',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 4px 0',
  letterSpacing: '2px',
};

const tagline: React.CSSProperties = {
  color: '#71717a',
  fontSize: '12px',
  margin: 0,
};

const alertBanner: React.CSSProperties = {
  backgroundColor: '#D4AF37',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const alertText: React.CSSProperties = {
  color: '#000000',
  fontSize: '16px',
  fontWeight: '700',
  margin: 0,
  letterSpacing: '1px',
};

const infoSection: React.CSSProperties = {
  marginBottom: '16px',
};

const sectionHeading: React.CSSProperties = {
  color: '#00CED1',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const infoRow: React.CSSProperties = {
  color: '#e4e4e7',
  fontSize: '14px',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const label: React.CSSProperties = {
  color: '#71717a',
};

const statusBadge: React.CSSProperties = {
  backgroundColor: '#D4AF37',
  color: '#000000',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '600',
};

const linkCyan: React.CSSProperties = {
  color: '#00CED1',
  textDecoration: 'none',
};

const briefContent: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0 0 16px 0',
  lineHeight: '1.6',
};

const scriptBox: React.CSSProperties = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '13px',
  padding: '16px',
  margin: '0 0 16px 0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
};

const divider: React.CSSProperties = {
  borderColor: '#27272a',
  margin: '24px 0',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const ctaButton: React.CSSProperties = {
  backgroundColor: '#00CED1',
  color: '#000000',
  padding: '14px 32px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
};

const footer: React.CSSProperties = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const footerText: React.CSSProperties = {
  color: '#71717a',
  fontSize: '12px',
  margin: '0 0 8px 0',
};

const footerLegal: React.CSSProperties = {
  color: '#52525b',
  fontSize: '11px',
  margin: 0,
};
