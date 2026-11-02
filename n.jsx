
// ================= Fanni App - Node.js Backend Structure =================
// Stack: Node.js + Express + Mongoose + Socket.io

// 1. models/Technician.js
const mongoose = require('mongoose');
const technicianSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  skills: [String], // ["lock_install", "plumbing"]
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] }, // [lng, lat]
  isOnline: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  wallet: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  commissionRates: {
    service: { type: Number, default: 0.20 }, // 20% على الخدمة
    product: { type: Number, default: 0.05 }  // 5% على القطع
  }
});
technicianSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Technician', technicianSchema);

// 2. models/AddonCatalog.js - كتالوج الإضافات اللي تتحكم فيه الإدارة
const addonSchema = new mongoose.Schema({
  addonId: { type: String, unique: true }, // drilling, cylinder_70mm, welding
  nameAr: String, // "حفر وتوسعة"
  nameEn: String,
  type: { type: String, enum: ['service', 'product'], default: 'service' },
  price: Number,
  isActive: { type: Boolean, default: true }
});
module.exports = mongoose.model('AddonCatalog', addonSchema);

// 3. models/Order.js - الطلب الأساسي
const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
  serviceType: String, // lock_install
  description: String,
  media: {
    doorImages: [String],
    lockImages: [String],
    video: String
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'on_the_way', 'inspecting', 'waiting_customer_approval', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  pricing: {
    basePrice: { type: Number, default: 80 },
    visitFee: { type: Number, default: 30 }, // رسوم المعاينة
    finalQuotation: {
      extras: [{
        addonId: String,
        name: String,
        type: { type: String, enum: ['service', 'product'] },
        price: Number,
        qty: Number
      }],
      totalPrice: Number,
      technicianNote: String,
      images: [String] // صور من موقع العمل
    }
  }
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);

// 4. models/Transaction.js - المحفظة والمحاسبة
const transactionSchema = new mongoose.Schema({
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  type: { type: String, enum: ['earning', 'product_sale', 'visit_fee', 'withdraw', 'penalty'] },
  breakdown: [{
    label: String,
    amount: Number,
    commissionRate: Number,
    commissionValue: Number,
    netToTechnician: Number
  }],
  totalAmount: Number,
  totalCommission: Number,
  netToTechnician: Number,
  paymentMethod: { type: String, enum: ['cash', 'in_app', 'wallet'] }
}, { timestamps: true });
module.exports = mongoose.model('Transaction', transactionSchema);

// 5. routes/orderRoutes.js - أهم API
// POST /api/orders - العميل ينشئ طلب
// POST /api/orders/:id/quotation - الفني يرسل تسعيرة نهائية
// POST /api/orders/:id/approve - العميل يوافق
// POST /api/orders/:id/complete - إنهاء الطلب وحساب المحفظة

// مثال API إرسال تسعيرة نهائية
/*
app.post('/api/orders/:id/quotation', async (req, res) => {
  const { extras, technicianNote, images } = req.body; // extras = [{addonId: 'drilling', qty: 1}]
  const order = await Order.findById(req.params.id);
  
  let totalExtras = 0;
  let enrichedExtras = [];
  for (let item of extras) {
    const catalogItem = await AddonCatalog.findOne({ addonId: item.addonId });
    enrichedExtras.push({
      addonId: catalogItem.addonId,
      name: catalogItem.nameAr,
      type: catalogItem.type,
      price: catalogItem.price,
      qty: item.qty
    });
    totalExtras += catalogItem.price * item.qty;
  }

  const totalPrice = order.pricing.basePrice + totalExtras;
  order.pricing.finalQuotation = { extras: enrichedExtras, totalPrice, technicianNote, images };
  order.status = 'waiting_customer_approval';
  await order.save();

  // إرسال Push للعميل
  io.to(`customer_${order.customerId}`).emit('new_quotation', { orderId: order._id, totalPrice, extras: enrichedExtras });
  
  res.json({ success: true, totalPrice });
});
*/

// 6. عند موافقة العميل وإكمال الطلب - حساب المحفظة
/*
async function settleOrder(orderId) {
  const order = await Order.findById(orderId).populate('technicianId');
  const tech = order.technicianId;
  let totalCommission = 0;
  let netToTech = 0;
  let breakdown = [];

  const allItems = [
    { label: 'سعر أساسي', amount: order.pricing.basePrice, type: 'service', rate: tech.commissionRates.service },
    ...order.pricing.finalQuotation.extras.map(e => ({ label: e.name, amount: e.price, type: e.type, rate: e.type === 'product' ? tech.commissionRates.product : tech.commissionRates.service }))
  ];

  for (let item of allItems) {
    const commission = item.amount * item.rate;
    const net = item.amount - commission;
    totalCommission += commission;
    netToTech += net;
    breakdown.push({ ...item, commissionValue: commission, netToTechnician: net });
  }

  await Transaction.create({
    technicianId: tech._id,
    orderId: order._id,
    type: 'earning',
    breakdown,
    totalAmount: order.pricing.finalQuotation.totalPrice,
    totalCommission,
    netToTechnician: netToTech
  });

  await Technician.updateOne({ _id: tech._id }, { $inc: { wallet: netToTech } });
}
*/
