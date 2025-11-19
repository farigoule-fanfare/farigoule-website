// Tests dédiés aux routes du sitemap

const express = require('express');
const request = require('supertest');

jest.mock('../../controllers/sitemapController', () => ({
  getSitemap: jest.fn((req, res) => res.status(200).end()),
}));
const sitemapCtrl = require('../../controllers/sitemapController');

const app = express();
app.use('/', require('../../routes/sitemapRoutes'));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('sitemapRoutes', () => {
  test('GET /sitemap.xml returns 200', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.status).toBe(200);
    expect(sitemapCtrl.getSitemap).toHaveBeenCalled();
  });
});
