/**
 * PDD 成本查询系统 - Cloudflare Workers
 * 基于飞书多维表格的产品成本查询系统
 */

const HTML_PAGE = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PDD 成本查询系统</title>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #F5F5F5;
  padding: 0;
  margin: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

h1 {
  font-size: 20px;
  color: #1565C0;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 600;
}

.logout-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  background-color: #EEEEEE;
  color: #666;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #FFCDD2;
  color: #C62828;
  border-color: #C62828;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  background: #FFF;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

#kw {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 14px;
}

#kw:focus {
  outline: none;
  border-color: #1565C0;
}

.search-btn {
  padding: 10px 20px;
  background-color: #1565C0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #0D47A1;
}

#result {
  min-height: 200px;
}

.product-card {
  background: #FFF;
  border-radius: 8px;
  padding: 0;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #EEE;
}

.card-content {
  padding: 16px;
}

.product-info {
  margin-bottom: 12px;
}

.product-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.4;
}

.brand {
  color: #1565C0;
  font-weight: 500;
  padding: 2px 6px;
  background-color: #E6F7FF;
  border-radius: 4px;
  margin-right: 8px;
}

.info-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  color: #888;
  margin-right: 4px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.wholesale-price {
  font-size: 15px;
  font-weight: 600;
  color: #C62828;
}

.supply-channel {
  padding: 4px 12px;
  background-color: #C62828;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.cost-cards-container {
  display: flex;
  gap: 10px;
}

.cost-card {
  flex: 1;
  background-color: #E3F2FD;
  padding: 12px;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .cards-grid .full-width {
    grid-column: 1 / -1;
  }
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.card-data {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.data-label {
  font-size: 11px;
  color: #777;
  text-align: center;
}

.data-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.data-value.cost {
  color: #1565C0;
}

.data-value.stock {
  color: #E65100;
}

.data-value.ship {
  color: #333;
}

.error {
  color: #C62828;
  font-weight: 600;
}

.warning {
  color: #E65100;
  font-weight: 600;
}

.stock-cards-container {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
}

.stock-card {
  padding: 12px;
  border-radius: 8px;
}

.stock-card.total-stock {
  background-color: #FFE0B2;
  padding: 20px;
  flex: 1;
}

.stock-card.ec-stock,
.stock-card.xf-stock {
  background-color: #FFCDD2;
  flex: 1;
}

.stock-card.ec-incoming,
.stock-card.xf-incoming {
  background-color: #EEEEEE;
  color: #C62828;
  flex: 1;
}

.shipment-cards-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.shipment-card {
  background-color: #C8E6C9;
  padding: 12px;
  border-radius: 8px;
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #777;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #777;
}
</style>
</head>
<body>
<div class="container">
  <button class="logout-btn" id="logoutBtn">登出</button>
  <h1>🧾 PDD 成本查询系统</h1>
  
  <div class="search-bar">
    <input id="kw" placeholder="输入商品编码或名称" onkeyup="if(event.key === 'Enter' || event.keyCode === 13) search()" />
    <button class="search-btn" onclick="search()">查询</button>
  </div>
  
  <div id="result"></div>
</div>

<script>
function checkAuth() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    window.location.href = '/login.html';
    return false;
  }
  return token;
}

document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_timestamp');
  window.location.href = '/login.html';
});

checkAuth();

