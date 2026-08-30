const SECURITY_TXT = `Contact: mailto:hello@nnovara.io
Expires: 2027-08-29T23:59:59Z
Preferred-Languages: ar, en
Canonical: https://nnovara.io/.well-known/security.txt
`;

export function GET() {
  return new Response(SECURITY_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
