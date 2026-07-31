// Vercel 会在请求经过它的全球网络节点时，自动根据访客 IP 附带这些地理位置请求头。
// 这个接口只是把这些请求头读出来，返回给前端页面使用，不需要连接任何第三方服务，
// 也不会有额外的调用次数限制。
module.exports = (req, res) => {
  const country = req.headers['x-vercel-ip-country'] || null;
  const region = req.headers['x-vercel-ip-country-region'] || null;
  const cityRaw = req.headers['x-vercel-ip-city'] || null;

  let city = null;
  if (cityRaw) {
    try {
      city = decodeURIComponent(cityRaw);
    } catch (e) {
      city = cityRaw;
    }
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ country, region, city });
};
