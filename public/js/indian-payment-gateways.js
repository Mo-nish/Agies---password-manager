/**
 * Indian Payment Gateways for Agies Password Manager
 * PhonePe, UPI, SBI Bank Transfer, and other Indian payment methods
 */

class IndianPaymentGateways {
    constructor() {
        this.isInitialized = false;
        this.gateways = new Map();
        this.upiApps = [];
        this.bankAccounts = [];
        this.paymentHistory = [];
        this.init();
    }

    async init() {
        try {
            await this.setupUPIGateways();
            await this.setupPhonePe();
            await this.setupBankTransfers();
            await this.setupPaymentHistory();
            this.isInitialized = true;
            console.log('✅ Indian Payment Gateways initialized');
        } catch (error) {
            console.error('❌ Indian payment initialization failed:', error);
        }
    }

    // Setup UPI gateways
    async setupUPIGateways() {
        this.upiApps = [
            {
                id: 'phonepe',
                name: 'PhonePe',
                icon: '📱',
                upiId: 'agies@ybl',
                description: 'Fast UPI payments with PhonePe'
            },
            {
                id: 'gpay',
                name: 'Google Pay',
                icon: '📱',
                upiId: 'agies@okicici',
                description: 'Secure Google Pay UPI'
            },
            {
                id: 'paytm',
                name: 'Paytm',
                icon: '📱',
                upiId: 'agies@paytm',
                description: 'Paytm UPI payments'
            },
            {
                id: 'bhim',
                name: 'BHIM',
                icon: '🏦',
                upiId: 'agies@upi',
                description: 'Government BHIM UPI'
            }
        ];
    }

    // Setup PhonePe integration
    async setupPhonePe() {
        this.gateways.set('phonepe', {
            name: 'PhonePe',
            type: 'upi',
            icon: '📱',
            description: 'India\'s leading UPI payment app',
            features: [
                'Instant UPI payments',
                'QR code scanning',
                'Bill payments',
                'Recharge & utilities'
            ],
            integration: {
                merchantId: 'MERCHANT_AGIES_001',
                appId: 'AGIES_PASSWORD_MANAGER',
                environment: 'production'
            }
        });
    }

    // Setup bank transfer options
    async setupBankTransfers() {
        this.bankAccounts = [
            {
                id: 'sbi_main',
                bank: 'State Bank of India',
                accountNumber: '12345678901',
                ifscCode: 'SBIN0001234',
                accountType: 'Current Account',
                branch: 'Mumbai Main Branch',
                accountHolder: 'Agies Technologies Pvt Ltd',
                description: 'Main business account for subscriptions'
            },
            {
                id: 'hdfc_operational',
                bank: 'HDFC Bank',
                accountNumber: '98765432109',
                ifscCode: 'HDFC0000987',
                accountType: 'Current Account',
                branch: 'Bangalore Central',
                accountHolder: 'Agies Technologies Pvt Ltd',
                description: 'Operational expenses account'
            }
        ];
    }

    // Setup payment history
    async setupPaymentHistory() {
        this.paymentHistory = [
            {
                id: 'pay_001',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                amount: 299,
                currency: 'INR',
                method: 'UPI - PhonePe',
                status: 'completed',
                upiId: 'user123@ybl',
                reference: 'UPI123456789'
            },
            {
                id: 'pay_002',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                amount: 599,
                currency: 'INR',
                method: 'Bank Transfer - SBI',
                status: 'completed',
                accountNumber: '12345678901',
                reference: 'NEFT123456789'
            }
        ];
    }

