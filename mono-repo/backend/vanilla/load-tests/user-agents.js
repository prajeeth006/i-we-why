const USER_AGENTS = [
    'Mozilla/5.0+(Linux;+Android+10;+K)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/127.0.0.0+Mobile+Safari/537.36',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+17_5_1+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Mobile/15E148',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+17_5_1+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Version/17.5+Mobile/15E148+Safari/604.1',
    'Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/127.0.0.0+Safari/537.36',
    'Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/127.0.0.0+Safari/537.36+Edg/127.0.0.0',
    'Mozilla/5.0+(Linux;+Android+10;+K)+AppleWebKit/537.36+(KHTML,+like+Gecko)+SamsungBrowser/25.0+Chrome/121.0.0.0+Mobile+Safari/537.36',
    'Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/120.0.0.0+Safari/537.36',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+17_6_1+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Mobile/15E148',
    'Mozilla/5.0+(Linux;+Android+10;+K)+AppleWebKit/537.36+(KHTML,+like+Gecko)+SamsungBrowser/26.0+Chrome/122.0.0.0+Mobile+Safari/537.36',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+17_6_1+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Version/17.6+Mobile/15E148+Safari/604.1',
    'Mozilla/5.0+(Macintosh;+Intel+Mac+OS+X+10_15_7)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Version/17.5+Safari/605.1.15',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+17_5+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+CriOS/127.0.6533.107+Mobile/15E148+Safari/604.1',
    'Mozilla/5.0+(X11;+CrOS+x86_64+14541.0.0)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/126.0.0.0+Safari/537.36',
    'Mozilla/5.0+(iPad;+CPU+OS+17_5_1+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Mobile/15E148',
    'Mozilla/5.0+(Linux;+Android+10;+K)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/127.0.0.0+Safari/537.36',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+16_7_8+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Mobile/15E148',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+16_7_8+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+Version/16.6+Mobile/15E148+Safari/604.1',
    'Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/126.0.0.0+Safari/537.36',
    'Mozilla/5.0+(iPhone;+CPU+iPhone+OS+17_5+like+Mac+OS+X)+AppleWebKit/605.1.15+(KHTML,+like+Gecko)+GSA/329.0.660098639+Mobile/15E148+Safari/604.1',
    'Mozilla/5.0+(X11;+Linux+x86_64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+HeadlessChrome/112.0.5615.29+Safari/537.36+Prerender+(+https://extractor.prerender.prod.env.works)',
    'Mozilla/5.0+(Linux;+Android+14;+SM-S911B+Build/UP1A.231005.007;+wv)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Version/4.0+Chrome/127.0.6533.103+Mobile+Safari/537.36',
    'Mozilla/5.0+(Linux;+Android+10;+K)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/126.0.0.0+Mobile+Safari/537.36',
    'Mozilla/5.0+(Linux;+Android+14;+SM-S918B+Build/UP1A.231005.007;+wv)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Version/4.0+Chrome/127.0.6533.103+Mobile+Safari/537.36',
    'Mozilla/5.0+(Linux;+Android+11;+Pixel+5)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/112.0.5615.29+Mobile+Safari/537.36+Prerender+(+https://extractor.prerender.prod.env.works)',
    'Mozilla/5.0+(Linux;+Android+14;+SM-S901B+Build/UP1A.231005.007;+wv)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Version/4.0+Chrome/127.0.6533.103+Mobile+Safari/537.36',
];

const USER_AGENTS_LAST_INDEX = USER_AGENTS.length - 1;

export const getUserAgent = (iteration) => {
    return USER_AGENTS[iteration % USER_AGENTS_LAST_INDEX];
};
