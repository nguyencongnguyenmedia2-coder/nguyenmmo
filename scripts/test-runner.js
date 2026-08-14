const http = require('http');

async function findActivePort() {
  const ports = [3000, 3001, 3002];
  for (const port of ports) {
    try {
      const res = await new Promise((resolve) => {
        const req = http.get(`http://127.0.0.1:${port}/api/service-requests`, (r) => {
          resolve(r.statusCode);
        });
        req.on('error', () => resolve(null));
        req.setTimeout(1000, () => resolve(null));
      });
      if (res && res < 500) {
        return port;
      }
    } catch (e) {}
  }
  return 3000;
}

function makeRequest(port, options, postData) {
  return new Promise((resolve, reject) => {
    options.hostname = '127.0.0.1';
    options.port = port;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runAutoTests() {
  const PORT = await findActivePort();
  console.log(`🚀 === BẮT ĐẦU TỰ ĐỘNG CHẠY TEST HỆ THỐNG DIGITAL MMO (127.0.0.1:${PORT}) ===\n`);
  let passed = 0;
  let failed = 0;

  // Test 1: GET /api/services
  try {
    console.log('TEST 1: Kiểm tra API Danh mục Dịch vụ (/api/services)...');
    const res = await makeRequest(PORT, {
      path: '/api/services',
      method: 'GET',
    });
    const servicesList = Array.isArray(res.body) ? res.body : res.body?.data;
    if (res.statusCode === 200 && Array.isArray(servicesList)) {
      console.log(`✅ [SUCCESS] Lấy thành công ${servicesList.length} dịch vụ MMO.`);
      passed++;
    } else {
      console.log(`❌ [FAILED] API dịch vụ trả về status ${res.statusCode}`);
      failed++;
    }
  } catch (e) {
    console.log(`❌ [FAILED] Lỗi GET /api/services: ${e.message}`);
    failed++;
  }

  // Test 2: POST /api/service-requests (Khách đặt đơn hàng mới)
  let testCode = '';
  try {
    console.log('\nTEST 2: Kiểm tra Đặt đơn hàng mới từ phía Khách hàng (POST /api/service-requests)...');
    const payload = {
      guestName: 'Nguyễn Văn Test Auto',
      guestPhone: '0988777666',
      guestEmail: 'test.mmo@gmail.com',
      telegramUsername: '@test_mmo',
      facebookUsername: 'fb.com/testmmo',
      serviceId: 'smm-fb-like',
      serviceNameSnapshot: 'Tăng 1,000 Like Bài Viết Facebook VIP',
      categorySnapshot: 'FACEBOOK',
      targetUrl: 'https://facebook.com/posts/123456789',
      quantity: 1000,
      speed: '⚡ Nhanh',
      unitPrice: 50,
      estimatedPrice: 50000,
      customerNote: 'Đơn hàng thử nghiệm tự động test system',
    };

    const res = await makeRequest(
      PORT,
      {
        path: '/api/service-requests',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      payload
    );

    if (res.statusCode === 200 && res.body.success) {
      testCode = res.body.requestCode;
      console.log(`✅ [SUCCESS] Đặt đơn thành công! Mã đơn: #${testCode}`);
      passed++;
    } else {
      console.log(`❌ [FAILED] Đặt đơn thất bại:`, res.body);
      failed++;
    }
  } catch (e) {
    console.log(`❌ [FAILED] Lỗi kết nối POST /api/service-requests: ${e.message}`);
    failed++;
  }

  // Test 3: GET /api/service-requests (Kiểm tra hiển thị phía Admin & Người dùng)
  try {
    console.log('\nTEST 3: Kiểm tra Đồng bộ đơn hàng lên Admin & Trang Quản lý đơn hàng (GET /api/service-requests)...');
    const res = await makeRequest(PORT, {
      path: '/api/service-requests',
      method: 'GET',
    });

    if (res.statusCode === 200 && res.body.success && Array.isArray(res.body.data)) {
      const found = res.body.data.find((r) => r.requestCode === testCode);
      if (found) {
        console.log(`✅ [SUCCESS] Đơn hàng #${testCode} hiển thị chuẩn xác trong danh sách Server với trạng thái: ${found.status}`);
        passed++;
      } else {
        console.log(`❌ [FAILED] Không tìm thấy mã đơn #${testCode} trong danh sách!`);
        failed++;
      }
    } else {
      console.log(`❌ [FAILED] Lấy danh sách đơn thất bại:`, res.body);
      failed++;
    }
  } catch (e) {
    console.log(`❌ [FAILED] Lỗi kết nối GET /api/service-requests: ${e.message}`);
    failed++;
  }

  // Test 4: PATCH /api/service-requests (Admin cập nhật trạng thái đơn)
  try {
    console.log('\nTEST 4: Kiểm tra Admin Cập nhật Trạng thái đơn (PATCH /api/service-requests)...');
    const patchPayload = {
      requestCode: testCode,
      status: 'PROCESSING',
      adminNote: 'Admin đã duyệt đơn và bắt đầu chạy',
      assignedAdmin: 'Admin Nguyễn',
    };

    const res = await makeRequest(
      PORT,
      {
        path: '/api/service-requests',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      },
      patchPayload
    );

    if (res.statusCode === 200 && res.body.success) {
      console.log(`✅ [SUCCESS] Admin đã đổi trạng thái đơn #${testCode} thành ⚡ PROCESSING.`);
      passed++;
    } else {
      console.log(`❌ [FAILED] Admin đổi trạng thái thất bại:`, res.body);
      failed++;
    }
  } catch (e) {
    console.log(`❌ [FAILED] Lỗi PATCH /api/service-requests: ${e.message}`);
    failed++;
  }

  // Test 5: Verify status update reflected on user side
  try {
    console.log('\nTEST 5: Kiểm tra Người dùng nhận Trạng thái đã cập nhật Real-time (GET /api/service-requests?code=...)...');
    const res = await makeRequest(PORT, {
      path: `/api/service-requests?code=${testCode}`,
      method: 'GET',
    });

    if (res.statusCode === 200 && res.body.success && res.body.data) {
      const liveData = res.body.data;
      if (liveData.status === 'PROCESSING') {
        console.log(`✅ [SUCCESS] Trạng thái đơn phía Người dùng đã chuyển sang: ⚡ ${liveData.status}`);
        passed++;
      } else {
        console.log(`❌ [FAILED] Trạng thái người dùng chưa khớp: ${liveData.status}`);
        failed++;
      }
    } else {
      console.log(`❌ [FAILED] Không lấy được thông tin chi tiết đơn #${testCode}`);
      failed++;
    }
  } catch (e) {
    console.log(`❌ [FAILED] Lỗi kiểm tra đơn chi tiết: ${e.message}`);
    failed++;
  }

  console.log('\n==================================================');
  console.log(`🏁 TỔNG KẾT TỰ ĐỘNG TEST: PASS ${passed}/${passed + failed} | FAIL ${failed}/${passed + failed}`);
  console.log('==================================================\n');
}

runAutoTests();
