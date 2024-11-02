function formatPhoneNumber() {
  const input = document.getElementById('phone');
  let value = input.value.replace(/-/g, ''); // ลบเครื่องหมาย '-'
  if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
  }
  input.value = value;
}

// ปรับขนาดกล่องกรอกหมายเลขตามข้อความที่พิมพ์
function adjustInputWidth() {
  const input = document.getElementById('phone');
  const textLength = input.value.length;
  const newWidth = Math.max(120, (textLength + 1) * 10); // กำหนดขนาดขั้นต่ำที่ 120px

  input.style.width = `${newWidth}px`;
}

async function checkQueueByPhone() {
  const date = new Date();
  const day = date.getDate();
  const phone = document.getElementById('phone').value.trim();

  if (!phone) {
      alert("กรุณาใส่หมายเลขโทรศัพท์ก่อนค้นหา");
      return;
  }

  const url = `https://api.sheety.co/25ff2e857df4f34f5806ee6b417ce251/สำเนาของBookingNovenber2024/${day}`;

  // แสดงหน้าต่างโหลดข้อมูล
  document.getElementById('loader').style.display = 'flex';

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': 'Basic VGhlZXJhbmFpOktodW5oYW4=',
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const bookings = data[day] || [];
      const booking = bookings.find(b => b.phone === phone);

      if (booking) {
          displayBookingInfo(booking, bookings);
      } else {
          document.getElementById('result').innerText = 'ไม่พบข้อมูลสำหรับหมายเลขโทรศัพท์นี้';
      }

  } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error.message);
      document.getElementById('result').innerText = `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`;
  } finally {
      // ซ่อนหน้าต่างโหลดข้อมูล
      document.getElementById('loader').style.display = 'none';
  }
}

function displayBookingInfo(booking, bookings) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  const isFinished = booking.finish === 1;
  const isCanceled = booking.cancel === 1;
  let statusMessage;
  let qNumberMessage = booking.qNumber || 'ไม่ระบุ';

  if (isCanceled) {
      statusMessage = 'ลูกค้ายกเลิกแล้ว';
  } else if (isFinished) {
      statusMessage = 'สำเร็จแล้ว';
  } else {
      statusMessage = 'ยังไม่สำเร็จ';
      const pendingBookings = bookings.filter(b => b.finish !== 1 && b.cancel !== 1);
      const queueIndex = pendingBookings.findIndex(b => b.id === booking.id);
      if (queueIndex !== -1) {
          qNumberMessage = queueIndex;
      }
  }

  const bookingInfo = `
      <div class="booking-info">
          <strong>ชื่อ:</strong> ${booking.name || 'ไม่ระบุ'}<br>
          <strong>หมายเลขโทรศัพท์:</strong> ${booking.phone || 'ไม่ระบุ'}<br>
          <strong>เวลาในการจอง:</strong> ${booking.booking || 'ไม่ระบุ'}<br>
          <strong>หมายเลขคิว:</strong> ${qNumberMessage}<br>
          <strong>สถานะ:</strong> ${statusMessage}<br>
          <strong>จำนวนลูกค้า:</strong> ${booking.customer || 'ไม่ระบุ'}
      </div>
  `;
  resultDiv.innerHTML = bookingInfo;
}

document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("typing-header");
  const text = "maple tree house bkk Queq";
  let index = 0;

  function typeText() {
      if (index < text.length) {
          header.textContent += text[index];
          index++;
          setTimeout(typeText, 100); // ควบคุมความเร็วการพิมพ์
      } else {
          header.style.borderRight = "none"; // เอาเส้นกระพริบออกเมื่อพิมพ์เสร็จ
      }
  }

  setTimeout(typeText, 500); // เริ่มพิมพ์หลังจากหน่วงเวลาเล็กน้อย
});
