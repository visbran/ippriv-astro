/**
 * Blog topics: the reader-facing taxonomy.
 *
 * Article frontmatter keeps free-form `tags` (also used for meta keywords and
 * related posts). Those raw tags are inconsistent ("VPN" / "vpn",
 * "ip-lookup" / "IP lookup"), so the blog UI never shows them directly: each
 * raw tag is mapped to one of the topics below. Unknown tags are ignored by the
 * UI and reported by `scripts/check-content.mjs`; add them to TAG_TO_TOPIC.
 */

export const TOPICS = [
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'vpn', label: 'VPN' },
  { slug: 'proxies', label: 'Proxies' },
  { slug: 'fingerprinting', label: 'Fingerprinting' },
  { slug: 'ip-leaks', label: 'IP Leaks' },
  { slug: 'dns', label: 'DNS' },
  { slug: 'ip-addresses', label: 'IP Addresses' },
  { slug: 'networking', label: 'Networking' },
  { slug: 'ip-lookup', label: 'IP Lookup & Geolocation' },
  { slug: 'detection', label: 'VPN & Bot Detection' },
  { slug: 'reputation', label: 'Reputation & Fraud' },
  { slug: 'security', label: 'Security' },
  { slug: 'api', label: 'API & Developers' },
] as const;

export type TopicSlug = (typeof TOPICS)[number]['slug'];

export const TAG_TO_TOPIC: Record<string, TopicSlug> = {
  // privacy
  'privacy': 'privacy',
  'online privacy': 'privacy',
  'internet privacy': 'privacy',
  'privacy tools': 'privacy',
  'data retention': 'privacy',
  'surveillance': 'privacy',
  'isp tracking': 'privacy',
  'data tracking': 'privacy',
  'tracking': 'privacy',
  'anti-tracking': 'privacy',
  'tracking prevention': 'privacy',
  'firefox privacy': 'privacy',
  'tor browser': 'privacy',
  'tor': 'privacy',
  'vpn privacy': 'privacy',
  'ip masking': 'privacy',
  'ipv6 privacy extensions': 'privacy',
  // vpn
  'vpn': 'vpn',
  'free vpn': 'vpn',
  'vpn alternatives': 'vpn',
  'wireguard': 'vpn',
  'openvpn': 'vpn',
  'ikev2': 'vpn',
  'vpn protocol': 'vpn',
  'proxy vs vpn': 'vpn',
  // proxies
  'proxy': 'proxies',
  'proxies': 'proxies',
  'residential proxies': 'proxies',
  'proxy authentication': 'proxies',
  'proxy setup': 'proxies',
  'proxy types': 'proxies',
  'socks5 proxy': 'proxies',
  'anonymous proxy': 'proxies',
  'proxy server': 'proxies',
  'web scraping': 'proxies',
  'automation': 'proxies',
  'anti-detect': 'proxies',
  // fingerprinting
  'fingerprinting': 'fingerprinting',
  'browser fingerprinting': 'fingerprinting',
  'anti-fingerprinting': 'fingerprinting',
  'fingerprint protection': 'fingerprinting',
  'device fingerprinting': 'fingerprinting',
  'hardware fingerprint': 'fingerprinting',
  'os fingerprint': 'fingerprinting',
  'system fingerprint': 'fingerprinting',
  'hardware sensors': 'fingerprinting',
  'device tracking': 'fingerprinting',
  'fingerprinting vectors': 'fingerprinting',
  'crawler fingerprint': 'fingerprinting',
  'webrtc': 'fingerprinting',
  'browser security': 'fingerprinting',
  // ip leaks
  'ip leak': 'ip-leaks',
  'ip-leak': 'ip-leaks',
  'dns leak': 'ip-leaks',
  'webrtc leak': 'ip-leaks',
  'vpn leaks': 'ip-leaks',
  // dns
  'dns': 'dns',
  'dns privacy': 'dns',
  'privacy dns': 'dns',
  'dnscrypt': 'dns',
  'quad9': 'dns',
  'nextdns': 'dns',
  'encrypted dns': 'dns',
  'doh': 'dns',
  'dot': 'dns',
  'dns security': 'dns',
  // ip addresses
  'ip address': 'ip-addresses',
  'ip-address': 'ip-addresses',
  'ip type comparison': 'ip-addresses',
  'static ip': 'ip-addresses',
  'dynamic ip': 'ip-addresses',
  'dedicated ip': 'ip-addresses',
  'datacenter ip': 'ip-addresses',
  'datacenter': 'ip-addresses',
  'residential ip': 'ip-addresses',
  'mobile ip': 'ip-addresses',
  'desktop ip': 'ip-addresses',
  'ip differences': 'ip-addresses',
  'ipv6': 'ip-addresses',
  'mobile': 'ip-addresses',
  'android': 'ip-addresses',
  'ios': 'ip-addresses',
  'apple': 'ip-addresses',
  'ip spoofing': 'ip-addresses',
  // networking
  'networking': 'networking',
  'network': 'networking',
  'nat': 'networking',
  'cgnat': 'networking',
  'dhcp': 'networking',
  'isp': 'networking',
  'asn': 'networking',
  'bgp': 'networking',
  'whois': 'networking',
  'isp throttling': 'networking',
  'network speed': 'networking',
  'bandwidth': 'networking',
  'speed test': 'networking',
  'web hosting': 'networking',
  // ip lookup & geolocation
  'ip lookup': 'ip-lookup',
  'ip-lookup': 'ip-lookup',
  'geolocation': 'ip-lookup',
  'ip geolocation': 'ip-lookup',
  'accuracy': 'ip-lookup',
  'ip detection': 'ip-lookup',
  'information': 'ip-lookup',
  // detection
  'detection': 'detection',
  'vpn detection': 'detection',
  'proxy detection': 'detection',
  'bot detection': 'detection',
  'search engine crawler': 'detection',
  'googlebot': 'detection',
  'ai crawler': 'detection',
  'seo': 'detection',
  // reputation & fraud
  'ip reputation': 'reputation',
  'ip blacklist': 'reputation',
  'blacklist check': 'reputation',
  'blacklist': 'reputation',
  'spamhaus': 'reputation',
  'rbl': 'reputation',
  'email deliverability': 'reputation',
  'spam': 'reputation',
  'threat intelligence': 'reputation',
  'fraud prevention': 'reputation',
  'fraud detection': 'reputation',
  'ecommerce': 'reputation',
  'payment security': 'reputation',
  'chargeback prevention': 'reputation',
  // security
  'security': 'security',
  'network security': 'security',
  'network-security': 'security',
  'web security': 'security',
  'online security': 'security',
  'server security': 'security',
  'cyberattack': 'security',
  'packet filtering': 'security',
  'port probe': 'security',
  'public-wifi': 'security',
  // api & developers
  'api': 'api',
  'developer guide': 'api',
  'development': 'api',
  'free tools': 'api',
};

