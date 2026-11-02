const fs = require('fs');
const path = require('path');
const https = require('https');

const repoDir = path.resolve(__dirname, '..');
const htmlDir = path.join(repoDir, 'public/html');
const extraImagesDir = path.join(repoDir, 'public/assets/extra');

if (!fs.existsSync(extraImagesDir)) fs.mkdirSync(extraImagesDir, { recursive: true });

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 200) {
      return resolve({ url, destPath, skipped: true });
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`Failed ${url}: HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ url, destPath, skipped: false });
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function run() {
  console.log('--- Step 1: Gathering Universal files ---');
  const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
  const universalPaths = new Set();
  htmlFiles.forEach(f => {
    const content = fs.readFileSync(path.join(htmlDir, f), 'utf8');
    const matches = content.match(/\/universal\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)*/g) || [];
    matches.forEach(m => {
      const clean = m.split('#')[0].split('?')[0];
      if (clean.length > 11) universalPaths.add(clean);
    });
  });

  console.log(`Found ${universalPaths.size} unique universal assets.`);
  for (const relPath of universalPaths) {
    const cdnUrl = 'https://assets.squarespace.com' + relPath;
    const localPath = path.join(repoDir, 'public', relPath);
    try {
      await downloadFile(cdnUrl, localPath);
    } catch {
      try {
        const fallbackUrl = 'https://www.lightscameralearn.org' + relPath;
        await downloadFile(fallbackUrl, localPath);
      } catch (err2) {
        console.error(`Error downloading universal asset ${relPath}:`, err2.message);
      }
    }
  }

  console.log('\n--- Step 2: Downloading Extra Images ---');
  // Check any remaining squarespace image references or extra filenames
  const missingUrls = [
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1548700339093-XY7BHNB1CDZYY94T9AIN/favicon.ico',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1554144866566-F7GXII0MXY0MZWH2BN63/7A3C7D18-C8AF-4BF7-B052-4B2EC44E02D7.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1554145571807-SP2CBOEX16JIBX70IXR8/IMG_6818.JPG',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1554145074276-08ERKIKXA3DM6ZOMPLZ8/Screen+Shot+2019-04-01+at+7.52.20+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1643918806191-2EGYEYSFF0VU2OASK01R/20210624-LCL+Taybah+Production+day+2-159.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1553167624447-ADJCC3CRV7KQLFKEFZ7C/Screen+Shot+2019-03-21+at+12.24.14+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1631734182449-QCE5M257EIXADCA3XEE5/20210624-LCL+Taybah+Production+day+2-151.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1537473889025-N6IURF16XOPN72YWUKPI/Tunis8.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552823812755-KAP0P6SYR0MZVYVK1JT1/IMG_5382.JPG',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552824512453-AMBTZA4WORAMISMYORFG/IMG_6257.JPG',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552839496501-MSKUVD2KSN1CKZD8QIB2/DSC_0248.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552825021831-JD2KM21KBH30957DQU5U/Screen+Shot+2019-03-17+at+1.15.58+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1643922273596-QTIHPKO20ZL9ROPSU8Y3/image-asset.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1643918834600-MD6Z3JZ903ZJTFA89BS3/20210625-LCL+Taybah+Wrap+up+day-61.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552755046597-RHSMXRWBK48TT0BNPKSD/Tunis',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552755159016-2CF7J0UQXB4ECE29WF0O/Sfax',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552755360357-3W7XX2H31099KM1IDXQJ/Sevilla',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552606066393-9EP6OKN4NZFZ4O270L43/DSC06508.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1662916443400-84K8DUZOSMMMG9V7SL62/20220620_LCL+Red+Carpet+Event+Jerash_090.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1495759285187-C3FAK84FVUP5SM75K4TB/13179437_800890973378663_2326728799384524684_n.jpg',
    'https://static1.squarespace.com/static/582f7e49e6f2e12eebc01f02/t/5c8d2a670852295f1fd86430/1552756917127/Sevilla',
    'https://static1.squarespace.com/static/582f7e49e6f2e12eebc01f02/t/5c8d2948e5e5f05150039c23/1552755612167/Tunis',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1497034694677-MYNA5XWBIWZZH9TS7REU/day2.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1524080899842-50YY7IRU88OIPV1WJGW9/applyimageLCL.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1551299158755-7JLIZ2AYH2NI3ROLRU9I/Screen+Shot+2019-02-27+at+10.24.29+AM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1537211470173-E6K17UEEU5EP5WSNW0BH/292A7838.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1537211579670-EO6JYFJRCQPLMYPWG5TU/Nazareth24.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1550267572145-H0KTQDXI00OU0Q1R2QEB/Screen+Shot+2019-02-15+at+12.52.53+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1535625208776-I5EAD935GPEFYAPAKLE3/Screen+Shot+2018-08-30+at+11.32.20+AM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1523711388473-VV6ZQT9YVVK1NXJ5PIZO/Screen+Shot+2018-04-14+at+2.07.36+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1552608969444-S2VNHH1NB9TD13AIF8ER/Screen+Shot+2018-02-18+at+10.43.20+AM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1554140109504-YJSXQYNO8QU62MDU89BD/Screen+Shot+2019-04-01+at+6.33.27+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1554140192491-A0Z7GJOSU1Q6WAU0ANIQ/Screen+Shot+2019-04-01+at+6.33.50+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1553414686581-96XZ5RGJWHCYCEY4MR4C/Screen+Shot+2019-03-24+at+9.00.08+AM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1553378570573-PPHP6JHX5N84LWBBL97C/Screen+Shot+2019-03-23+at+10.56.24+PM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1553509709680-PIDOXHNWQSRXG9OV52LK/Screen+Shot+2019-03-25+at+11.23.09+AM.png',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1553374307199-WRQYYVLJR2GWASA2RA28/Screen%2BShot%2B2019-03-23%2Bat%2B9.42.51%2BPM.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1497034926754-VED9WYYW8BUVEVEB2N7Y/Untitled+design-4.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1527508045912-C049WIJVRLT61ETJN05Y/JORDAN%40.JPG',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1661622573725-R4FAJXB3VX6SH6HNMXMT/_DSC1468.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1656518593789-K4JBV9I6VRN2T9SWSHJG/20220609_Arthur%27s+Amman+Tour_068.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1643914485812-VZV2CB8YT6ADFNJT7XB8/20210615-Training+day+one_3M-21.jpg',
    'https://images.squarespace-cdn.com/content/v1/582f7e49e6f2e12eebc01f02/1628022652962-QBYZ2Z7673BJE6HB20EN/ca9a1f3f-bdff-4174-aef3-20e4bc15a053.JPG'
  ];

  for (const url of missingUrls) {
    const rawFilename = url.split('/').pop().split('?')[0];
    const filename = decodeURIComponent(rawFilename);
    const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const dest = path.join(extraImagesDir, safeName);
    try {
      await downloadFile(url, dest);
    } catch (e) {
      console.warn(`Could not download ${url}: ${e.message}`);
    }
  }

  console.log('Done downloading assets!');
}

run().catch(console.error);