async function search() {
  const kw = document.getElementById('kw').value;
  document.getElementById('result').innerHTML = '<div class="loading-state">📋 正在查询中，请稍候...</div>';
  
  try {
    const token = checkAuth();
    if (!token) return;
    
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({keyword: kw})
    });
    
    if (res.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_timestamp');
      window.location.href = '/login.html';
      return;
    }
    
    const data = await res.json();
    
    if (data.requiresLogin) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_timestamp');
      window.location.href = '/login.html';
      return;
    }
    
    if(data.success && data.data && Array.isArray(data.data)) {
      if(data.data.length === 0) {
        document.getElementById('result').innerHTML = '<div class="empty-state">❌ 未找到匹配的商品</div>';
      } else {
        document.getElementById('result').innerHTML = data.data.map(item => {
          const formatNumber = (value, decimals = 2) => {
            if (value === null || value === undefined || isNaN(Number(value))) {
              return '0';
            }
            return Number(value).toFixed(decimals);
          };
          
          const formatThousands = (value) => {
            if (value === null || value === undefined || isNaN(Number(value))) {
              return '0';
            }
            return Number(value).toLocaleString('zh-CN');
          };
          
          const totalInventoryValue = item['总库存'] < 0 ? 
            \`<span class="error">\${formatThousands(item.总库存)} (异常)</span>\` : 
            formatThousands(item.总库存);
          
          const formatCost = (value) => {
            if (value === '计算异常') {
              return \`<span class="warning">\${value}</span>\`;
            }
            return formatNumber(value);
          };
          
          return \`
          <div class="product-card">
            <div class="card-content">
              <div class="product-info">
                <div class="product-title">
                  \${item.品牌 ? \`\${item.品牌} \` : ''}\${item.商品名称 || '未知商品'}
                </div>
                <div class="info-meta">
                  <div class="info-item">
                    <span class="info-label">商品编码：</span>
                    <span class="info-value code">\${item['商品编码'] || '未知'}</span>
                  </div>
                  \${item['备案号'] ? \`
                  <div class="info-item">
                    <span class="info-label">备案号：</span>
                    <span class="info-value record">\${item['备案号']}</span>
                  </div>
                  \` : ''}
                  <div class="info-item">
                    <span class="info-label">更新时间：</span>
                    <span class="info-value">\${item.更新时间 || '未知'}</span>
                  </div>
                </div>
              </div>
              
              <div class="price-section">
                <div class="wholesale-price">
                  批发价：¥\${formatNumber(item.批发价)}
                </div>
                \${item['专供渠道'] ? \`
                <div class="supply-channel">
                  \${item['专供渠道']}
                </div>
                \` : ''}
              </div>
              
              <div class="cards-grid">
                <div class="cost-cards-container full-width">
                  <div class="cost-card">
                    <div class="card-title">成本信息-1件不亏本价格</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value cost">¥\${formatCost(item['单件总成本'])}</span>
                      </div>
                    </div>
                  </div>
                  <div class="cost-card">
                    <div class="card-title">成本信息-2件不亏本价格</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value cost">¥\${formatCost(item["2件总成本"])}</span>
                      </div>
                    </div>
                  </div>
                  <div class="cost-card">
                    <div class="card-title">成本信息-3件不亏本价格</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value cost">¥\${formatCost(item["3件总成本"])}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="stock-cards-container full-width">
                  <div class="stock-card total-stock" style="flex: 1; min-width: 100%;">
                    <div class="card-title">📦 总库存</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value stock" style="font-size: 2em;">\${totalInventoryValue}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="stock-cards-container full-width">
                  <div class="stock-card ec-stock">
                    <div class="card-title">📦 电商库存</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value stock">\${formatThousands(item.电商库存)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="stock-card xf-stock">
                    <div class="card-title">📦 兴富库存</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value stock">\${formatThousands(item.兴富库存)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="stock-cards-container full-width">
                  <div class="stock-card ec-incoming">
                    <div class="card-title">📦 电商待入库</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value stock">\${formatThousands(item.电商待入库)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="stock-card xf-incoming">
                    <div class="card-title">📦 兴富待入库</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value stock">\${formatThousands(item.兴富待入库)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="shipment-cards-container full-width">
                  <div class="shipment-card local-shipment">
                    <div class="card-title">🚚 省内运费</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value ship">¥\${formatNumber(item.广东省内邮费预估)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="shipment-card outside-shipment">
                    <div class="card-title">🚚 省外运费</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value ship">¥\${formatNumber(item.省外非偏远运费预估)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="shipment-card weight-info">
                    <div class="card-title">📦 单件重量</div>
                    <div class="card-data">
                      <div class="data-item">
                        <span class="data-value ship">\${formatNumber(item.单件重量KG, 3)}kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          \`;
        }).join('');
      }
    } else {
      document.getElementById('result').innerHTML = \`<div class="empty-state">❌ 查询失败: \${data.message || '未知错误'}</div>\`;
    }
  } catch (error) {
    document.getElementById('result').innerHTML = \`<div class="empty-state">⚠️ 网络请求失败，请检查网络连接或稍后重试</div>\`;
  }
}
</script>
</body>
</html>`;

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>登录 - PDD 成本查询系统</title>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #F5F5F5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #1565C0;
  margin-bottom: 8px;
  font-size: 24px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 14px;
}

input[type="password"]:focus {
  outline: none;
  border-color: #1565C0;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #1565C0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

button:hover {
  background-color: #0D47A1;
}

button:disabled {
  background-color: #90CAF9;
  cursor: not-allowed;
}

.error-message {
  color: #C62828;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
  display: none;
}

.footer {
  text-align: center;
  margin-top: 24px;
  color: #999;
  font-size: 12px;
}
</style>
</head>
<body>
<div class="login-container">
  <h1>🧾 PDD 成本查询系统</h1>
  <p class="subtitle">请输入访问密码</p>
  
  <form id="loginForm">
    <div class="form-group">
      <label for="password">密码</label>
      <input type="password" id="password" name="password" placeholder="请输入密码" required />
    </div>
    <button type="submit" id="loginBtn">登录</button>
    <p class="error-message" id="errorMessage"></p>
  </form>
  
  <p class="footer">请输入授权密码访问系统</p>
</div>

<script>
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  const errorMessage = document.getElementById('errorMessage');
  
  loginBtn.disabled = true;
  loginBtn.textContent = '登录中...';
  errorMessage.style.display = 'none';
  
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    
    const data = await res.json();
    
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_timestamp', Date.now().toString());
      window.location.href = '/';
    } else {
      errorMessage.textContent = data.message || '密码错误';
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    errorMessage.textContent = '登录失败，请稍后再试';
    errorMessage.style.display = 'block';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = '登录';
  }
});
</script>
</body>
</html>`;

/**
 * 验证认证 token
 * @param {string} authToken - 认证 token
 * @returns {boolean} - 是否有效
 */
function validateAuthToken(authToken) {
  if (!authToken) {
    return false;
  }
  
  try {
    const parts = authToken.split('-');
    if (parts.length < 2) {
      return false;
    }
    
    const timestamp = parseInt(parts[0]);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // 检查 token 是否在 24 小时内有效
    return (now - timestamp) < oneDay;
  } catch (error) {
    return false;
  }
}

/**
 * 验证密码
 * @param {string} password - 输入的密码
 * @returns {boolean} - 是否正确
 */
function validatePassword(password) {
  const validPasswords = [
    VALID_PASSWORD_1,
    VALID_PASSWORD_2,
    VALID_PASSWORD_3
  ].filter(p => p);
  
  return validPasswords.includes(password);
}

/**
 * 解析飞书字段
 * @param {Object} fields - 飞书返回的字段数据
 * @returns {Object} - 解析后的字段
 */
function parseFeishuFields(fields) {
  const result = {};
  
  for (const [key, obj] of Object.entries(fields)) {
    // 特殊处理商品编码字段
    if (key === '商品编码' && Array.isArray(obj)) {
      result[key] = obj[0]?.text || '';
      continue;
    }
    
    if (!obj || !obj.value) continue;
    
    // 特殊处理商品名称字段
    if (key === '商品名称' && obj.type === 1) {
      let fullName = '';
      obj.value.forEach(part => {
        if (part.text) {
          fullName += part.text;
        }
      });
      result[key] = fullName;
      continue;
    }
    
    // 严格按照规范的字段类型处理
    if (obj.type === 2 || obj.type === 20) {
      // 数字类型和公式类型
      result[key] = obj.value[0] ?? null;
    } 
    else if (obj.type === 1) {
      // 文本类型
      if (Array.isArray(obj.value)) {
        if (obj.value[0]?.text !== undefined) {
          result[key] = obj.value.map(part => part.text).join('');
        } else {
          result[key] = obj.value[0] ?? "";
        }
      } else {
        result[key] = obj.value ?? "";
      }
    } 
    else if (obj.type === 3) {
      // 关联/单选类型
      result[key] = obj.value[0] ?? "";
    } 
    else if (obj.type === 1002) {
      // 时间戳类型
      result[key] = new Date(obj.value[0]).toLocaleString("zh-CN", {hour12: false});
    } 
    else {
      // 其他类型
      result[key] = JSON.stringify(obj.value);
    }
  }
  
  return result;
}

/**
 * 获取飞书 tenant_access_token
 * @returns {Promise<string>} - tenant_access_token
 */
async function getTenantAccessToken() {
  const cacheKey = 'feishu_token';
  const cacheExpiryKey = 'feishu_token_expiry';
  
  // 检查缓存
  const cachedToken = await FEISHU_TOKEN_CACHE.get(cacheKey);
  const cachedExpiry = await FEISHU_TOKEN_CACHE.get(cacheExpiryKey);
  
  if (cachedToken && cachedExpiry && Date.now() < parseInt(cachedExpiry)) {
    return cachedToken;
  }
  
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: APP_ID,
        app_secret: APP_SECRET
      })
    });
    
    const data = await response.json();
    
    if (data.code === 0) {
      // 设置缓存（提前 5 分钟过期）
      const expiryTime = Date.now() + (data.expire * 1000) - 300000;
      await FEISHU_TOKEN_CACHE.put(cacheKey, data.tenant_access_token, { expirationTtl: data.expire - 300 });
      await FEISHU_TOKEN_CACHE.put(cacheExpiryKey, expiryTime.toString(), { expirationTtl: data.expire - 300 });
      
      return data.tenant_access_token;
    } else {
      throw new Error(`获取 tenant_access_token 失败: ${data.msg}`);
    }
  } catch (error) {
    console.error('获取 tenant_access_token 出错:', error);
    throw error;
  }
}

/**
 * 查询商品信息
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>} - 商品列表
 */
async function queryProducts(keyword) {
  const token = await getTenantAccessToken();
  
  const requestBody = {
    field_names: [
      "商品编码", "商品名称", "品牌", "备案号", "更新时间", "专供渠道",
      "批发价", "单件总成本", "2件总成本", "3件总成本",
      "总库存", "电商库存", "兴富库存", "电商待入库", "兴富待入库",
      "广东省内邮费预估", "省外非偏远运费预估", "单件重量KG"
    ],
    filter: {
      conjunction: "or",
      conditions: [
        {
          field_name: "商品编码",
          operator: "contains",
          value: [keyword]
        },
        {
          field_name: "商品名称",
          operator: "contains",
          value: [keyword]
        }
      ]
    },
    automatic_fields: false
  };
  
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records/search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  );
  
  const data = await response.json();
  
  if (data.code === 0) {
    const items = data.data.items || [];
    
    return items.map(item => {
      const parsedFields = parseFeishuFields(item.fields);
      
      // 过滤测试数据
      if (parsedFields['商品名称'] && parsedFields['商品名称'].endsWith('-0')) {
        return null;
      }
      
      // 处理成本异常值
      const costFields = ['单件总成本', '2件总成本', '3件总成本'];
      costFields.forEach(field => {
        if (parsedFields[field] && parsedFields[field] < -10000) {
          parsedFields[field] = '计算异常';
        }
      });
      
      // 库存负数标记
      if (parsedFields['总库存'] && parsedFields['总库存'] < 0) {
        parsedFields['库存状态'] = '库存异常';
      }
      
      // 确保数值字段有合理值
      const numericFields = ['批发价', '总库存', '电商库存', '兴富库存', '电商待入库', '兴富待入库', '单件重量KG', '广东省内邮费预估', '省外非偏远运费预估'];
      numericFields.forEach(field => {
        if (parsedFields[field] === null || parsedFields[field] === undefined) {
          parsedFields[field] = 0;
        }
      });
      
      return parsedFields;
    }).filter(item => item !== null);
  } else {
    throw new Error(`查询失败: ${data.msg}`);
  }
}

/**
 * 处理 fetch 请求
 * @param {Request} request - 请求对象
 * @returns {Response} - 响应对象
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token'
  };
  
  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // API 路由
  if (path === '/api/login' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { password } = body;
      
      if (!password) {
        return new Response(JSON.stringify({
          success: false,
          message: '请输入密码'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      
      if (validatePassword(password)) {
        const token = Date.now() + '-' + Math.random().toString(36).substring(2);
        return new Response(JSON.stringify({
          success: true,
          token: token,
          message: '登录成功',
          expireTime: 24
        }), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      } else {
        return new Response(JSON.stringify({
          success: false,
          message: '密码错误'
        }), {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '登录失败，请稍后再试'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
  if (path === '/api/query' && request.method === 'POST') {
    // 验证认证
    const authToken = request.headers.get('x-auth-token');
    
    if (!authToken || !validateAuthToken(authToken)) {
      return new Response(JSON.stringify({
        success: false,
        message: validateAuthToken(authToken) ? '未认证，请先登录' : '认证已过期，请重新登录',
        requiresLogin: true
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    try {
      const body = await request.json();
      const { keyword } = body;
      
      if (!keyword || keyword.trim() === '') {
        return new Response(JSON.stringify({
          success: false,
          message: '请输入查询关键词'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      
      const results = await queryProducts(keyword.trim());
      
      return new Response(JSON.stringify({
        success: true,
        data: results
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '查询失败，请稍后再试',
        error: error.message || String(error)
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
  // 静态页面路由
  if (path === '/' || path === '/index.html') {
    return new Response(HTML_PAGE, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    });
  }
  
  if (path === '/login.html') {
    return new Response(LOGIN_PAGE, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    });
  }
  
  // 404
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

// Cloudflare Worker 入口
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