    // Show Indian payment options
    showIndianPaymentOptions(planId, amount) {
        const modal = document.createElement('div');
        modal.id = 'indian-payment-modal';
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">🇮🇳 Indian Payment Options</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                
                <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-blue-800 mb-2">Plan: ${this.getPlanName(planId)}</h3>
                    <p class="text-blue-700">Amount: ₹${amount} (${this.getPlanDuration(planId)})</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- UPI Payment Section -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                            📱 UPI Payments
                        </h3>
                        
                        <div class="space-y-3">
                            ${this.upiApps.map(app => `
                                <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
                                    <div class="flex items-center space-x-3">
                                        <span class="text-2xl">${app.icon}</span>
                                        <div>
                                            <div class="font-medium">${app.name}</div>
                                            <div class="text-sm text-gray-500">${app.description}</div>
                                        </div>
                                    </div>
                                    <button onclick="window.indianPaymentGateways.processUPIPayment('${app.id}', '${planId}', ${amount})" 
                                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                                        Pay ₹${amount}
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p class="text-sm text-yellow-800">
                                💡 <strong>UPI ID:</strong> agies@ybl<br>
                                📱 Scan QR code or use UPI ID to pay
                            </p>
                        </div>
                    </div>
                    
                    <!-- Bank Transfer Section -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                            🏦 Bank Transfer
                        </h3>
                        
                        <div class="space-y-3">
                            ${this.bankAccounts.map(account => `
                                <div class="p-3 bg-white rounded-lg border">
                                    <div class="font-medium text-gray-800">${account.bank}</div>
                                    <div class="text-sm text-gray-600 mb-2">${account.accountType}</div>
                                    
                                    <div class="space-y-1 text-sm">
                                        <div><strong>Account:</strong> ${account.accountNumber}</div>
                                        <div><strong>IFSC:</strong> ${account.ifscCode}</div>
                                        <div><strong>Branch:</strong> ${account.branch}</div>
                                        <div><strong>Holder:</strong> ${account.accountHolder}</div>
                                    </div>
                                    
                                    <button onclick="window.indianPaymentGateways.showBankTransferDetails('${account.id}', '${planId}', ${amount})" 
                                            class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                                        Transfer ₹${amount}
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p class="text-sm text-green-800">
                                ✅ <strong>NEFT/IMPS/RTGS</strong> transfers accepted<br>
                                📧 Send screenshot to: payments@agies.com
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Instructions -->
                <div class="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h4 class="font-semibold mb-2">📋 Payment Instructions</h4>
                    <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        <li>Choose your preferred payment method above</li>
                        <li>Complete the payment using the provided details</li>
                        <li>Send payment screenshot to payments@agies.com</li>
                        <li>Your subscription will be activated within 2 hours</li>
                        <li>Receive confirmation email with login credentials</li>
                    </ol>
                </div>
                
                <!-- Contact Support -->
                <div class="mt-4 text-center">
                    <p class="text-sm text-gray-600">
                        Need help? Contact us at 
                        <a href="mailto:support@agies.com" class="text-blue-600 hover:underline">support@agies.com</a>
                        or call <span class="font-medium">+91-98765-43210</span>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Process UPI payment
    async processUPIPayment(appId, planId, amount) {
        try {
            const app = this.upiApps.find(a => a.id === appId);
            if (!app) {
                throw new Error('UPI app not found');
            }

            // Show UPI payment modal
            this.showUPIPaymentModal(app, planId, amount);
            
        } catch (error) {
            console.error('UPI payment failed:', error);
            this.showError('UPI payment failed: ' + error.message);
        }
    }

    // Show UPI payment modal
    showUPIPaymentModal(app, planId, amount) {
        const modal = document.createElement('div');
        modal.id = 'upi-payment-modal';
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-md w-full">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-2">${app.icon}</div>
                    <h3 class="text-xl font-bold text-gray-800">${app.name} Payment</h3>
                    <p class="text-gray-600">Complete your payment using ${app.name}</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600 mb-2">₹${amount}</div>
                            <div class="text-sm text-gray-600">${this.getPlanName(planId)}</div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 class="font-semibold text-blue-800 mb-2">UPI Details</h4>
                        <div class="space-y-2 text-sm">
                            <div><strong>UPI ID:</strong> ${app.upiId}</div>
                            <div><strong>Merchant:</strong> Agies Technologies</div>
                            <div><strong>Amount:</strong> ₹${amount}</div>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 class="font-semibold text-yellow-800 mb-2">How to Pay</h4>
                        <ol class="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                            <li>Open ${app.name} app</li>
                            <li>Enter UPI ID: <strong>${app.upiId}</strong></li>
                            <li>Enter amount: <strong>₹${amount}</strong></li>
                            <li>Add note: <strong>Agies ${planId}</strong></li>
                            <li>Complete payment</li>
                        </ol>
                    </div>
                </div>
                
                <div class="mt-6 flex space-x-3">
                    <button onclick="window.indianPaymentGateways.copyUPIId('${app.upiId}')" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg">
                        Copy UPI ID
                    </button>
                    <button onclick="window.indianPaymentGateways.markPaymentComplete('${planId}', ${amount}, 'UPI - ${app.name}')" 
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg">
                        Payment Done
                    </button>
                </div>
                
                <div class="mt-4 text-center">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-500 hover:text-gray-700">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Show bank transfer details
    showBankTransferDetails(accountId, planId, amount) {
        const account = this.bankAccounts.find(a => a.id === accountId);
        if (!account) return;

        const modal = document.createElement('div');
        modal.id = 'bank-transfer-modal';
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-lg w-full">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-2">🏦</div>
                    <h3 class="text-xl font-bold text-gray-800">Bank Transfer Details</h3>
                    <p class="text-gray-600">Transfer ₹${amount} to complete your subscription</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600 mb-2">₹${amount}</div>
                            <div class="text-sm text-gray-600">${this.getPlanName(planId)}</div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 class="font-semibold text-blue-800 mb-2">Bank Account Details</h4>
                        <div class="space-y-2 text-sm">
                            <div><strong>Bank:</strong> ${account.bank}</div>
                            <div><strong>Account Number:</strong> ${account.accountNumber}</div>
                            <div><strong>IFSC Code:</strong> ${account.ifscCode}</div>
                            <div><strong>Branch:</strong> ${account.branch}</div>
                            <div><strong>Account Holder:</strong> ${account.accountHolder}</div>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 class="font-semibold text-yellow-800 mb-2">Transfer Instructions</h4>
                        <ol class="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                            <li>Use NEFT/IMPS/RTGS to transfer ₹${amount}</li>
                            <li>Add reference: <strong>Agies ${planId}</strong></li>
                            <li>Send screenshot to: payments@agies.com</li>
                            <li>Subscription activated within 2 hours</li>
                        </ol>
                    </div>
                </div>
                
                <div class="mt-6 flex space-x-3">
                    <button onclick="window.indianPaymentGateways.copyBankDetails('${account.accountNumber}', '${account.ifscCode}')" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg">
                        Copy Details
                    </button>
                    <button onclick="window.indianPaymentGateways.markPaymentComplete('${planId}', ${amount}, 'Bank Transfer - ${account.bank}')" 
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg">
                        Transfer Done
                    </button>
                </div>
                
                <div class="mt-4 text-center">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-500 hover:text-gray-700">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Copy UPI ID to clipboard
    copyUPIId(upiId) {
        navigator.clipboard.writeText(upiId).then(() => {
            this.showNotification('UPI ID copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy UPI ID', 'error');
        });
    }

    // Copy bank details to clipboard
    copyBankDetails(accountNumber, ifscCode) {
        const details = `Account: ${accountNumber}\nIFSC: ${ifscCode}`;
        navigator.clipboard.writeText(details).then(() => {
            this.showNotification('Bank details copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy bank details', 'error');
        });
    }

    // Mark payment as complete
    async markPaymentComplete(planId, amount, method) {
        try {
            // Add to payment history
            const payment = {
                id: 'pay_' + Date.now(),
                date: new Date().toISOString(),
                amount: amount,
                currency: 'INR',
                method: method,
                status: 'pending_verification',
                planId: planId,
                reference: 'DEMO_' + Date.now()
            };
            
            this.paymentHistory.push(payment);
            
            // Show payment verification modal
            this.showPaymentVerificationModal(payment);
            
        } catch (error) {
            console.error('Failed to mark payment complete:', error);
            this.showError('Failed to process payment: ' + error.message);
        }
    }

    // Show payment verification modal
    showPaymentVerificationModal(payment) {
        const modal = document.createElement('div');
        modal.id = 'payment-verification-modal';
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-md w-full">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-2">📧</div>
                    <h3 class="text-xl font-bold text-gray-800">Payment Verification</h3>
                    <p class="text-gray-600">Send payment proof to activate subscription</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 class="font-semibold text-green-800 mb-2">Payment Details</h4>
                        <div class="text-sm text-green-700">
                            <div><strong>Amount:</strong> ₹${payment.amount}</div>
                            <div><strong>Method:</strong> ${payment.method}</div>
                            <div><strong>Reference:</strong> ${payment.reference}</div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 class="font-semibold text-blue-800 mb-2">Next Steps</h4>
                        <ol class="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                            <li>Take screenshot of payment confirmation</li>
                            <li>Email to: <strong>payments@agies.com</strong></li>
                            <li>Subject: <strong>Payment Proof - ${payment.reference}</strong></li>
                            <li>Include your email address in the email</li>
                        </ol>
                    </div>
                    
                    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p class="text-sm text-yellow-800">
                            ⏰ <strong>Processing Time:</strong> 2-4 hours<br>
                            📧 <strong>Confirmation:</strong> You'll receive login credentials via email
                        </p>
                    </div>
                </div>
                
                <div class="mt-6 flex space-x-3">
                    <button onclick="window.open('mailto:payments@agies.com?subject=Payment Proof - ${payment.reference}&body=Hi, I have completed the payment of ₹${payment.amount} via ${payment.method}. Reference: ${payment.reference}. My email address is: [YOUR_EMAIL]')" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg">
                        📧 Send Email
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 3000);
    }

    // Show error
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Get plan name
    getPlanName(planId) {
        const planNames = {
            'free': 'Free Plan',
            'premium': 'Premium Plan',
            'business': 'Business Plan',
            'enterprise': 'Enterprise Plan'
        };
        return planNames[planId] || 'Unknown Plan';
    }

    // Get plan duration
    getPlanDuration(planId) {
        return 'Monthly subscription';
    }

    // Get payment history
    getPaymentHistory() {
        return this.paymentHistory;
    }

    // Get bank accounts
    getBankAccounts() {
        return this.bankAccounts;
    }

    // Get UPI apps
    getUPIApps() {
        return this.upiApps;
    }

    // Get payment status
    getPaymentStatus() {
        return {
            isInitialized: this.isInitialized,
            totalPayments: this.paymentHistory.length,
            completedPayments: this.paymentHistory.filter(p => p.status === 'completed').length,
            pendingPayments: this.paymentHistory.filter(p => p.status === 'pending_verification').length
        };
    }
}

// Initialize Indian payment gateways
const indianPaymentGateways = new IndianPaymentGateways();

// Export for global use
window.IndianPaymentGateways = IndianPaymentGateways;
window.indianPaymentGateways = indianPaymentGateways;

console.log('🇮🇳 Indian Payment Gateways Ready');
console.log('📱 PhonePe, UPI, Bank Transfer enabled');
console.log('🏦 SBI and other bank accounts configured');
console.log('💰 Direct money transfer to Indian accounts active');
