import { FaCheckCircle, FaBox, FaArrowRight } from 'react-icons/fa';

const OrderSuccess=()=> {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse" style={{ backgroundColor: '#ff8029' }}></div>
              <div className="relative rounded-full p-6" style={{ background: 'linear-gradient(135deg, #ff8029 0%, #ffaa29 100%)' }}>
                <FaCheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>

          {/* Order Details Box */}
          <div className="rounded-xl p-6 mb-8 border" style={{ 
            background: 'linear-gradient(135deg, rgba(255, 128, 41, 0.1) 0%, rgba(255, 170, 41, 0.1) 100%)',
            borderColor: 'rgba(255, 128, 41, 0.2)'
          }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaBox className="w-5 h-5" style={{ color: '#ff8029' }} />
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Order Number
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              #ORD-{Math.floor(Math.random() * 90000) + 10000}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              className="w-full text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #ff8029 0%, #ffaa29 100%)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #e67024 0%, #e69924 100%)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ff8029 0%, #ffaa29 100%)'}
            >
              Track Your Order
              <FaArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300">
              Continue Shopping
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            A confirmation email has been sent to your inbox
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? <a href="#" className="font-semibold hover:underline" style={{ color: '#ff8029' }}>Contact Support</a>
        </p>
      </div>
    </div>
  );
}
export default OrderSuccess;