// Too generic to say what an article is about.
export const IGNORED_TAGS = new Set(['tutorial', 'guide']);

const normalize = (tag: string) => tag.trim().toLowerCase();

export function topicFromTag(tag: string): TopicSlug | undefined {
  return TAG_TO_TOPIC[normalize(tag)];
}

export function topicLabel(slug: string): string {
  return TOPICS.find((t) => t.slug === slug)?.label ?? slug;
}

/** Unique topics for an article, in the order its tags list them. */
export function topicsForTags(tags: string[]): TopicSlug[] {
  const seen = new Set<TopicSlug>();
  for (const tag of tags) {
    const topic = topicFromTag(tag);
    if (topic) seen.add(topic);
  }
  return [...seen];
}

/** Resolve a ?tag= value: a topic slug, or a legacy raw tag from old links. */
export function resolveTopic(value: string): TopicSlug | undefined {
  const v = normalize(value);
  return TOPICS.find((t) => t.slug === v)?.slug ?? topicFromTag(v);
}

export interface TopicCount {
  slug: TopicSlug;
  label: string;
  count: number;
}

export function countTopics(postTopics: TopicSlug[][]): TopicCount[] {
  return TOPICS.map((t) => ({
    slug: t.slug,
    label: t.label,
    count: postTopics.filter((topics) => topics.includes(t.slug)).length,
  }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);
}
