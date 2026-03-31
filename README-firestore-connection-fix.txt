إصلاح اتصال Firestore
- تم استبدال getFirestore بـ initializeFirestore
- تم تفعيل long polling لتقليل مشاكل QUIC/WebChannel
- مناسب لمشكلة ERR_QUIC_PROTOCOL_ERROR و Write stream errored
