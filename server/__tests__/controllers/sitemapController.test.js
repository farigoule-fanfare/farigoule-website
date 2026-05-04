// Tests dédiés au contrôleur sitemap
const sitemapCtrl = require('../../controllers/sitemapController');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.type = jest.fn(() => res);
  return res;
}

describe('sitemapController', () => {
  it('getSitemap renvoie un XML valide (200)', () => {
    const res = resMock();
    sitemapCtrl.getSitemap({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.type).toHaveBeenCalledWith('application/xml');
    expect(res.send).toHaveBeenCalled();
    const xml = res.send.mock.calls[0][0];
    expect(xml).toContain('<?xml');
    expect(xml).toContain('https://');
  });
});
